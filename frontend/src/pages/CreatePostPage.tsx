import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostForm } from '../components/posts/PostForm';
import { MainLayout } from '../components/layout/MainLayout';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePostCreated = () => {
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-1">Share what's on your mind with the community</p>
        </div>
        <PostForm onSuccess={handlePostCreated} submitButtonText="Publish Post" />
      </div>
    </MainLayout>
  );
};