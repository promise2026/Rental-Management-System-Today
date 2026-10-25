from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import serializers

from .models import (
    UserProfile,
    FavoriteProperty
)


class UserProfileSerializer(
    serializers.ModelSerializer
):

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    first_name = serializers.CharField(
        source='user.first_name',
        read_only=True
    )

    last_name = serializers.CharField(
        source='user.last_name',
        read_only=True
    )

    class Meta:

        model = UserProfile

        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'role',
            'location',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'created_at',
            'updated_at'
        ]


class FavoritePropertySerializer(
    serializers.ModelSerializer
):

    property_name = serializers.CharField(
        source='property.name',
        read_only=True
    )

    property_location = serializers.CharField(
        source='property.location',
        read_only=True
    )

    property_price = serializers.IntegerField(
        source='property.price',
        read_only=True
    )

    property_status = serializers.CharField(
        source='property.status',
        read_only=True
    )

    class Meta:

        model = FavoriteProperty

        fields = [
            'id',
            'property',
            'property_name',
            'property_location',
            'property_price',
            'property_status',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'property_name',
            'property_location',
            'property_price',
            'property_status',
            'created_at'
        ]


class RegisterSerializer(
    serializers.ModelSerializer
):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password_confirm = serializers.CharField(
        write_only=True
    )

    phone_number = serializers.CharField(
        required=False,
        allow_blank=True
    )

    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        default='seeker'
    )

    location = serializers.CharField(
        required=False,
        allow_blank=True
    )

    class Meta:

        model = User

        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'phone_number',
            'role',
            'location'
        ]

    def validate_username(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                'Username is required.'
            )

        if User.objects.filter(
            username__iexact=value
        ).exists():

            raise serializers.ValidationError(
                'A user with this username already exists.'
            )

        return value

    def validate_email(self, value):

        value = value.strip().lower()

        if value and User.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                'A user with this email already exists.'
            )

        return value

    def validate(self, data):

        password = data.get('password')

        password_confirm = data.get(
            'password_confirm'
        )

        if password != password_confirm:

            raise serializers.ValidationError({
                'password_confirm':
                    'Passwords do not match.'
            })

        return data

    def create(self, validated_data):

        phone_number = validated_data.pop(
            'phone_number',
            ''
        )

        role = validated_data.pop(
            'role',
            'seeker'
        )

        location = validated_data.pop(
            'location',
            ''
        )

        validated_data.pop(
            'password_confirm'
        )

        password = validated_data.pop(
            'password'
        )

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            role=role,
            location=location
        )

        return user


class LoginSerializer(
    serializers.Serializer
):

    username = serializers.CharField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, data):

        username = data.get('username')

        password = data.get('password')

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:

            raise serializers.ValidationError(
                'Invalid username or password.'
            )

        if not user.is_active:

            raise serializers.ValidationError(
                'This account is inactive.'
            )

        data['user'] = user

        return data