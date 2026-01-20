'use client';

import { User } from '@/types';

// Demo auth functions using localStorage
export const demoSignup = async (email: string, password: string, name: string, jobTitle: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  if (personalDomains.includes(domain)) {
    throw new Error('Please use your work email address');
  }

  // Extract company from email domain
  const company = email.split('@')[1].split('.')[0];
  const companyName = company.charAt(0).toUpperCase() + company.slice(1);

  // Create mock user
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    company: companyName,
    jobTitle,
    verified: false,
    linkedinConnected: false,
    karmaPoints: 0,
    referralsGiven: 0,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem('pendingUser', JSON.stringify(newUser));
};

export const demoLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const domain = email.split('@')[1]?.toLowerCase();
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  if (personalDomains.includes(domain)) {
    throw new Error('Please use your work email address');
  }

  // Extract company from email domain
  const company = email.split('@')[1].split('.')[0];

  // Create mock user session
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
    email: email,
    company: company.charAt(0).toUpperCase() + company.slice(1),
    jobTitle: 'Software Engineer',
    verified: true,
    linkedinConnected: false,
    karmaPoints: 125,
    referralsGiven: 3,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const demoLogout = async () => {
  localStorage.removeItem('currentUser');
};

export const demoGetSession = async (): Promise<User | null> => {
  const currentUserStr = localStorage.getItem('currentUser');
  if (currentUserStr) {
    try {
      return JSON.parse(currentUserStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('currentUser');
    }
  }
  return null;
};
