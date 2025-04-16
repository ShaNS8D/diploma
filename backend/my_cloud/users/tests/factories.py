import factory
from users.models import User
from cloud_app.models import Folder, File

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    full_name = factory.Faker("name")
    is_admin = False
    is_active = True
    storage_path = ""

class FolderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Folder

    name = factory.Sequence(lambda n: f"Folder {n}")
    owner = factory.SubFactory(UserFactory)
    parent = None

class FileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = File

    original_name = factory.Sequence(lambda n: f"file{n}.txt")
    size = 100
    owner = factory.SubFactory(UserFactory)
    folder = None
    file_path = factory.django.FileField(filename='test_file.txt', data=b'Test content')