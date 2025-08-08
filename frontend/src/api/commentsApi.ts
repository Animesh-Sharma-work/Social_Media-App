import api from "./axiosConfig";
import { Comment } from "../types";

interface PaginatedCommentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[]; // The array of comments is inside the 'results' key
}

export const commentsApi = {
  getComments: async (postId: number): Promise<PaginatedCommentsResponse> => {
    const response = await api.get(`/posts/${postId}/comments/`);
    return response.data;
  },

  createComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments/`, { content });
    return response.data;
  },
};
