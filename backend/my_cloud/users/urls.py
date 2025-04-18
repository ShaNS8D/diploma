from django.urls import path
from django.http import HttpResponse
from .views import (
    UserRegistrationView,
    UserListView,
    UserDeleteView,
    LoginView,
    LogoutView,
)

app_name = 'users'

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('logout/', LogoutView.as_view(), name='user-logout'),
    
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('session-check/', lambda request: HttpResponse(status=200) 
         if request.user.is_authenticated 
         else HttpResponse(status=401))
]