'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import CompanyList from '@/components/CompanyList';
import UserStats from '@/components/UserStats';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getPosts, getCompanies } from '@/services/mockData';
import { Post, Company } from '@/types';

function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, companiesData] = await Promise.all([
          getPosts(),
          getCompanies()
        ]);

        // Load user-created posts from localStorage
        const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');

        // Combine and sort by date
        const allPosts = [...userPosts, ...postsData].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(allPosts);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Company Bowls */}
          <div className="lg:col-span-1">
            <CompanyList companies={companies} />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {user && <UserStats user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
