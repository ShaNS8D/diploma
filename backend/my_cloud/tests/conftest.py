import pytest

@pytest.fixture
def user_factory():
    from .factories import UserFactory
    return UserFactory

@pytest.fixture
def file_factory():
    from .factories import FileFactory
    return FileFactory