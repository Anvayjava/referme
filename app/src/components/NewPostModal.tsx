'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types';
import { supabase } from '@/lib/supabase';
import { config } from '@/config';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: Post) => void;
}

export default function NewPostModal({ isOpen, onClose, onPostCreated }: NewPostModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'referral-offer' | 'referral-request',
    tags: '',
    company: ''
  });

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        authorId: user.id,
        author: user,
        title: formData.title,
        content: formData.content,
        type: formData.type,
        company: formData.company || user.company,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        upvotes: 0,
        commentCount: 0,
        createdAt: new Date().toISOString()
      };

      if (config.isDemoMode) {
        // Demo mode: save to localStorage
        const posts = JSON.parse(localStorage.getItem('userPosts') || '[]');
        posts.unshift(newPost);
        localStorage.setItem('userPosts', JSON.stringify(posts));
      } else {
        // Real mode: save to Supabase
        const { data: post, error } = await supabase
          .from('posts')
          .insert({
            author_id: user.id,
            title: formData.title,
            content: formData.content,
            type: formData.type,
            company: formData.company || user.company,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
            upvotes: 0,
            comment_count: 0
          })
          .select(`
            *,
            author:profiles(*)
          `)
          .single();

        if (error) throw error;

        if (post) {
          newPost.id = post.id;
          newPost.createdAt = post.created_at;
        }
      }

      // Callback
      if (onPostCreated) {
        onPostCreated(newPost);
      }

      // Reset form and close
      setFormData({
        title: '',
        content: '',
        type: 'general',
        tags: '',
        company: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General Discussion</option>
                <option value="referral-offer">Offering Referral</option>
                <option value="referral-request">Seeking Referral</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's your post about?"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your thoughts, questions, or opportunities..."
                required
              />
            </div>

            {/* Company (optional override) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Default: ${user.company}`}
              />
              <p className="mt-1 text-xs text-gray-500">Leave blank to use your company ({user.company})</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="career, interview, compensation (comma separated)"
              />
              <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
            </div>

            {/* Referral-specific info */}
            {formData.type !== 'general' && (
              <div className={`p-4 rounded-lg ${
                formData.type === 'referral-offer' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <h3 className={`font-semibold mb-2 text-sm ${
                  formData.type === 'referral-offer' ? 'text-blue-900' : 'text-green-900'
                }`}>
                  {formData.type === 'referral-offer' ? '💼 Offering Referral' : '🎯 Seeking Referral'}
                </h3>
                <p className={`text-xs ${
                  formData.type === 'referral-offer' ? 'text-blue-800' : 'text-green-800'
                }`}>
                  {formData.type === 'referral-offer'
                    ? 'Include job details, requirements, and how candidates can reach you.'
                    : 'Share your background, what roles you\'re interested in, and why you\'d be a great fit.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim() || !formData.content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
