export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  avatar?: string;
  karmaPoints: number;
  referralsGiven: number;
  verified: boolean;
  linkedinConnected: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  type: 'general' | 'referral-offer' | 'referral-request';
  company?: string;
  tags: string[];
  upvotes: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  upvotes: number;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  memberCount: number;
  postCount: number;
}

export interface ReferralOffer extends Post {
  type: 'referral-offer';
  jobTitle: string;
  location: string;
  requirements: string;
  team?: string;
}

export interface ReferralRequest extends Post {
  type: 'referral-request';
  targetCompanies: string[];
  targetRole: string;
  yearsOfExperience: string;
  skills: string[];
}
