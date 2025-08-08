import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Post } from "../types";
import { profileApi } from "../api/profileApi";
import { PostCard } from "../components/posts/PostCard";
import { MainLayout } from "../components/layout/MainLayout";
import { Spinner } from "../components/common/Spinner";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";

// This interface matches the clean, flat data from our API
interface ProfileData extends User {
  posts: Post[];
}

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username]);

  const fetchProfile = async (username: string) => {
    setIsLoading(true);
    try {
      // Get the clean, flat data
      const data = await profileApi.getProfile(username);

      // **THE FIX:** Set the state directly with the data. No more flattening.
      setProfile(data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const handlePostDeleted = (postId: number) => {
    if (profile) {
      setProfile({
        ...profile,
        posts: profile.posts.filter((p) => p.id !== postId),
      });
    }
  };

  const handlePostLiked = (postId: number, liked: boolean) => {
    if (profile) {
      setProfile({
        ...profile,
        posts: profile.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_liked: liked,
                likes_count: liked ? p.likes_count + 1 : p.likes_count - 1,
              }
            : p
        ),
      });
    }
  };

  // --- RENDER LOGIC ---

  // Guard Clause 1: Show a spinner while the API call is in progress.
  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Spinner size="lg" className="py-12" />
        </div>
      </MainLayout>
    );
  }

  // Guard Clause 2: If loading is done but profile is still null (e.g., API error), show a message.
  // This is the check that prevents the crash.
  if (!profile) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold">Profile not found</h2>
        </div>
      </MainLayout>
    );
  }

  // If we get past the guards, we are GUARANTEED that 'profile' is a valid object.
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {/* This line (103) is now safe because of the '!profile' check above */}
              {profile.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-xl text-gray-600">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-700 mt-2">{profile.bio}</p>
              )}
              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
                <Calendar size={16} />
                <span>Joined {formatJoinDate(profile.date_joined)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
          {profile.posts.length === 0 ? (
            <p>This user hasn't posted anything yet.</p>
          ) : (
            <div className="space-y-6">
              {profile.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handlePostDeleted}
                  onLike={handlePostLiked}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { User, Post } from '../types';
// import { profileApi } from '../api/profileApi';
// import { PostCard } from '../components/posts/PostCard';
// import { MainLayout } from '../components/layout/MainLayout';
// import { Spinner } from '../components/common/Spinner';
// import { Calendar, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// export const ProfilePage: React.FC = () => {
//   const { username } = useParams<{ username: string }>();
//   const [profileData, setProfileData] = useState<{ user: User; posts: Post[] } | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (username) {
//       fetchProfile(username);
//     }
//   }, [username]);

//   const fetchProfile = async (username: string) => {
//     try {
//       const data = await profileApi.getProfile(username);
//       setProfileData(data);
//     } catch (error) {
//       toast.error('Failed to load profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePostDeleted = (postId: number) => {
//     if (profileData) {
//       setProfileData({
//         ...profileData,
//         posts: profileData.posts.filter(post => post.id !== postId)
//       });
//     }
//   };

//   const handlePostLiked = (postId: number, liked: boolean) => {
//     if (profileData) {
//       setProfileData({
//         ...profileData,
//         posts: profileData.posts.map(post =>
//           post.id === postId
//             ? {
//                 ...post,
//                 is_liked: liked,
//                 likes_count: liked ? post.likes_count + 1 : post.likes_count - 1
//               }
//             : post
//         )
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <MainLayout>
//         <div className="max-w-4xl mx-auto">
//           <div className="animate-pulse">
//             <div className="bg-white rounded-2xl p-8 mb-6">
//               <div className="flex items-start space-x-6">
//                 <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-8 bg-gray-300 rounded w-1/3"></div>
//                   <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-2/3"></div>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
//                   <div className="h-48 bg-gray-300 rounded-xl"></div>
//                   <div className="h-4 bg-gray-300 rounded"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   if (!profileData) {
//     return (
//       <MainLayout>
//         <div className="max-w-4xl mx-auto text-center py-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
//           <p className="text-gray-600">The user you're looking for doesn't exist.</p>
//         </div>
//       </MainLayout>
//     );
//   }

//   const { user, posts } = profileData;

//   return (
//     <MainLayout>
//       <div className="max-w-4xl mx-auto">
//         {/* Profile Header */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
//             {/* Profile Picture */}
//             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//               {user.username[0].toUpperCase()}
//             </div>

//             {/* Profile Info */}
//             <div className="flex-1">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">
//                     {user.first_name} {user.last_name}
//                   </h1>
//                   <p className="text-xl text-gray-600">@{user.username}</p>
//                 </div>
//                 <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4 sm:mt-0">
//                   <div className="flex items-center space-x-1">
//                     <span className="font-semibold text-gray-900">{posts.length}</span>
//                     <span>posts</span>
//                   </div>
//                 </div>
//               </div>

//               {user.bio && (
//                 <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
//               )}

//               <div className="flex items-center space-x-6 text-sm text-gray-500">
//                 <div className="flex items-center space-x-1">
//                   <Calendar size={16} />
//                   <span>Joined March 2024</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Posts Section */}
//         <div>
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
//             <p className="text-gray-600">All posts by @{user.username}</p>
//           </div>

//           {posts.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
//               <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <span className="text-3xl">📝</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
//               <p className="text-gray-600">This user hasn't shared anything yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {posts.map((post) => (
//                 <PostCard
//                   key={post.id}
//                   post={post}
//                   onDelete={handlePostDeleted}
//                   onLike={handlePostLiked}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };
