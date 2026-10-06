from rest_framework import serializers

from .models import (
    PropertyRegistration,
    PropertyType,
    PropertyOwnership,
    PropertyImage
)


class PropertyTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyType
        fields = '__all__'


class PropertyOwnershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyOwnership
        fields = '__all__'


class PropertyImageSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = [
            'id',
            'property',
            'image',
            'image_url',
            'caption',
            'created_at'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')

        if obj.image:
            if request:
                return request.build_absolute_uri(
                    obj.image.url
                )

            return obj.image.url

        return None


class PropertyRegistrationSerializer(serializers.ModelSerializer):

    images = PropertyImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = PropertyRegistration
        fields = [
            'id',
            'name',
            'property_type',
            'location',
            'price',
            'owner',
            'agent',
            'status',
            'contact',
            'created_at',
            'updated_at',
            'images'
        ]

        read_only_fields = [
            'images'
        ]