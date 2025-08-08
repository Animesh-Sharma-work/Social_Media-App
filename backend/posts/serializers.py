from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer

class CommentAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSerializer.Meta.model
        fields = ('id', 'username', 'profile_picture')

class CommentSerializer(serializers.ModelSerializer):
    author = CommentAuthorSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 
            'author', 
            'post', 
            'content', 
            'created_at'
        ]
        # This tells the serializer:
        # 1. Don't require 'post' on input (POST/PUT requests).
        # 2. The view will handle setting this field.
        read_only_fields = ['post']

class PostAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSerializer.Meta.model
        fields = ('id', 'username', 'profile_picture')

class PostSerializer(serializers.ModelSerializer):
    author = PostAuthorSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'content', 'image', 'created_at', 'updated_at', 
                  'likes_count', 'comments_count', 'is_liked')

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False