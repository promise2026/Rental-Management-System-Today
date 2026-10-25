
from rest_framework import serializers

from .models import (
    PropertyRegistration,
    PropertyType,
    PropertyOwnership,
    PropertyImage,
    PropertyInquiry,
)


class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = [
            "id",
            "name",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Property type name cannot be empty."
            )
        return value

    def validate_description(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Property type description cannot be empty."
            )
        return value


class PropertyOwnershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyOwnership
        fields = [
            "id",
            "owner_name",
            "phone_number",
            "email",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_owner_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Owner name cannot be empty."
            )
        return value

    def validate_phone_number(self, value):
        value = str(value).strip()
        if not value:
            raise serializers.ValidationError(
                "Phone number is required."
            )
        return value


class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = [
            "id",
            "property",
            "image",
            "image_url",
            "caption",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url

    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError(
                "An image is required."
            )
        return value

    def validate_caption(self, value):
        return value.strip() if value else value


class PropertyRegistrationSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(
        many=True,
        read_only=True,
    )

    property_type_details = PropertyTypeSerializer(
        source="property_type",
        read_only=True,
    )

    owner_details = PropertyOwnershipSerializer(
        source="owner",
        read_only=True,
    )

    # Accept an existing owner ID when permitted by the view.
    # The view must enforce owner/agent assignment permissions.
    owner = serializers.PrimaryKeyRelatedField(
        queryset=PropertyOwnership.objects.all(),
        required=False,
    )

    class Meta:
        model = PropertyRegistration
        fields = [
            "id",
            "name",
            "property_type",
            "property_type_details",
            "location",
            "price",
            "owner",
            "owner_details",
            "agent",
            "status",
            "contact",
            "created_at",
            "updated_at",
            "images",
        ]
        read_only_fields = [
            "id",
            "property_type_details",
            "owner_details",
            "images",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Property name cannot be empty."
            )
        return value

    def validate_location(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Property location cannot be empty."
            )
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Property price cannot be negative."
            )
        return value

    def validate_agent(self, value):
        return value.strip() if value else value

    def validate_contact(self, value):
        value = str(value).strip()
        if not value:
            raise serializers.ValidationError(
                "Contact number is required."
            )
        return value


class PropertyInquirySerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(
        source="property.name",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = PropertyInquiry
        fields = [
            "id",
            "property",
            "property_name",
            "user",
            "username",
            "message",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "username",
            "property_name",
            "created_at",
            "updated_at",
        ]

    def validate_message(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Inquiry message cannot be empty."
            )
        return value

    def validate_status(self, value):
        allowed_statuses = [
            "pending",
            "responded",
            "closed",
        ]
        if value not in allowed_statuses:
            raise serializers.ValidationError(
                "Invalid inquiry status."
            )
        return value
