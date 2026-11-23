from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Note
from .serializers import NoteSerializer, RegisterSerializer
from .permissions import isOwner

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, isOwner]
    filterset_firlds = ['category','is_pinned']
    search_fields = ['title','content']
    ordering_fields = ['created_at','title']


    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

@api_view(["GET"])
def me(request):
    return Response({
        'username':request.user.username,
        'note_count':request.user.notes.count(),
    })

@api_view(["GET"])
def mail(request):
    return Response({
      'username':request.user.username,
      'e-mail':request.user.mail,  
      'is_pinned':request.user.notes.filter(is_pinned = True).count(),
    })