import { User, Post, Comment, AuthTokens, LoginData, RegisterData } from '../types';
import { mockUser, mockPosts, mockComments, mockCredentials, generateMockTokens } from './mockData';

// Mock API delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for mock data
let posts = [...mockPosts];
let comments = [...mockComments];
let nextPostId = Math.max(...posts.map(p => p.id)) + 1;
let nextCommentId = Math.max(...comments.map(c => c.id)) + 1;

export const mockAuthApi = {
  register: async (data: RegisterData): Promise<User> => {
    await delay(1000);
    
    // Simulate validation errors
    if (data.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!data.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    // Return mock user data
    return {
      ...mockUser,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };
  },

  login: async (data: LoginData): Promise<AuthTokens> => {
    await delay(800);
    
    // Check mock credentials
    if (data.email !== mockCredentials.email || data.password !== mockCredentials.password) {
      throw new Error('Invalid email or password');
    }
    
    return generateMockTokens();
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    await delay(500);
    return generateMockTokens();
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockUser;
  },
};

export const mockPostsApi = {
  getAllPosts: async (page: number = 1): Promise<{ results: Post[]; next: string | null; previous: string | null }> => {
    await delay(800);
    
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    return {
      results: paginatedPosts,
      next: endIndex < posts.length ? `page=${page + 1}` : null,
      previous: page > 1 ? `page=${page - 1}` : null,
    };
  },

  getPost: async (id: number): Promise<Post> => {
    await delay(500);
    const post = posts.find(p => p.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },

  createPost: async (formData: FormData): Promise<Post> => {
    await delay(1200);
    
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;
    
    const newPost: Post = {
      id: nextPostId++,
      author: {
        id: mockUser.id,
        username: mockUser.username,
        profile_picture: mockUser.profile_picture,
      },
      content,
      image: image ? 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800' : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
    };
    
    posts.unshift(newPost);
    return newPost;
  },

  updatePost: async (id: number, formData: FormData): Promise<Post> => {
    await delay(1000);
    
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;
    
    posts[postIndex] = {
      ...posts[postIndex],
      content,
      image: image ? 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800' : posts[postIndex].image,
      updated_at: new Date().toISOString(),
    };
    
    return posts[postIndex];
  },

  deletePost: async (id: number): Promise<void> => {
    await delay(800);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    posts.splice(postIndex, 1);
  },

  likePost: async (id: number): Promise<{ liked: boolean }> => {
    await delay(400);
    
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const post = posts[postIndex];
    const newLikedState = !post.is_liked;
    
    posts[postIndex] = {
      ...post,
      is_liked: newLikedState,
      likes_count: newLikedState ? post.likes_count + 1 : post.likes_count - 1,
    };
    
    return { liked: newLikedState };
  },
};

export const mockCommentsApi = {
  getComments: async (postId: number): Promise<Comment[]> => {
    await delay(600);
    return comments.filter(c => c.post === postId);
  },

  createComment: async (postId: number, content: string): Promise<Comment> => {
    await delay(800);
    
    const newComment: Comment = {
      id: nextCommentId++,
      author: {
        id: mockUser.id,
        username: mockUser.username,
        profile_picture: mockUser.profile_picture,
      },
      content,
      created_at: new Date().toISOString(),
      post: postId,
    };
    
    comments.push(newComment);
    
    // Update post comment count
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].comments_count++;
    }
    
    return newComment;
  },
};

export const mockProfileApi = {
  getProfile: async (username: string): Promise<{ user: User; posts: Post[] }> => {
    await delay(700);
    
    if (username === mockUser.username) {
      const userPosts = posts.filter(p => p.author.username === username);
      return {
        user: mockUser,
        posts: userPosts,
      };
    }
    
    // Return mock data for other users
    const mockOtherUser: User = {
      id: 2,
      username: username,
      email: `${username}@example.com`,
      first_name: username.charAt(0).toUpperCase() + username.slice(1),
      last_name: 'User',
      bio: `This is ${username}'s profile. Welcome to my page!`,
    };
    
    const userPosts = posts.filter(p => p.author.username === username);
    
    return {
      user: mockOtherUser,
      posts: userPosts,
    };
  },
};