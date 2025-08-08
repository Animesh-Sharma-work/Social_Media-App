from rest_framework import generics, permissions
from users.models import User
from .serializers import ProfileSerializer

class ProfileDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny] # Anyone can view a profile
    lookup_field = 'username' # Look up users by username instead of ID