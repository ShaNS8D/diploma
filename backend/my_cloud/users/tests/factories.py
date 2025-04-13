import factory
from django.contrib.auth.hashers import make_password
from users.models import User

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.LazyFunction(lambda: make_password("test123"))
    full_name = factory.Faker("name")
    is_admin = False
    storage_path = factory.Sequence(lambda n: f"user_{n}")
