'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CommentItem from '@/components/CommentItem';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { getPostById, getCommentsByPostId } from '@/services/mockData';
import { Post, Comment } from '@/types';
import { supabase } from '@/lib/supabase';
import { config } from '@/config';

type VoteType = 'upvote' | 'downvote' | null;

function PostDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string;
        const [postData, commentsData] = await Promise.all([
          getPostById(id),
          getCommentsByPostId(id)
        ]);
        setPost(postData);
        setComments(commentsData);

        if (postData && user) {
          setUpvotes(postData.upvotes);

          if (config.isDemoMode) {
            // Demo mode: use localStorage
            const votes = JSON.parse(localStorage.getItem('userVotes') || '{}');
            if (votes[id]) {
              setUserVote(votes[id]);
            }
          } else {
            // Production mode: use Supabase
            const { data: vote } = await supabase
              .from('votes')
              .select('vote_type')
              .eq('post_id', id)
              .eq('user_id', user.id)
              .maybeSingle();

            if (vote) {
              setUserVote(vote.vote_type === 1 ? 'upvote' : 'downvote');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, user]);

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

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!post || !user) {
      alert('Please log in to vote');
      return;
    }

    try {
      let newUpvotes = upvotes;
      let newVote: VoteType = voteType;

      // Calculate new upvote count
      if (userVote === voteType) {
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
        // Production mode: use Supabase
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

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post || !user) return;

    try {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        postId: post.id,
        authorId: user.id,
        author: user,
        content: newComment,
        upvotes: 0,
        createdAt: new Date().toISOString(),
        parentId: undefined
      };

      if (config.isDemoMode) {
        // Demo mode: just add to local state (not persisted)
        setComments([comment, ...comments]);
        setNewComment('');

        // Update local post comment count
        setPost({
          ...post,
          commentCount: post.commentCount + 1
        });
      } else {
        // Production mode: save to Supabase
        const { data: newCommentData, error } = await supabase
          .from('comments')
          .insert({
            post_id: post.id,
            author_id: user.id,
            content: newComment,
            upvotes: 0
          })
          .select(`
            *,
            author:profiles(*)
          `)
          .single();

        if (error) throw error;

        if (newCommentData) {
          comment.id = newCommentData.id;
          comment.createdAt = newCommentData.created_at;

          setComments([comment, ...comments]);
          setNewComment('');

          // Update post comment count in database
          const newCommentCount = post.commentCount + 1;
          await supabase
            .from('posts')
            .update({ comment_count: newCommentCount })
            .eq('id', post.id);

          // Update local post state
          setPost({
            ...post,
            commentCount: newCommentCount
          });
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
            <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="text-blue-600 hover:underline">← Back to Feed</Link>
          </div>
        </div>
      </div>
    );
  }

  const topLevelComments = comments.filter(c => !c.parentId);
  const replies = comments.filter(c => c.parentId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </Link>

        {/* Main Post */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
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

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>

            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleVote('upvote')}
                className={`flex items-center space-x-2 ${
                  userVote === 'upvote'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5" fill={userVote === 'upvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="text-sm font-medium">Upvote ({upvotes})</span>
              </button>
              <button
                onClick={() => handleVote('downvote')}
                className={`flex items-center space-x-2 ${
                  userVote === 'downvote'
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <svg className="w-5 h-5" fill={userVote === 'downvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-sm font-medium">Downvote</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Send DM
            </button>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{post.commentCount} Comments</h2>

            {/* Add Comment */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Add a comment..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="divide-y">
            {topLevelComments.map((comment) => {
              const commentReplies = replies.filter(r => r.parentId === comment.id);
              return (
                <div key={comment.id} className="p-6">
                  <CommentItem comment={comment} />
                  {commentReplies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostDetail() {
  return (
    <ProtectedRoute>
      <PostDetailPage />
    </ProtectedRoute>
  );
}
