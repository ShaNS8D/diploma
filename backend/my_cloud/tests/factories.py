import factory
import uuid
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from datetime import datetime
from cloud_app.models import File
from users.models import User  

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


class FileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = File    
    
    upload_date = factory.LazyFunction(datetime.now)
    last_download = None
    comment = ""
    file = factory.LazyAttribute(
        lambda obj: SimpleUploadedFile(
            "test_file.txt",
            b"a" * getattr(obj, "size", 12),
            content_type="text/plain"
        )
    )
    share_link = factory.LazyFunction(uuid.uuid4)
    owner = factory.SubFactory(UserFactory)

    @factory.post_generation
    def ensure_size_and_original_name(self, create, extracted, **kwargs):
        """
        Эмулируем логику метода save модели File.
        Устанавливаем размер файла и оригинальное имя.
        """
        if not self.pk and self.file:
            self.size = self.file.size
            self.original_name = self.file.name.split("/")[-1]
            if create:
                self.save()
