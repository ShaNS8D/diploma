from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, FileShareDownloadViewSet

router = DefaultRouter()
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path('', include(router.urls)),
    path('files/share/<uuid:share_link>/', 
         FileShareDownloadViewSet.as_view({'get': 'retrieve'}), 
         name='file-share-download')
]