from rest_framework import serializers
from .models import Note, Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id','title','content','category','is_pinned','created_at','updated_at']
        read_only_fields = ['created_at','updated_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username','email','password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)