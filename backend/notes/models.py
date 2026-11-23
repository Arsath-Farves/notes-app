from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    category = models.ForeignKey(Category,null=True,blank=True,on_delete=models.SET_NULL)
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name='notes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)

    class Meta:
        ordering =['-created_at']

    def __str__(self):
        return self.title


