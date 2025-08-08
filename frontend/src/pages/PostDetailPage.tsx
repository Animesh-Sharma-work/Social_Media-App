import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../types';
import { postsApi } from '../api/postsApi';
import { PostCard } from '../components/posts/PostCard';
import { CommentList } from '../components/posts/CommentList';
import { MainLayout } from '../components/layout/MainLayout';
import { Spinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      const postData = await postsApi.getPost(postId);
      setPost(postData);
    } catch (error) {
      toast.error('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostLiked = (postId: number, liked: boolean) => {
    if (post) {
      setPost({
        ...post,
        is_liked: liked,
        likes_count: liked ? post.likes_count + 1 : post.likes_count - 1
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Spinner size="lg" className="py-12" />
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <p className="text-gray-600">The post you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <PostCard post={post} onLike={handlePostLiked} />
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Comments</h3>
          <CommentList postId={post.id} />
        </div>
      </div>
    </MainLayout>
  );
};