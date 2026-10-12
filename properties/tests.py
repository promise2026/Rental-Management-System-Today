
import io
import tempfile

from PIL import Image

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import UserProfile
from properties.models import (
    PropertyType,
    PropertyOwnership,
    PropertyRegistration,
    PropertyInquiry,
)


class RentalPropertyAPITests(TestCase):
    """Automated API tests for rental properties, images and inquiries."""

    def setUp(self):
        # Keep test uploads separate from the project's real media files.
        self.temp_media = tempfile.TemporaryDirectory()
        self.media_settings = override_settings(
            MEDIA_ROOT=self.temp_media.name
        )
        self.media_settings.enable()

        self.addCleanup(self.media_settings.disable)
        self.addCleanup(self.temp_media.cleanup)

        self.client = APIClient()

        # Create test users.
        self.seeker = self.create_user("test_seeker", "seeker")
        self.owner_user = self.create_user("test_owner", "owner")
        self.other_owner_user = self.create_user(
            "other_owner", "owner"
        )
        self.agent = self.create_user("test_agent", "agent")

        # Create property ownership records.
        self.owner = PropertyOwnership.objects.create(
            user=self.owner_user,
            owner_name="Test Owner",
            phone_number="0700000001",
            email="owner@example.com",
        )

        self.other_owner = PropertyOwnership.objects.create(
            user=self.other_owner_user,
            owner_name="Other Owner",
            phone_number="0700000003",
            email="otherowner@example.com",
        )

        self.property_type = PropertyType.objects.create(
            name="Test House",
            description="House created for automated testing",
        )

        # Property managed by the test owner and agent.
        self.available_property = self.create_property(
            name="Available Test House",
            owner=self.owner,
            agent=self.agent.username,
            property_status="available",
        )

        # Property managed by a different owner and agent.
        self.unmanaged_property = self.create_property(
            name="Another Owner House",
            owner=self.other_owner,
            agent="different_agent",
            property_status="available",
        )

        self.occupied_property = self.create_property(
            name="Occupied Test House",
            owner=self.owner,
            agent=self.agent.username,
            property_status="occupied",
        )

    def create_user(self, username, role):
        user = User.objects.create_user(
            username=username,
            password="TestPassword2026!",
        )

        UserProfile.objects.create(
            user=user,
            role=role,
            phone_number="0700000000",
            location="Entebbe",
        )

        return user

    def create_property(
        self,
        name,
        owner,
        agent,
        property_status,
    ):
        return PropertyRegistration.objects.create(
            name=name,
            property_type=self.property_type,
            location="Entebbe",
            price=500000,
            owner=owner,
            agent=agent,
            status=property_status,
            contact="0700000001",
        )

    def upload_test_image(self):
        """Create a valid PNG image for upload tests."""
        image_buffer = io.BytesIO()

        Image.new("RGB", (10, 10), color="red").save(
            image_buffer,
            format="PNG",
        )

        image_buffer.seek(0)

        return SimpleUploadedFile(
            "test-house.png",
            image_buffer.getvalue(),
            content_type="image/png",
        )

    def test_seeker_only_sees_available_properties(self):
        self.client.force_authenticate(user=self.seeker)

        response = self.client.get("/api/properties/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        results = response.data.get("results", response.data)
        property_ids = [item["id"] for item in results]

        self.assertIn(
            self.available_property.id,
            property_ids,
        )
        self.assertNotIn(
            self.occupied_property.id,
            property_ids,
        )

        for item in results:
            self.assertEqual(item["status"], "available")

    def test_owner_cannot_edit_another_owners_property(self):
        self.client.force_authenticate(user=self.other_owner_user)

        response = self.client.patch(
            f"/api/properties/{self.available_property.id}/",
            {"name": "Unauthorized Change"},
            format="json",
        )

        # The API may return 404 to hide listings the owner cannot access.
        self.assertIn(
            response.status_code,
            [
                status.HTTP_403_FORBIDDEN,
                status.HTTP_404_NOT_FOUND,
            ],
        )

        self.available_property.refresh_from_db()

        self.assertEqual(
            self.available_property.name,
            "Available Test House",
        )

    def test_agent_cannot_upload_image_to_unmanaged_property(self):
        self.client.force_authenticate(user=self.agent)

        response = self.client.post(
            "/api/property-images/",
            {
                "property": self.unmanaged_property.id,
                "caption": "Unauthorized image",
                "image": self.upload_test_image(),
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_agent_can_upload_image_to_managed_property(self):
        self.client.force_authenticate(user=self.agent)

        response = self.client.post(
            "/api/property-images/",
            {
                "property": self.available_property.id,
                "caption": "Test house exterior",
                "image": self.upload_test_image(),
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            msg=str(response.data),
        )

        self.assertTrue(
            self.available_property.images.exists()
        )

        image = self.available_property.images.first()

        self.assertEqual(
            image.caption,
            "Test house exterior",
        )

    def test_seeker_cannot_upload_property_image(self):
        self.client.force_authenticate(user=self.seeker)

        response = self.client.post(
            "/api/property-images/",
            {
                "property": self.available_property.id,
                "caption": "Seeker upload attempt",
                "image": self.upload_test_image(),
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_seeker_can_inquire_about_available_property(self):
        self.client.force_authenticate(user=self.seeker)

        response = self.client.post(
            "/api/inquiries/",
            {
                "property": self.available_property.id,
                "message": "Is this house still available?",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            msg=str(response.data),
        )

        inquiry = PropertyInquiry.objects.get(
            property=self.available_property,
            user=self.seeker,
        )

        self.assertEqual(inquiry.status, "pending")
        self.assertEqual(
            inquiry.message,
            "Is this house still available?",
        )

    def test_seeker_cannot_inquire_about_occupied_property(self):
        self.client.force_authenticate(user=self.seeker)

        response = self.client.post(
            "/api/inquiries/",
            {
                "property": self.occupied_property.id,
                "message": "I want to rent this house.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            msg=str(response.data),
        )

        self.assertFalse(
            PropertyInquiry.objects.filter(
                property=self.occupied_property,
                user=self.seeker,
            ).exists()
        )

    def test_seeker_only_sees_own_inquiries(self):
        another_seeker = self.create_user(
            "another_seeker",
            "seeker",
        )

        PropertyInquiry.objects.create(
            property=self.available_property,
            user=self.seeker,
            message="My inquiry",
        )

        PropertyInquiry.objects.create(
            property=self.available_property,
            user=another_seeker,
            message="Another user's private inquiry",
        )

        self.client.force_authenticate(user=self.seeker)

        response = self.client.get("/api/inquiries/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        results = response.data.get("results", response.data)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["message"], "My inquiry")
