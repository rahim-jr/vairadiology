from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import AnnotatedImage, Polygon, Task


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs["email"]
        password = attrs["password"]
        user = authenticate(username=email, password=password)

        if user is None:
            User = get_user_model()
            matched_user = User.objects.filter(email__iexact=email).first()
            if matched_user is not None:
                user = authenticate(username=matched_user.get_username(), password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        attrs["user"] = user
        return attrs


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "status", "priority", "due_date", "tags", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_tags(self, value):
        if not isinstance(value, list) or any(not isinstance(tag, str) for tag in value):
            raise serializers.ValidationError("Tags must be a list of strings.")
        return [tag.strip() for tag in value if tag.strip()]


class PolygonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polygon
        fields = ["id", "image", "label", "color", "points", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_points(self, value):
        if not isinstance(value, list) or len(value) < 3:
            raise serializers.ValidationError("A polygon needs at least three points.")
        for point in value:
            if not isinstance(point, dict) or "x" not in point or "y" not in point:
                raise serializers.ValidationError("Each point must contain x and y values.")
            if not isinstance(point["x"], (int, float)) or not isinstance(point["y"], (int, float)):
                raise serializers.ValidationError("Point coordinates must be numeric.")
        return value


class AnnotatedImageSerializer(serializers.ModelSerializer):
    polygons = PolygonSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AnnotatedImage
        fields = ["id", "title", "image", "image_url", "polygons", "created_at"]
        read_only_fields = ["id", "image_url", "polygons", "created_at"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return ""
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url
