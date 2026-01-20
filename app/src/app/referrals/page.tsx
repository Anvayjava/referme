'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ReferralCard from '@/components/ReferralCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getPosts } from '@/services/mockData';
import { Post } from '@/types';

function ReferralsContent() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'giving' | 'seeking'>('giving');
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        const referralPosts = posts.filter(
          post => post.type === 'referral-offer' || post.type === 'referral-request'
        );
        setAllPosts(referralPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on active filters
  useEffect(() => {
    let filtered = allPosts;

    // Filter by tab (giving/seeking)
    if (activeTab === 'giving') {
      filtered = filtered.filter(post => post.type === 'referral-offer');
    } else {
      filtered = filtered.filter(post => post.type === 'referral-request');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.company?.toLowerCase().includes(query) ||
        post.author.jobTitle.toLowerCase().includes(query)
      );
    }

    // Filter by company
    if (companyFilter !== 'all') {
      filtered = filtered.filter(post =>
        post.company?.toLowerCase() === companyFilter.toLowerCase()
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(roleFilter.toLowerCase()) ||
        post.content.toLowerCase().includes(roleFilter.toLowerCase()) ||
        post.author.jobTitle.toLowerCase().includes(roleFilter.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [allPosts, activeTab, searchQuery, companyFilter, roleFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading referrals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Board</h1>
          <p className="text-gray-600">Browse open positions from verified employees or find candidates seeking referrals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toggle & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          {/* Toggle */}
          <div className="bg-white rounded-lg p-1 flex shadow-sm">
            <button
              onClick={() => setActiveTab('giving')}
              className={`px-6 py-2 rounded-md font-semibold ${
                activeTab === 'giving'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Giving Referrals
            </button>
            <button
              onClick={() => setActiveTab('seeking')}
              className={`px-6 py-2 rounded-md font-semibold ${
                activeTab === 'seeking'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Seeking Referrals
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex space-x-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or role..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              <option value="microsoft">Microsoft</option>
              <option value="google">Google</option>
              <option value="amazon">Amazon</option>
              <option value="meta">Meta</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="software engineer">Software Engineer</option>
              <option value="product manager">Product Manager</option>
              <option value="data scientist">Data Scientist</option>
              <option value="designer">Designer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Referral Listings */}
          <div className="lg:col-span-2 space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <ReferralCard key={post.id} post={post} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No referrals found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Stats & Tips */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-3">Referral Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Referral Offers</span>
                  <span className="font-semibold text-blue-600">
                    {allPosts.filter(p => p.type === 'referral-offer').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Job Seekers</span>
                  <span className="font-semibold text-green-600">
                    {allPosts.filter(p => p.type === 'referral-request').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtered Results</span>
                  <span className="font-semibold text-gray-900">{filteredPosts.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Pro Tips</h4>
              <ul className="text-xs text-blue-800 space-y-2">
                <li>• Be specific about requirements</li>
                <li>• Respond to DMs within 48 hours</li>
                <li>• Update posts when positions are filled</li>
                <li>• Build reputation by helping others</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Top Companies Hiring</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Microsoft</span>
                  <span className="text-gray-500">
                    {allPosts.filter(p => p.company?.toLowerCase() === 'microsoft').length} posts
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Google</span>
                  <span className="text-gray-500">
                    {allPosts.filter(p => p.company?.toLowerCase() === 'google').length} posts
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Amazon</span>
                  <span className="text-gray-500">
                    {allPosts.filter(p => p.company?.toLowerCase() === 'amazon').length} posts
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Meta</span>
                  <span className="text-gray-500">
                    {allPosts.filter(p => p.company?.toLowerCase() === 'meta').length} posts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReferralsPage() {
  return (
    <ProtectedRoute>
      <ReferralsContent />
    </ProtectedRoute>
  );
}
