export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  bio?: string;
  date_joined: string;
}

export interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    profile_picture?: string;
  };
  content: string;
  image?: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export interface Comment {
  id: number;
  author: {
    id: number;
    username: string;
    profile_picture?: string;
  };
  content: string;
  created_at: string;
  post: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}
