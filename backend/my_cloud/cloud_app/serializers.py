from rest_framework import serializers
from .models import File
from users.serializers import UserSerializer
import logging

logger = logging.getLogger(__name__)

class FileSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    file = serializers.FileField(write_only=True)
    share_link = serializers.UUIDField(read_only=True)
    size = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = File
        fields = [
            'id', 'original_name', 'size', 'upload_date', 
            'last_download', 'comment', 'file', 'share_link', 'owner'
        ]
        read_only_fields = ['id', 'upload_date', 'last_download', 'owner']
    
    def validate_file(self, value):
        if value.size > self.context['request'].user.storage_limit:
            logger.warning(f"User {self.context['request'].user} exceeded storage limit")
            raise serializers.ValidationError("Превышен лимит хранилища пользователя")
        return value

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        logger.info(f"User {validated_data['owner']} uploaded file {validated_data['original_name']}")
        return super().create(validated_data)

class FileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['original_name', 'comment']
    
    def validate_original_name(self, value):
        user = self.context['request'].user
        if File.objects.filter(owner=user, original_name=value).exclude(id=self.instance.id).exists():
            logger.warning(f"User {user} tried to use existing filename {value}")
            raise serializers.ValidationError("Файл с таким именем уже существует")
        return value

class FileDownloadSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField() 

    class Meta:
        model = File
        fields = ['id', 'original_name', 'size', 'upload_date', 'download_url']
        read_only_fields = fields
    
    def get_download_url(self, obj):
        return self.context['request'].build_absolute_uri(
            f'/api/files/{obj.id}/download/'
        )

class FileShareSerializer(serializers.ModelSerializer):
    share_url = serializers.SerializerMethodField()
    
    class Meta:
        model = File
        fields = ['share_link', 'share_url']
        read_only_fields = ['share_link', 'share_url']
    
    def get_share_url(self, obj):
        return self.context['request'].build_absolute_uri(
            f'/api/files/share/{obj.share_link}/'
        )

class ShareLinkDownloadSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    
    class Meta:
        model = File
        fields = ['original_name', 'size', 'upload_date', 'download_url']
        read_only_fields = fields
    
    def get_download_url(self, obj):
        return self.context['request'].build_absolute_uri(
            f'/api/files/share/{obj.share_link}/download/'
        )