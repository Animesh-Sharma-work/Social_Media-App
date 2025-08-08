import { User, Post, Comment, AuthTokens } from '../types';

// Mock user data
export const mockUser: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  profile_picture: undefined,
  bio: 'This is a test user account for development purposes. Welcome to our social media platform!',
};

// Mock posts data
export const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      id: 1,
      username: 'testuser',
      profile_picture: undefined,
    },
    content: 'Welcome to our social media platform! This is my first post. Excited to connect with everyone here! 🎉',
    image: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes_count: 15,
    comments_count: 3,
    is_liked: false,
  },
  {
    id: 2,
    author: {
      id: 2,
      username: 'johndoe',
      profile_picture: undefined,
    },
    content: 'Beautiful sunset today! Nature never fails to amaze me. Hope everyone is having a wonderful day! 🌅',
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes_count: 28,
    comments_count: 7,
    is_liked: true,
  },
  {
    id: 3,
    author: {
      id: 3,
      username: 'janedoe',
      profile_picture: undefined,
    },
    content: 'Just finished reading an amazing book! "The Power of Now" by Eckhart Tolle. Highly recommend it to anyone interested in mindfulness and personal growth. What are you reading lately?',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes_count: 12,
    comments_count: 5,
    is_liked: false,
  },
  {
    id: 4,
    author: {
      id: 1,
      username: 'testuser',
      profile_picture: undefined,
    },
    content: 'Working on some exciting new projects! Can\'t wait to share more details soon. Stay tuned! 💻✨',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes_count: 22,
    comments_count: 4,
    is_liked: true,
  },
];

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: 1,
    author: {
      id: 2,
      username: 'johndoe',
      profile_picture: undefined,
    },
    content: 'Welcome to the platform! Great to have you here!',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    post: 1,
  },
  {
    id: 2,
    author: {
      id: 3,
      username: 'janedoe',
      profile_picture: undefined,
    },
    content: 'Looking forward to seeing more of your posts!',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    post: 1,
  },
];

// Mock credentials for testing
export const mockCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

// Generate mock tokens
export const generateMockTokens = (): AuthTokens => ({
  access: 'mock-access-token-' + Date.now(),
  refresh: 'mock-refresh-token-' + Date.now(),
});