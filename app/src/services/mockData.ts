import { User, Post, Company, Comment } from '@/types';
import { supabase } from '@/lib/supabase';
import { config } from '@/config';
import {
  getDemoPosts,
  getDemoPostById,
  getDemoCommentsByPostId,
  getDemoCompanies,
  getDemoCurrentUser,
  getDemoCompanyById,
  getDemoPostsByCompany,
  getDemoMessages,
  getDemoConversationMessages,
  demoSendMessage,
  demoMarkMessagesAsRead,
  Message
} from './demoData';

// Helper function to transform database profile to User type
function transformProfile(profile: any): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    company: profile.company,
    jobTitle: profile.job_title,
    verified: profile.verified,
    linkedinConnected: profile.linkedin_connected,
    karmaPoints: profile.karma_points,
    referralsGiven: profile.referrals_given,
    createdAt: profile.created_at
  };
}

// Real Supabase API functions
const getSupabasePosts = async (): Promise<Post[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (posts || []).map((post: any) => ({
      id: post.id,
      authorId: post.author_id,
      author: transformProfile(post.author),
      title: post.title,
      content: post.content,
      type: post.type,
      company: post.company,
      tags: post.tags || [],
      upvotes: post.upvotes || 0,
      commentCount: post.comment_count || 0,
      createdAt: post.created_at
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const getSupabasePostById = async (id: string): Promise<Post | null> => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) return null;

    return {
      id: post.id,
      authorId: post.author_id,
      author: transformProfile(post.author),
      title: post.title,
      content: post.content,
      type: post.type,
      company: post.company,
      tags: post.tags || [],
      upvotes: post.upvotes || 0,
      commentCount: post.comment_count || 0,
      createdAt: post.created_at
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

const getSupabaseCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (comments || []).map((comment: any) => ({
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      author: transformProfile(comment.author),
      content: comment.content,
      upvotes: comment.upvotes || 0,
      createdAt: comment.created_at,
      parentId: comment.parent_id
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

const getSupabaseCompanies = async (): Promise<Company[]> => {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return (companies || []).map((company: any) => ({
      id: company.id,
      name: company.name,
      logo: company.logo || company.name.charAt(0),
      memberCount: company.member_count || 0,
      postCount: company.post_count || 0
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

const getSupabaseCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    if (!profile) return null;

    return transformProfile(profile);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

const getSupabaseCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!company) return null;

    return {
      id: company.id,
      name: company.name,
      logo: company.logo || company.name.charAt(0),
      memberCount: company.member_count || 0,
      postCount: company.post_count || 0
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

const getSupabasePostsByCompany = async (companyName: string): Promise<Post[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('company', companyName)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (posts || []).map((post: any) => ({
      id: post.id,
      authorId: post.author_id,
      author: transformProfile(post.author),
      title: post.title,
      content: post.content,
      type: post.type,
      company: post.company,
      tags: post.tags || [],
      upvotes: post.upvotes || 0,
      commentCount: post.comment_count || 0,
      createdAt: post.created_at
    }));
  } catch (error) {
    console.error('Error fetching posts by company:', error);
    return [];
  }
};

// Messages Supabase functions
const getSupabaseMessages = async (userId: string): Promise<Message[]> => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (messages || []).map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      content: msg.content,
      createdAt: msg.created_at,
      read: msg.read
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

const getSupabaseConversationMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (messages || []).map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      content: msg.content,
      createdAt: msg.created_at,
      read: msg.read
    }));
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return [];
  }
};

const supabaseSendMessage = async (senderId: string, receiverId: string, content: string): Promise<Message> => {
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: message.id,
    senderId: message.sender_id,
    receiverId: message.receiver_id,
    content: message.content,
    createdAt: message.created_at,
    read: message.read
  };
};

const supabaseMarkMessagesAsRead = async (userId: string, otherUserId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', otherUserId);

  if (error) throw error;
};

// Exported wrapper functions that switch between demo and real data
export const getPosts = async (): Promise<Post[]> => {
  return config.isDemoMode ? getDemoPosts() : getSupabasePosts();
};

export const getPostById = async (id: string): Promise<Post | null> => {
  return config.isDemoMode ? getDemoPostById(id) : getSupabasePostById(id);
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  return config.isDemoMode ? getDemoCommentsByPostId(postId) : getSupabaseCommentsByPostId(postId);
};

export const getCompanies = async (): Promise<Company[]> => {
  return config.isDemoMode ? getDemoCompanies() : getSupabaseCompanies();
};

export const getCurrentUser = async (): Promise<User | null> => {
  return config.isDemoMode ? getDemoCurrentUser() : getSupabaseCurrentUser();
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  return config.isDemoMode ? getDemoCompanyById(id) : getSupabaseCompanyById(id);
};

export const getPostsByCompany = async (companyName: string): Promise<Post[]> => {
  return config.isDemoMode ? getDemoPostsByCompany(companyName) : getSupabasePostsByCompany(companyName);
};

// Messages wrapper functions
export const getMessages = async (userId: string): Promise<Message[]> => {
  return config.isDemoMode ? getDemoMessages(userId) : getSupabaseMessages(userId);
};

export const getConversationMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
  return config.isDemoMode ? getDemoConversationMessages(userId, otherUserId) : getSupabaseConversationMessages(userId, otherUserId);
};

export const sendMessage = async (senderId: string, receiverId: string, content: string): Promise<Message> => {
  return config.isDemoMode ? demoSendMessage(senderId, receiverId, content) : supabaseSendMessage(senderId, receiverId, content);
};

export const markMessagesAsRead = async (userId: string, otherUserId: string): Promise<void> => {
  return config.isDemoMode ? demoMarkMessagesAsRead(userId, otherUserId) : supabaseMarkMessagesAsRead(userId, otherUserId);
};

// Re-export Message type for convenience
export type { Message };
