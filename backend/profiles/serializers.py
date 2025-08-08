from rest_framework import serializers
from users.models import User
from posts.serializers import PostSerializer

class ProfileSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'bio', 'profile_picture', 'date_joined', 'posts')