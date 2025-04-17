from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, FileShareDownloadViewSet


app_name = 'cloud_app'

router = DefaultRouter()
router.register(r'', FileViewSet, basename='file')

urlpatterns = [
    path('', include(router.urls)),
    path('share/<uuid:share_link>/', 
         FileShareDownloadViewSet.as_view({'get': 'retrieve'}), 
         name='file-share-download')
]