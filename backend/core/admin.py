from django.contrib import admin

from .models import AnnotatedImage, Polygon, Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "priority", "due_date", "updated_at")
    list_filter = ("status", "priority", "due_date")
    search_fields = ("title",)


class PolygonInline(admin.TabularInline):
    model = Polygon
    extra = 0


@admin.register(AnnotatedImage)
class AnnotatedImageAdmin(admin.ModelAdmin):
    list_display = ("title", "image", "created_at")
    inlines = [PolygonInline]
