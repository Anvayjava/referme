'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCompanyById, getPostsByCompany } from '@/services/mockData';
import { Company, Post } from '@/types';

function CompanyBowlPage() {
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string;
        const companyData = await getCompanyById(id);

        if (!companyData) {
          setLoading(false);
          return;
        }

        const postsData = await getPostsByCompany(companyData.name);
        setCompany(companyData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bowl...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Company bowl not found</h2>
            <p className="text-gray-600 mb-6">The company bowl you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Company Bowl Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">{company.logo}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-blue-100 mt-1">
                  {company.memberCount.toLocaleString()} verified employees • {company.postCount} posts this week
                </p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">
              Following
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters & Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-3">Filter Posts</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
                  All Posts
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Referrals
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Career
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Salary
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Culture
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Interviews
                </button>
              </div>

              <hr className="my-4" />

              <h3 className="font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600">
                Official bowl for {company.name} employees to discuss company culture, career growth, and help each other with referrals.
              </p>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pinned Post */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-yellow-500">
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2zM2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM9 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5z"></path>
                  </svg>
                  <span className="text-sm font-semibold text-yellow-700">PINNED POST</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Welcome to the {company.name} Bowl!</h3>
                <p className="text-gray-700 text-sm">
                  This is a space for {company.name} employees to connect, share insights, and help each other grow. Please be respectful and follow our community guidelines.
                </p>
              </div>
            </div>

            {/* Regular Posts */}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {posts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">No posts yet in this bowl. Be the first to post!</p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Top Contributors */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-3">Top Contributors</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      TR
                    </div>
                    <div>
                      <div className="text-sm font-medium">Tom R.</div>
                      <div className="text-xs text-gray-500">Principal Eng</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">540 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      LK
                    </div>
                    <div>
                      <div className="text-sm font-medium">Lisa K.</div>
                      <div className="text-xs text-gray-500">Sr PM</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">412 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      AS
                    </div>
                    <div>
                      <div className="text-sm font-medium">Alex S.</div>
                      <div className="text-xs text-gray-500">Staff SWE</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">389 pts</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Post in this bowl</h4>
              <p className="text-xs text-blue-800 mb-3">Share insights, ask questions, or offer referrals!</p>
              <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Create Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyBowl() {
  return (
    <ProtectedRoute>
      <CompanyBowlPage />
    </ProtectedRoute>
  );
}
