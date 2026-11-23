from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, RegisterView, me, mail
from . import views

router = DefaultRouter()
router.register('notes',NoteViewSet,basename='note')
urlpatterns = [
    path('register/',RegisterView.as_view()),
    path('me/',me),
    path('mail/',mail),
]
urlpatterns += router.urls