'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/config';

interface PostCardProps {
  post: Post;
}

type VoteType = 'upvote' | 'downvote' | null;

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [userVote, setUserVote] = useState<VoteType>(null);

  useEffect(() => {
    const loadUserVote = async () => {
      if (!user) return;

      if (config.isDemoMode) {
        // Demo mode: use localStorage
        const votes = JSON.parse(localStorage.getItem('userVotes') || '{}');
        if (votes[post.id]) {
          setUserVote(votes[post.id]);
        }
      } else {
        // Real mode: use Supabase
        try {
          const { data: vote } = await supabase
            .from('votes')
            .select('vote_type')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (vote) {
            setUserVote(vote.vote_type === 1 ? 'upvote' : 'downvote');
          }
        } catch (error) {
          console.error('Error loading vote:', error);
        }
      }
    };

    loadUserVote();
  }, [post.id, user]);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('Please log in to vote');
      return;
    }

    try {
      let newUpvotes = upvotes;
      let newVote: VoteType = voteType;

      // Calculate new upvote count
      if (userVote === voteType) {
        // Remove vote
        newVote = null;
        if (voteType === 'upvote') {
          newUpvotes--;
        } else {
          newUpvotes++;
        }
      } else if (userVote === 'upvote' && voteType === 'downvote') {
        newUpvotes -= 2;
      } else if (userVote === 'downvote' && voteType === 'upvote') {
        newUpvotes += 2;
      } else {
        if (voteType === 'upvote') {
          newUpvotes++;
        } else {
          newUpvotes--;
        }
      }

      // Update state optimistically
      setUpvotes(newUpvotes);
      setUserVote(newVote);

      if (config.isDemoMode) {
        // Demo mode: use localStorage
        const votes = JSON.parse(localStorage.getItem('userVotes') || '{}');
        if (newVote) {
          votes[post.id] = newVote;
        } else {
          delete votes[post.id];
        }
        localStorage.setItem('userVotes', JSON.stringify(votes));
      } else {
        // Real mode: use Supabase
        if (newVote) {
          await supabase
            .from('votes')
            .upsert({
              post_id: post.id,
              user_id: user.id,
              vote_type: newVote === 'upvote' ? 1 : -1
            });
        } else {
          await supabase
            .from('votes')
            .delete()
            .eq('post_id', post.id)
            .eq('user_id', user.id);
        }

        // Update post upvote count
        await supabase
          .from('posts')
          .update({ upvotes: newUpvotes })
          .eq('id', post.id);
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Revert optimistic update on error
      setUpvotes(post.upvotes);
      setUserVote(null);
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = now.getTime() - posted.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const isReferralRequest = post.type === 'referral-request';

  return (
    <div className={`bg-white rounded-lg shadow-sm ${isReferralRequest ? 'border-l-4 border-green-500' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.author.name}</div>
              <div className="text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                  {post.author.company}
                </span>
                <span className="mx-1">•</span>
                <span>{post.author.jobTitle}</span>
                <span className="mx-1">•</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </button>
        </div>
        <Link href={`/post/${post.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">{post.title}</h3>
          <p className="text-gray-700 mb-3 text-sm">{post.content}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </Link>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote('upvote')}
            className={`flex items-center space-x-1 ${
              userVote === 'upvote'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <svg className="w-5 h-5" fill={userVote === 'upvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm font-medium">{upvotes}</span>
          </button>
          <button
            onClick={() => handleVote('downvote')}
            className={`flex items-center space-x-1 ${
              userVote === 'downvote'
                ? 'text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <svg className="w-5 h-5" fill={userVote === 'downvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Link href={`/post/${post.id}`} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">{post.commentCount}</span>
          </Link>
        </div>
        {isReferralRequest && (
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">
            Send DM
          </button>
        )}
      </div>
    </div>
  );
}
