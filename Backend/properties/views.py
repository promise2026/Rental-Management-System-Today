
from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import (
    PermissionDenied,
    ValidationError,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import (
    PropertyRegistration,
    PropertyType,
    PropertyOwnership,
    PropertyImage,
    PropertyInquiry,
)
from .serializers import (
    PropertyRegistrationSerializer,
    PropertyTypeSerializer,
    PropertyOwnershipSerializer,
    PropertyImageSerializer,
    PropertyInquirySerializer,
)


def user_role(user):
    """Return the user's profile role, if available."""
    try:
        return user.profile.role
    except AttributeError:
        return ""


def can_manage_property(user, property_object):
    """Check whether a user can manage a particular property."""
    if not user.is_authenticated:
        return False

    if user.is_staff:
        return True

    role = user_role(user)

    if role == "owner":
        return property_object.owner.user_id == user.id

    if role == "agent":
        return (
            property_object.agent or ""
        ).lower() == user.username.lower()

    return False


class PropertyRegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyRegistrationSerializer
    permission_classes = [IsAuthenticated]

    queryset = PropertyRegistration.objects.select_related(
        "property_type",
        "owner",
        "owner__user",
    ).prefetch_related("images")

    filterset_fields = ["property_type", "status", "location"]
    search_fields = ["name", "location", "agent", "owner__owner_name"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-created_at"]

    def get_permissions(self):
        """Allow public browsing but protect write operations."""
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        # Anonymous visitors can only see available properties.
        if not user.is_authenticated:
            return self.queryset.filter(status="available")

        if user.is_staff:
            return self.queryset

        role = user_role(user)

        if role == "owner":
            return self.queryset.filter(owner__user=user)

        if role == "agent":
            return self.queryset.filter(agent__iexact=user.username)

        # Property seekers can browse available listings.
        if role == "seeker":
            return self.queryset.filter(status="available")

        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        role = user_role(request.user)

        if not (
            request.user.is_staff
            or role in ("owner", "agent")
        ):
            raise PermissionDenied(
                "Only staff, property owners, and agents "
                "can create property listings."
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        role = user_role(user)

        if user.is_staff:
            owner = serializer.validated_data.get("owner")

            if owner is None:
                raise ValidationError({
                    "owner": "Select an existing property owner."
                })

            serializer.save(owner=owner)
            return

        if role == "owner":
            try:
                ownership = PropertyOwnership.objects.get(user=user)
            except PropertyOwnership.DoesNotExist:
                raise ValidationError({
                    "owner": (
                        "Create your property ownership profile first."
                    )
                })

            # Owners cannot assign another owner's record.
            serializer.save(owner=ownership)
            return

        if role == "agent":
            owner = serializer.validated_data.get("owner")

            if owner is None:
                raise ValidationError({
                    "owner": (
                        "Select the owner whose property you are listing."
                    )
                })

            serializer.save(
                owner=owner,
                agent=user.username,
            )
            return

        raise PermissionDenied(
            "You cannot create property listings."
        )

    def update(self, request, *args, **kwargs):
        property_object = self.get_object()

        if not can_manage_property(request.user, property_object):
            raise PermissionDenied(
                "You cannot update this property."
            )

        partial = kwargs.pop("partial", False)

        serializer = self.get_serializer(
            property_object,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)

        if request.user.is_staff:
            serializer.save()

        elif user_role(request.user) == "owner":
            serializer.save(
                owner=property_object.owner,
                agent=property_object.agent,
            )

        else:
            serializer.save(
                owner=property_object.owner,
                agent=request.user.username,
            )

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        property_object = self.get_object()

        if not can_manage_property(request.user, property_object):
            raise PermissionDenied(
                "You cannot delete this property."
            )

        property_object.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PropertyTypeViewSet(viewsets.ModelViewSet):
    queryset = PropertyType.objects.all().order_by("name")
    serializer_class = PropertyTypeSerializer
    permission_classes = [IsAuthenticated]

    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]

    def get_permissions(self):
        """Allow everyone to read property types."""
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can create property types."
            )

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can update property types."
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can update property types."
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can delete property types."
            )

        return super().destroy(request, *args, **kwargs)


class PropertyOwnershipViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyOwnershipSerializer
    permission_classes = [IsAuthenticated]

    queryset = PropertyOwnership.objects.select_related("user").all()

    search_fields = ["owner_name", "phone_number", "email"]
    ordering_fields = ["owner_name", "created_at"]
    ordering = ["owner_name"]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return self.queryset

        if user_role(user) == "owner":
            return self.queryset.filter(user=user)

        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        if not (
            request.user.is_staff
            or user_role(request.user) == "owner"
        ):
            raise PermissionDenied(
                "Only staff and property owners can create owner records."
            )

        if user_role(request.user) == "owner":
            if PropertyOwnership.objects.filter(
                user=request.user
            ).exists():
                raise ValidationError({
                    "owner": "You already have an ownership record."
                })

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can update ownership records."
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can update ownership records."
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied(
                "Only staff can delete ownership records."
            )

        return super().destroy(request, *args, **kwargs)


class PropertyImageViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated]

    queryset = PropertyImage.objects.select_related(
        "property",
        "property__owner",
        "property__owner__user",
    ).all()

    filterset_fields = ["property"]
    search_fields = ["caption", "property__name"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_permissions(self):
        """Allow public image browsing, but protect image changes."""
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        # Public visitors see images of available properties only.
        if not user.is_authenticated:
            return self.queryset.filter(
                property__status="available"
            )

        if user.is_staff:
            return self.queryset

        role = user_role(user)

        if role == "owner":
            return self.queryset.filter(
                property__owner__user=user
            )

        if role == "agent":
            return self.queryset.filter(
                property__agent__iexact=user.username
            )

        if role == "seeker":
            return self.queryset.filter(
                property__status="available"
            )

        return self.queryset.none()

    def _get_managed_property(self, property_id):
        try:
            property_object = PropertyRegistration.objects.get(
                pk=property_id
            )
        except PropertyRegistration.DoesNotExist:
            raise ValidationError({
                "property": "The selected property does not exist."
            })

        if not can_manage_property(
            self.request.user,
            property_object,
        ):
            raise PermissionDenied(
                "You cannot manage images for this property."
            )

        return property_object

    def create(self, request, *args, **kwargs):
        property_id = request.data.get("property")

        if not property_id:
            raise ValidationError({
                "property": "A property ID is required."
            })

        self._get_managed_property(property_id)

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        image_object = self.get_object()

        if not can_manage_property(
            request.user,
            image_object.property,
        ):
            raise PermissionDenied(
                "You cannot update this property image."
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        image_object = self.get_object()

        if not can_manage_property(
            request.user,
            image_object.property,
        ):
            raise PermissionDenied(
                "You cannot update this property image."
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        image_object = self.get_object()

        if not can_manage_property(
            request.user,
            image_object.property,
        ):
            raise PermissionDenied(
                "You cannot delete this property image."
            )

        image_object.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PropertyInquiryViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyInquirySerializer
    permission_classes = [IsAuthenticated]

    queryset = PropertyInquiry.objects.select_related(
        "property",
        "property__owner",
        "property__owner__user",
        "user",
    ).all()

    filterset_fields = ["status", "property"]
    search_fields = [
        "message",
        "property__name",
        "user__username",
    ]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return self.queryset

        role = user_role(user)

        if role == "owner":
            return self.queryset.filter(
                property__owner__user=user
            )

        if role == "agent":
            return self.queryset.filter(
                property__agent__iexact=user.username
            )

        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        property_object = serializer.validated_data["property"]

        if property_object.status != "available":
            raise ValidationError({
                "property": (
                    "You can only inquire about available properties."
                )
            })

        serializer.save(
            user=self.request.user,
            status="pending",
        )

    def update(self, request, *args, **kwargs):
        inquiry = self.get_object()

        if not can_manage_property(
            request.user,
            inquiry.property,
        ):
            raise PermissionDenied(
                "You cannot update this inquiry."
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        inquiry = self.get_object()

        if not can_manage_property(
            request.user,
            inquiry.property,
        ):
            raise PermissionDenied(
                "You cannot update this inquiry."
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        inquiry = self.get_object()

        if not can_manage_property(
            request.user,
            inquiry.property,
        ):
            raise PermissionDenied(
                "You cannot delete this inquiry."
            )

        inquiry.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
