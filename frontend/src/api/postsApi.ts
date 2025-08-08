import api from './axiosConfig';
import { Post } from '../types';

export const postsApi = {
  getAllPosts: async (page: number = 1): Promise<{ results: Post[]; next: string | null; previous: string | null }> => {
    const response = await api.get(`/posts/?page=${page}`);
    return response.data;
  },

  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  createPost: async (formData: FormData): Promise<Post> => {
    const response = await api.post('/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id: number, formData: FormData): Promise<Post> => {
    const response = await api.patch(`/posts/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}/`);
  },

  likePost: async (id: number): Promise<{ liked: boolean }> => {
    const response = await api.post(`/posts/${id}/like/`);
    return response.data;
  },
};