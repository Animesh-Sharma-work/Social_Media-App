import axios from "axios";
import toast from "react-hot-toast";
import {
  mockAuthApi,
  mockPostsApi,
  mockCommentsApi,
  mockProfileApi,
} from "./mockApi";

const BASE_URL = "http://127.0.0.1:8000/api";
const USE_MOCK_API = false; // Set to false when connecting to real backend

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Skip interceptor logic for mock API
    if (USE_MOCK_API) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          // Update the authorization header and retry the request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is invalid, log out the user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        toast.error("Session expired. Please log in again.");
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

// Mock API wrapper
const createMockApiWrapper = () => {
  return {
    get: async (url: string) => {
      const token = localStorage.getItem("access_token");
      if (!token && !url.includes("/token")) {
        throw new Error("Authentication required");
      }

      // Route to appropriate mock API
      if (url.includes("/posts/") && url.includes("/comments/")) {
        const postId = parseInt(url.split("/posts/")[1].split("/")[0]);
        const data = await mockCommentsApi.getComments(postId);
        return { data };
      } else if (url.includes("/posts/") && !url.includes("/like/")) {
        const postId = parseInt(url.split("/posts/")[1].split("/")[0]);
        const data = await mockPostsApi.getPost(postId);
        return { data };
      } else if (url.includes("/posts")) {
        const urlParams = new URLSearchParams(url.split("?")[1] || "");
        const page = parseInt(urlParams.get("page") || "1");
        const data = await mockPostsApi.getAllPosts(page);
        return { data };
      } else if (url.includes("/profiles/")) {
        const username = url.split("/profiles/")[1].replace("/", "");
        const data = await mockProfileApi.getProfile(username);
        return { data };
      } else if (url.includes("/users/me/")) {
        const data = await mockAuthApi.getCurrentUser();
        return { data };
      }

      throw new Error("Mock API endpoint not found");
    },

    post: async (url: string, data?: any) => {
      if (url.includes("/users/register/")) {
        const userData = await mockAuthApi.register(data);
        return { data: userData };
      } else if (url.includes("/token/refresh/")) {
        const tokens = await mockAuthApi.refreshToken(data.refresh);
        return { data: tokens };
      } else if (url.includes("/token/")) {
        const tokens = await mockAuthApi.login(data);
        return { data: tokens };
      } else if (url.includes("/like/")) {
        const postId = parseInt(url.split("/posts/")[1].split("/")[0]);
        const result = await mockPostsApi.likePost(postId);
        return { data: result };
      } else if (url.includes("/comments/")) {
        const postId = parseInt(url.split("/posts/")[1].split("/")[0]);
        const comment = await mockCommentsApi.createComment(
          postId,
          data.content
        );
        return { data: comment };
      } else if (url.includes("/posts/")) {
        const post = await mockPostsApi.createPost(data);
        return { data: post };
      }

      throw new Error("Mock API endpoint not found");
    },

    patch: async (url: string, data: any) => {
      if (url.includes("/posts/")) {
        const postId = parseInt(url.split("/posts/")[1].split("/")[0]);
        const post = await mockPostsApi.updatePost(postId, data);
        return { data: post };
      }

      throw new Error("Mock API endpoint not found");
    },

    delete: async (url: string) => {
      if (url.includes("/posts/")) {
        const postId = parseInt(url.split("/posts/")[1].split("/")[0]);
        await mockPostsApi.deletePost(postId);
        return { data: null };
      }

      throw new Error("Mock API endpoint not found");
    },
  };
};

// Export either mock API or real API based on configuration
export default USE_MOCK_API ? createMockApiWrapper() : api;
