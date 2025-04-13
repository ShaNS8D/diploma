import pytest
from rest_framework.exceptions import ValidationError
from users.serializers import UserRegistrationSerializer, UserSerializer, UserLoginSerializer
from .factories import UserFactory


@pytest.mark.django_db
class TestUserLoginSerializer:
    def test_invalid_credentials(self):
        UserFactory.create(username='valid_user', password='correct_pass')
        data = {
            'username': 'valid_user',
            'password': 'wrong_pass'
        }        
        serializer = UserLoginSerializer(data=data)
        assert not serializer.is_valid()

        with pytest.raises(ValidationError):
            serializer.validate(data)  

    def test_password_input_type(self):
        serializer = UserLoginSerializer()
        assert serializer.fields['password'].style['input_type'] == 'password'

    def test_missing_fields(self):
        serializer = UserLoginSerializer(data={'username': 'testuser'})
        assert not serializer.is_valid()
        assert 'password' in serializer.errors


@pytest.mark.django_db
class TestUserRegistrationSerializer:
    def test_duplicate_username(self):
        UserFactory.create(username='existing_user')
        data = {
            'username': 'existing_user',
            'email': 'new@example.com',
            'password': 'SecurePass123!'
        }
        serializer = UserRegistrationSerializer(data=data)
        assert not serializer.is_valid()
        assert 'username' in serializer.errors


    def test_validate_email(self):
        UserFactory.create(email='exist@example.com')
        data = {
            'username': 'testuser',
            'email': 'exist@example.com',  # Дублирующий email
            'password': 'SecurePass123!',
            'full_name': 'Test User'
        }
        serializer = UserRegistrationSerializer(data=data)
        assert serializer.is_valid() is False, "Сериализатор должен отвергнуть дубликат email"
        assert 'email' in serializer.errors, "Ошибка должна быть связана с полем email"
        assert "уже существует" in str(serializer.errors['email']), "Должна быть ошибка уникальности"

    def test_validate_password_with_validation_error(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'
        }        
        with pytest.raises(ValidationError):
            serializer = UserRegistrationSerializer(data=data)
            serializer.is_valid(raise_exception=True)

        
class TestUserSerializer:
    def test_serialization(self):
        user = UserFactory.build(
            username='testuser',
            email='test@example.com',
            full_name='Test User',
            storage_path='/test/path'
        )
        
        serializer = UserSerializer(user)
        data = serializer.data
        
        assert data['username'] == 'testuser'
        assert data['email'] == 'test@example.com'
        assert 'password' not in data