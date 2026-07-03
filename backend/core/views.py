from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import AnnotatedImage, Polygon, Task
from .serializers import AnnotatedImageSerializer, LoginSerializer, PolygonSerializer, TaskSerializer


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]
    login(request, user)
    return Response({"id": user.id, "email": user.email or user.username, "name": user.get_full_name() or user.username})


@csrf_exempt
@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        due_date = self.request.query_params.get("date")
        if due_date:
            queryset = queryset.filter(due_date=due_date)
        return queryset


class AnnotatedImageViewSet(viewsets.ModelViewSet):
    serializer_class = AnnotatedImageSerializer
    queryset = AnnotatedImage.objects.prefetch_related("polygons")

    @action(detail=True, methods=["post"])
    def polygons(self, request, pk=None):
        image = self.get_object()
        serializer = PolygonSerializer(data={**request.data, "image": image.id})
        serializer.is_valid(raise_exception=True)
        serializer.save(image=image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PolygonViewSet(viewsets.ModelViewSet):
    serializer_class = PolygonSerializer
    queryset = Polygon.objects.all()
