
from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import UserProfile, FavoriteProperty
from properties.models import (
    PropertyType,
    PropertyOwnership,
    PropertyRegistration,
)


class AccountAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_url = "/api/accounts/register/"
        self.login_url = "/api/accounts/login/"
        self.logout_url = "/api/accounts/logout/"
        self.profile_url = "/api/accounts/profile/"
        self.favorites_url = "/api/accounts/favorites/"

        self.user = User.objects.create_user(
            username="testseeker",
            email="seeker@example.com",
            password="TestPassword2026!",
        )

        UserProfile.objects.create(
            user=self.user,
            role="seeker",
            phone_number="0700000001",
            location="Entebbe",
        )

        self.property_type = PropertyType.objects.create(
            name="Test Apartment",
            description="Apartment for account tests",
        )

        self.owner_user = User.objects.create_user(
            username="testowner",
            password="OwnerPassword2026!",
        )

        UserProfile.objects.create(
            user=self.owner_user,
            role="owner",
        )

        self.owner = PropertyOwnership.objects.create(
            user=self.owner_user,
            owner_name="Test Owner",
            phone_number="0700000002",
        )

        self.property = PropertyRegistration.objects.create(
            name="Test Available Apartment",
            property_type=self.property_type,
            location="Entebbe",
            price=500000,
            owner=self.owner,
            agent="",
            status="available",
            contact="0700000002",
        )

    def test_registration_creates_user_and_profile(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "newseeker",
                "email": "newseeker@example.com",
                "password": "NewPassword2026!",
                "password_confirm": "NewPassword2026!",
                "role": "seeker",
                "phone_number": "0700000003",
                "location": "Kampala",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            msg=str(response.data),
        )

        self.assertTrue(
            User.objects.filter(username="newseeker").exists()
        )

        new_user = User.objects.get(username="newseeker")

        self.assertTrue(
            UserProfile.objects.filter(
                user=new_user,
                role="seeker",
            ).exists()
        )

    def test_registration_rejects_duplicate_username(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "testseeker",
                "email": "duplicate@example.com",
                "password": "AnotherPassword2026!",
                "password_confirm": "AnotherPassword2026!",
                "role": "seeker",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_login_returns_authentication_token(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "testseeker",
                "password": "TestPassword2026!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            msg=str(response.data),
        )

        self.assertIn("token", response.data)
        self.assertTrue(response.data["token"])

    def test_login_rejects_wrong_password(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "testseeker",
                "password": "WrongPassword!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_profile_requires_authentication(self):
        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_authenticated_user_can_view_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            msg=str(response.data),
        )

    def test_user_can_add_property_to_favorites(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.favorites_url,
            {"property": self.property.id},
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_200_OK,
                status.HTTP_201_CREATED,
            ],
            msg=str(response.data),
        )

        self.assertTrue(
            FavoriteProperty.objects.filter(
                user=self.user,
                property=self.property,
            ).exists()
        )

    def test_user_cannot_favorite_same_property_twice(self):
        FavoriteProperty.objects.create(
            user=self.user,
            property=self.property,
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.favorites_url,
            {"property": self.property.id},
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_200_OK,
                status.HTTP_201_CREATED,
                status.HTTP_400_BAD_REQUEST,
                status.HTTP_409_CONFLICT,
            ],
            msg=str(response.data),
        )

        self.assertEqual(
            FavoriteProperty.objects.filter(
                user=self.user,
                property=self.property,
            ).count(),
            1,
        )

    def test_user_can_view_favorites(self):
        FavoriteProperty.objects.create(
            user=self.user,
            property=self.property,
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.favorites_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            msg=str(response.data),
        )

        self.assertTrue(response.data)

    def test_logout_requires_authentication(self):
        response = self.client.post(self.logout_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_authenticated_user_can_logout(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.logout_url)

        self.assertIn(
            response.status_code,
            [
                status.HTTP_200_OK,
                status.HTTP_204_NO_CONTENT,
            ],
            msg=str(response.data),
        )
