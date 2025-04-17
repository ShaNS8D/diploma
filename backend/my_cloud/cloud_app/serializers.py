from rest_framework import serializers
from .models import File
from users.serializers import UserSerializer  
import os
import logging


logger = logging.getLogger(__name__)


class FileListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    download_url = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'original_name', 'size', 'upload_date', 
                 'last_download', 'comment', 'owner', 'share_link',
                 'download_url', 'file_type']
        read_only_fields = ['id', 'size', 'upload_date', 'last_download', 
                          'owner', 'share_link', 'download_url', 'file_type']

    def get_download_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/api/v1/cloud/{obj.id}/download/') if request else None

    def get_file_type(self, obj):
        return os.path.splitext(obj.original_name)[1][1:].lower() if obj.original_name else None


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['file', 'comment']
        extra_kwargs = {
            'file': {'required': True},
            'comment': {'required': False, 'allow_blank': True}
        }


class FileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['original_name', 'comment']
        extra_kwargs = {
            'original_name': {'required': False},
            'comment': {'required': False}
        }

    def validate_original_name(self, value):
        if '.' not in value:
            raise serializers.ValidationError("Имя файла должно содержать расширение")
        return value


class FileShareSerializer(serializers.ModelSerializer):
    share_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['share_link', 'share_url']
        read_only_fields = ['share_link', 'share_url']

    def get_share_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/api/v1/cloud/share/{obj.share_link}/') if request else None


class FileDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'original_name', 'file']
        read_only_fields = ['id', 'original_name', 'file']