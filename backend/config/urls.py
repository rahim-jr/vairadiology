from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from core.views import AnnotatedImageViewSet, PolygonViewSet, TaskViewSet, login_view, logout_view

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
router.register("images", AnnotatedImageViewSet, basename="image")
router.register("polygons", PolygonViewSet, basename="polygon")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", login_view, name="login"),
    path("api/auth/logout/", logout_view, name="logout"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
