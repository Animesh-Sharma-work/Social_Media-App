import React, { useState, useEffect, useCallback } from "react";
import { Post } from "../types";
import { postsApi } from "../api/postsApi";
import { PostCard } from "../components/posts/PostCard";

import { Spinner } from "../components/common/Spinner";
import toast from "react-hot-toast";

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = useCallback(
    async (page: number = 1, replace: boolean = false) => {
      try {
        if (page === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        const response = await postsApi.getAllPosts(page);

        if (replace) {
          setPosts(response.results);
        } else {
          setPosts((prev) => [...prev, ...response.results]);
        }

        setHasNextPage(!!response.next);
        setCurrentPage(page);
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handlePostLiked = (postId: number, liked: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked: liked,
              likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
            }
          : post
      )
    );
  };

  const loadMorePosts = () => {
    if (hasNextPage && !isLoadingMore) {
      fetchPosts(currentPage + 1);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isLoadingMore
      ) {
        return;
      }
      loadMorePosts();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isLoadingMore, currentPage]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="h-20 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDeleted}
              onLike={handlePostLiked}
            />
          ))}

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}

          {!hasNextPage && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You've reached the end!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
