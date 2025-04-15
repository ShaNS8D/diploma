# tests/conftest.py
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from factory import Faker, django

User = get_user_model()

class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    username = Faker('user_name')
    email = Faker('email')
    password = 'TestPass123!'  # Пароль, соответствующий валидации
    is_active = True

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Переопределяем для хеширования пароля."""
        password = kwargs.pop('password', None)
        user = super()._create(model_class, *args, **kwargs)
        if password:
            user.set_password(password)
            user.save()
        return user

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return UserFactory()