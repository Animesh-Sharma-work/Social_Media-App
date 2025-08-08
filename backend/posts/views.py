from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer
# Make sure IsOwnerOrReadOnly is imported
from .permissions import IsOwnerOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # REMOVE the permission_classes line from here. We will handle it dynamically.
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly] # <-- DELETE THIS

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            # For actions that modify the post, only the owner can perform them.
            self.permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        elif self.action in ['like', 'create']:
            # For liking or creating a post, the user must be authenticated.
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            # For any other action (list, retrieve), anyone can view.
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        try:
            like = Like.objects.get(user=user, post=post)
            like.delete()
            return Response({'liked': False}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            Like.objects.create(user=user, post=post)
            return Response({'liked': True}, status=status.HTTP_201_CREATED)

# The CommentViewSet is likely fine, but let's verify its permissions.
# Any authenticated user should be able to create a comment on any post.
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            # Only authenticated users can create comments.
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only the comment's author can edit or delete it.
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            # Anyone (guests included) can view comments.
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return self.queryset.filter(post_id=self.kwargs.get('post_pk'))

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs.get('post_pk'))
        serializer.save(author=self.request.user, post=post)