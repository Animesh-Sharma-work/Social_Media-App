from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit or delete it.
    Assumes the model instance has an `author` attribute.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request, so we'll always allow
        # GET, HEAD, or OPTIONS requests. These are considered "safe" methods
        # as they don't change the data.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions (like PUT, PATCH, DELETE) are only allowed 
        # to the author of the post.
        # `obj` is the Post instance being accessed.
        # `request.user` is the user making the request.
        return obj.author == request.user