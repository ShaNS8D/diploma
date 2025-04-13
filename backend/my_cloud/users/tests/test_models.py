import pytest
# from django.core.exceptions import ValidationError
from users.models import User, CustomUserManager
from users.tests.factories import UserFactory
from factory import Faker
from factory.django import DjangoModelFactory


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = Faker("user_name")
    email = Faker("email")
    password = "testpass123"

@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self):
        """Проверка создания пользователя."""
        user = UserFactory(username="testuser", email="test@example.com")
        assert user.pk is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.check_password("testpass123")
        assert user.storage_path == f"user_{user.username}"

    def test_email_unique(self):
        """Проверка уникальности email."""
        UserFactory(email="duplicate@example.com")
        with pytest.raises(Exception):
            UserFactory(email="duplicate@example.com")
    
    def test_email_normalization(self):
        user = UserFactory(email="TEST@EXAMPLE.COM")
        assert user.email == "test@example.com"

    def test_save_hashes_password(self):
        """Проверка, что пароль хешируется при сохранении."""
        user = UserFactory(password="plaintext123")
        assert user.password.startswith("pbkdf2_sha256$")

    def test_storage_path_auto_generation(self):
        """Проверка автозаполнения storage_path."""
        user = UserFactory(username="pathuser", storage_path="")
        assert user.storage_path == "user_pathuser"

    def test_is_admin_default_false(self):
        """Проверка, что is_admin по умолчанию False."""
        user = UserFactory()
        assert user.is_admin is False


@pytest.mark.django_db
class TestCustomUserManager:
    def test_create_user_without_email_fails(self):
        manager = CustomUserManager()
        with pytest.raises(ValueError, match="Email должен быть указан"):
            manager._create_user(username="noemail", email="", password="test123")

    def test_create_user_normalizes_email(self):        
        manager = CustomUserManager()
        manager.model = User
        user = manager._create_user(
            username="normalize", 
            email="TEST@EXAMPLE.COM", 
            password="test123"
        )
        assert user.email == "test@example.com"
