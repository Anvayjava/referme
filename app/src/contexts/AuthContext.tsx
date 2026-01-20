'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { config } from '@/config';
import { demoSignup, demoLogin, demoLogout, demoGetSession } from './DemoAuthContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, jobTitle: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const initializeAuth = async () => {
      try {
        if (config.isDemoMode) {
          // Demo mode: check localStorage
          const user = await demoGetSession();
          setUser(user);
        } else {
          // Real mode: check Supabase
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch user profile from database
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              const userData: User = {
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
              setUser(userData);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes (only in real mode)
    if (!config.isDemoMode) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          // Fetch updated profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userData: User = {
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
            setUser(userData);
          }
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signup = async (email: string, password: string, name: string, jobTitle: string) => {
    if (config.isDemoMode) {
      // Demo mode
      await demoSignup(email, password, name, jobTitle);
    } else {
      // Real mode
      const domain = email.split('@')[1]?.toLowerCase();
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

      if (personalDomains.includes(domain)) {
        throw new Error('Please use your work email address');
      }

      // Extract company from email domain
      const company = email.split('@')[1].split('.')[0];
      const companyName = company.charAt(0).toUpperCase() + company.slice(1);

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company: companyName,
            job_title: jobTitle
          }
        }
      });

      if (error) {
        throw error;
      }
    }
  };

  const login = async (email: string, password: string) => {
    if (config.isDemoMode) {
      // Demo mode
      const user = await demoLogin(email, password);
      setUser(user);
    } else {
      // Real mode
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }
      // User state will be updated by the onAuthStateChange listener
    }
  };

  const logout = async () => {
    if (config.isDemoMode) {
      // Demo mode
      await demoLogout();
      setUser(null);
    } else {
      // Real mode
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
