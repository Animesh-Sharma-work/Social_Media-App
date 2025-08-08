import api from "./axiosConfig";
import { User, Post } from "../types";

interface ProfileApiResponse extends User {
  posts: Post[];
}

// export const profileApi = {
//   getProfile: async (
//     username: string
//   ): Promise<{ user: User; posts: Post[] }> => {
//     const response = await api.get(`/profiles/${username}/`);
//     return response.data;
//   },
// };

export const profileApi = {
  getProfile: async (username: string): Promise<ProfileApiResponse> => {
    const response = await api.get(`/profiles/${username}/`);
    // Return the clean, flat object directly from Django
    return response.data;
  },
};
