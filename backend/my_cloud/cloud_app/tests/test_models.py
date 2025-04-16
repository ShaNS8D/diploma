import os
import pytest
import uuid
from unittest.mock import patch
from django.conf import settings
from cloud_app.models import Folder, File, get_upload_path
from users.tests.factories import FolderFactory, UserFactory, FileFactory


@pytest.mark.django_db
class TestFolderModel:
    def test_folder_creation(self):
        folder = FolderFactory()
        assert Folder.objects.count() == 1
        assert folder.name.startswith("Folder ")

    def test_folder_path_root(self):
        folder = FolderFactory(parent=None)
        assert folder.get_folder_path() == [folder.name]

    def test_folder_path_nested(self):
        parent = FolderFactory(name="Parent")
        child = FolderFactory(name="Child", parent=parent)
        assert child.get_folder_path() == ["Parent", "Child"]

    def test_folder_unique_constraint(self):
        user = UserFactory()
        parent = FolderFactory(owner=user)
        FolderFactory(name="Folder", owner=user, parent=parent)
        with pytest.raises(Exception):
            FolderFactory(name="Folder", owner=user, parent=parent)

    def test_folder_mptt_hierarchy(self):
        root = FolderFactory(name="Root")
        child = FolderFactory(name="Child", parent=root)
        assert root.get_children().count() == 1
        assert child.get_ancestors().first() == root

@pytest.mark.django_db
class TestFileModel:
    def test_file_creation(self):
        file = FileFactory()
        assert File.objects.count() == 1
        assert file.original_name.endswith(".txt")

    def test_file_sets_size_automatically(self):
        file = FileFactory(file_path__data=b'12345')  # 5 bytes
        assert file.size == 5

    def test_file_full_path_root(self):
        file = FileFactory(folder=None, original_name="doc.pdf")
        assert file.get_full_path() == "doc.pdf"

    def test_file_full_path_nested(self):
        folder = FolderFactory(name="Docs")
        file = FileFactory(original_name="doc.pdf", folder=folder)
        assert file.get_full_path() == "Docs/doc.pdf"

    def test_file_unique_constraint(self):
        user = UserFactory()
        folder = FolderFactory(owner=user)
        FileFactory(original_name="file.txt", owner=user, folder=folder)
        with pytest.raises(Exception):  # IntegrityError
            FileFactory(original_name="file.txt", owner=user, folder=folder)

    def test_public_link_is_unique(self):
        file1 = FileFactory()
        file2 = FileFactory()
        assert file1.public_link != file2.public_link

@pytest.mark.django_db
class TestUploadPath:
    def test_file_upload_path(self):
        user = UserFactory(id=1)
        folder = FolderFactory(name="Docs", owner=user)
        file = FileFactory(owner=user, folder=folder, original_name="test.txt")
        path = get_upload_path(file, "test.txt")
        
        assert str(user.id) in path
        assert "Docs" in path
        assert ".txt" in path
        assert "test.txt" not in path

@pytest.mark.django_db
class TestStorageIntegration:
    def test_user_storage_hierarchy(self):
        user = UserFactory()
        root = FolderFactory(name="Root", owner=user)
        subfolder = FolderFactory(name="Sub", owner=user, parent=root)
        file = FileFactory(owner=user, folder=subfolder)
        
        assert user.folders.count() == 2
        assert root.get_descendants().count() == 1
        assert subfolder.files.first() == file

