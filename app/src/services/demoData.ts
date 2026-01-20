import { User, Post, Company, Comment } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    email: 'sarah@microsoft.com',
    company: 'Microsoft',
    jobTitle: 'Senior Software Engineer',
    karmaPoints: 450,
    referralsGiven: 3,
    verified: true,
    linkedinConnected: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Michael Kim',
    email: 'michael@google.com',
    company: 'Google',
    jobTitle: 'Staff Engineer',
    karmaPoints: 680,
    referralsGiven: 5,
    verified: true,
    linkedinConnected: true,
    createdAt: '2023-11-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Priya Gupta',
    email: 'priya@amazon.com',
    company: 'Amazon',
    jobTitle: 'Senior PM',
    karmaPoints: 320,
    referralsGiven: 2,
    verified: true,
    linkedinConnected: false,
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '4',
    name: 'John Doe',
    email: 'john@microsoft.com',
    company: 'Microsoft',
    jobTitle: 'Senior Software Engineer',
    karmaPoints: 450,
    referralsGiven: 3,
    verified: true,
    linkedinConnected: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    author: mockUsers[0],
    title: 'Looking to refer qualified candidates for Azure team!',
    content: "We're hiring Senior Software Engineers for the Azure Compute team. If you have 5+ years of experience with distributed systems and cloud infrastructure, I'd be happy to refer you. Drop a comment or DM me your resume!",
    type: 'referral-offer',
    company: 'Microsoft',
    tags: ['referral', 'azure', 'swe'],
    upvotes: 124,
    commentCount: 32,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    authorId: '2',
    author: mockUsers[1],
    title: "What's the typical timeline for E5 to E6 promotion at Google?",
    content: "I've been at E5 for 2 years now, consistently getting EE ratings. My manager says I'm on track but I'm curious what the typical timeline looks like for others. Any insights?",
    type: 'general',
    company: 'Google',
    tags: ['career', 'promotion'],
    upvotes: 89,
    commentCount: 56,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    authorId: '3',
    author: mockUsers[2],
    title: 'Looking for PM referrals at Meta/Google - 6 YOE in B2B SaaS',
    content: "I'm a Senior PM with 6 years of experience in B2B SaaS products. Led multiple 0-1 features that drove 40% revenue growth. Currently looking for PM roles (L5/L6 equivalent) at Meta or Google. Would really appreciate a referral!",
    type: 'referral-request',
    tags: ['seeking-referral', 'pm', 'meta', 'google'],
    upvotes: 45,
    commentCount: 18,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Microsoft',
    logo: 'MS',
    memberCount: 1234,
    postCount: 456,
  },
  {
    id: '2',
    name: 'Google',
    logo: 'G',
    memberCount: 2543,
    postCount: 892,
  },
  {
    id: '3',
    name: 'Amazon',
    logo: 'A',
    memberCount: 980,
    postCount: 234,
  },
  {
    id: '4',
    name: 'Meta',
    logo: 'M',
    memberCount: 1876,
    postCount: 567,
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    authorId: '4',
    author: mockUsers[3],
    content: "This is a great opportunity! I've been on the Azure Compute team for 2 years and can vouch for the amazing team culture. The technical challenges are really interesting too.",
    upvotes: 12,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    postId: '1',
    authorId: '3',
    author: mockUsers[2],
    content: "I'm interested! I have 6 years of experience with distributed systems at AWS. Can I DM you my resume?",
    upvotes: 8,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3',
    postId: '1',
    authorId: '1',
    author: mockUsers[0],
    content: 'Absolutely! AWS experience would be great. Looking forward to reviewing your resume.',
    upvotes: 5,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    parentId: 'c2',
  },
];

// Demo mode API functions
export const getDemoPosts = async (): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Merge with any user-created posts from localStorage
  const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
  return [...userPosts, ...mockPosts];
};

export const getDemoPostById = async (id: string): Promise<Post | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Check user posts first
  const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
  const userPost = userPosts.find((post: Post) => post.id === id);
  if (userPost) return userPost;

  return mockPosts.find(post => post.id === id) || null;
};

export const getDemoCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockComments.filter(comment => comment.postId === postId);
};

export const getDemoCompanies = async (): Promise<Company[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCompanies;
};

export const getDemoCurrentUser = async (): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const currentUserStr = localStorage.getItem('currentUser');
  if (currentUserStr) {
    return JSON.parse(currentUserStr);
  }
  return mockUsers[3]; // Default to John Doe
};

export const getDemoCompanyById = async (id: string): Promise<Company | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCompanies.find(company => company.id === id) || null;
};

export const getDemoPostsByCompany = async (companyName: string): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Merge with user posts
  const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
  const allPosts = [...userPosts, ...mockPosts];

  return allPosts.filter(post => post.company === companyName);
};

// Messages demo functions
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export const getDemoMessages = async (userId: string): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  return messages.filter((msg: Message) =>
    msg.senderId === userId || msg.receiverId === userId
  );
};

export const getDemoConversationMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  return messages.filter((msg: Message) =>
    (msg.senderId === userId && msg.receiverId === otherUserId) ||
    (msg.senderId === otherUserId && msg.receiverId === userId)
  );
};

export const demoSendMessage = async (senderId: string, receiverId: string, content: string): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const message: Message = {
    id: Math.random().toString(36).substr(2, 9),
    senderId,
    receiverId,
    content,
    createdAt: new Date().toISOString(),
    read: false
  };

  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));

  return message;
};

export const demoMarkMessagesAsRead = async (userId: string, otherUserId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  const updatedMessages = messages.map((msg: Message) => {
    if (msg.receiverId === userId && msg.senderId === otherUserId) {
      return { ...msg, read: true };
    }
    return msg;
  });

  localStorage.setItem('messages', JSON.stringify(updatedMessages));
};
