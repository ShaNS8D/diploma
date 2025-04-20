from django.urls import path
from .views import (
    UserRegistrationView,
    UserListView,
    UserDeleteView,
    LoginView,
    LogoutView,
    UserUpdateView
    # GetCSRFToken
)

app_name = 'users'

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('logout/', LogoutView.as_view(), name='user-logout'),
    path('<int:pk>/update/', UserUpdateView.as_view(), name='user-update'),
    
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
    # path('get-csrf-token/', GetCSRFToken.as_view(), name='get-csrf-token'),
]