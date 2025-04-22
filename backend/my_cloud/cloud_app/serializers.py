from rest_framework import serializers
from .models import File
from users.serializers import UserSerializer  
import os
import logging
from .utils.file_validators import validate_file_extension


logger = logging.getLogger(__name__)


class FileListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    download_url = serializers.SerializerMethodField()
    view_url = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'original_name', 'size', 'upload_date', 
                 'last_download', 'comment', 'owner', 'share_link',
                 'download_url', 'view_url', 'file_type']
        read_only_fields = ['id', 'size', 'upload_date', 'last_download', 
                          'owner', 'share_link', 'download_url', 'view_url', 'file_type']

    def get_download_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/api/v1/cloud/{obj.id}/download/') if request else None

    def get_view_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/api/v1/cloud/{obj.id}/view/') if request else None

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

    def validate_file(self, value):        
        validate_file_extension(value)
        return value


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

        user_files = File.objects.filter(
                owner=self.context['request'].user
            ).exclude(pk=self.instance.pk)
            
        if user_files.filter(original_name=value).exists():
            base, ext = os.path.splitext(value)
            counter = 1
            while user_files.filter(original_name=f"{base}_{counter:03}{ext}").exists():
                counter += 1
            value = f"{base}_{counter:03}{ext}"
        
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
