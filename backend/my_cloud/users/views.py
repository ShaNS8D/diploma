from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, logout, login
from .models import User
from .serializers import UserRegistrationSerializer, UserSerializer, UserLoginSerializer
import logging

logger = logging.getLogger(__name__)

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        logger.debug(f"Попытка регистрации с использованием данных: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Ошибка проверки регистрации: {serializer.errors}")
            return Response(
                {"detail": "Не удалось выполнить проверку", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            self.perform_create(serializer)
            user = serializer.instance
            logger.info(f"Пользователь {user.username} успешно зарегистрирован")
            return Response(
                {"detail": "Пользователь успешно зарегистрировался"},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Ошибка регистрации: {str(e)}")
            return Response(
                {"detail": "Не удалось выполнить регистрацию"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        logger.debug(f"Список пользователей, запрошенный {request.user.username}")
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(f"Пользователь Admin {request.user.username} получил доступ к списку пользователей")
            return response
        except Exception as e:
            logger.error(f"Ошибка при получении списка пользователей: {str(e)}")
            return Response(
                {"detail": "Ошибка при получении списка пользователей"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance == request.user:
                logger.warning(f"Администратор {request.user.username} попытался удалить себя сам")
                return Response(
                    {"detail": "Не удается удалить себя"},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            self.perform_destroy(instance)
            logger.info(f"Пользователь {instance.username} удален администратором {request.user.username}")
            return Response(
                {"detail": "Пользователь успешно удален"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Ошибка при удалении пользователя: {str(e)}")
            return Response(
                {"detail": "Ошибка удалении пользователя"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger.debug(f"Попытка входа в систему с использованием данных: {request.data}")
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Ошибка проверки логина: {serializer.errors}")
            return Response(
                {"detail": "Не удалось выполнить проверку", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        username = request.data.get('username')
        password = request.data.get('password')
            
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            logger.info(f"Пользователь {username} вошел в систему. Сеанс: {request.session.session_key}")
            return Response({
                'detail': 'Вход в систему прошел успешно',
                'user': UserSerializer(user).data,
                'sessionid': request.session.session_key
            })
        
        logger.warning(f"Неудачная попытка входа для имени пользователя: {username}")
        return Response(
            {'detail': 'Неверные учетные данные'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            logger.warning("Попытка выхода из системы пользователя, не прошедшего проверку подлинности")
            return Response(
                {"detail": "Не прошел проверку подлинности"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        username = request.user.username
        try:
            logout(request)
            logger.info(f"Пользователь {username} успешно вышел из системы")
            return Response(
                {"detail": "Успешный выход из системы"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Ошибка при выходе пользователя {username}: {str(e)}")
            return Response(
                {"detail": "Ошибка при выходе из системы"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )