from django.conf import settings
from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_demo_user(apps, schema_editor):
    User = apps.get_model("auth", "User")
    username = "demo@example.com"
    email = "demo@example.com"
    password = "demo12345"

    user = User.objects.filter(username=username).first() or User.objects.filter(email__iexact=email).first()
    if user is None:
        User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )
        return

    user.email = email
    user.password = make_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save(update_fields=["email", "password", "is_staff", "is_superuser", "is_active"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(create_demo_user, noop_reverse),
    ]
