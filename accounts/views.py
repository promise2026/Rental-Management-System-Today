
from django.contrib.auth import logout
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.models import PropertyRegistration

from .models import UserProfile, FavoriteProperty
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    FavoritePropertySerializer,
)


def get_or_create_user_profile(user):
    """Get the user's profile or create one if it does not exist."""
    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            "role": "seeker",
            "phone_number": "",
            "location": "",
        },
    )
    return profile


class RegisterView(APIView):
    """Register a new user account."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()
        profile = get_or_create_user_profile(user)

        return Response(
            {
                "message": "User registered successfully.",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "role": profile.role,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Authenticate a user and return an API token."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.validated_data["user"]
        profile = get_or_create_user_profile(user)

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Login successful.",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": profile.role,
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """Log out the authenticated user and invalidate their API token."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        logout(request)

        return Response(
            {"message": "Logout successful."},
            status=status.HTTP_200_OK,
        )


class MyProfileView(APIView):
    """View and update the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_user_profile(request.user)
        serializer = UserProfileSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        profile = get_or_create_user_profile(request.user)

        serializer = UserProfileSerializer(
            profile,
            data=request.data,
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        profile = get_or_create_user_profile(request.user)

        serializer = UserProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class FavoritePropertyView(APIView):
    """List, add, and remove a user's favorite properties."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = (
            FavoriteProperty.objects
            .filter(user=request.user)
            .select_related("property")
        )

        serializer = FavoritePropertySerializer(
            favorites,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        property_id = request.data.get("property")

        if property_id in (None, ""):
            return Response(
                {"error": "Property ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            property_id = int(property_id)
        except (ValueError, TypeError):
            return Response(
                {"error": "A valid property ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if property_id <= 0:
            return Response(
                {"error": "A valid property ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_exists = PropertyRegistration.objects.filter(
            pk=property_id
        ).exists()

        if not property_exists:
            return Response(
                {"error": "Property not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        favorite, created = FavoriteProperty.objects.get_or_create(
            user=request.user,
            property_id=property_id,
        )

        if not created:
            return Response(
                {"message": "Property is already in favorites."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = FavoritePropertySerializer(favorite)

        return Response(
            {
                "message": "Property added to favorites.",
                "favorite": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request):
        property_id = request.data.get("property")

        if property_id in (None, ""):
            return Response(
                {"error": "Property ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            property_id = int(property_id)
        except (ValueError, TypeError):
            return Response(
                {"error": "A valid property ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if property_id <= 0:
            return Response(
                {"error": "A valid property ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        favorite = FavoriteProperty.objects.filter(
            user=request.user,
            property_id=property_id,
        ).first()

        if favorite is None:
            return Response(
                {"error": "Property is not in your favorites."},
                status=status.HTTP_404_NOT_FOUND,
            )

        favorite.delete()

        return Response(
            {"message": "Property removed from favorites."},
            status=status.HTTP_200_OK,
        )