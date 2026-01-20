'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { getMessages, getConversationMessages, sendMessage, markMessagesAsRead, Message } from '@/services/mockData';

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// Mock users for conversations
const mockUsers: User[] = [
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@google.com',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    verified: true,
    linkedinConnected: true,
    karmaPoints: 450,
    referralsGiven: 12,
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.c@microsoft.com',
    company: 'Microsoft',
    jobTitle: 'Product Manager',
    verified: true,
    linkedinConnected: false,
    karmaPoints: 320,
    referralsGiven: 8,
    createdAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@meta.com',
    company: 'Meta',
    jobTitle: 'Engineering Manager',
    verified: true,
    linkedinConnected: true,
    karmaPoints: 580,
    referralsGiven: 15,
    createdAt: '2023-12-15T00:00:00.000Z'
  }
];

function MessagesContent() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      try {
        // Load all messages for current user
        const allMessages = await getMessages(user.id);

        // Group messages by conversation
        const conversationMap = new Map<string, Conversation>();

        mockUsers.forEach(otherUser => {
          const userMessages = allMessages.filter(
            msg => (msg.senderId === user.id && msg.receiverId === otherUser.id) ||
                   (msg.senderId === otherUser.id && msg.receiverId === user.id)
          );

          if (userMessages.length > 0) {
            const lastMessage = userMessages[userMessages.length - 1];
            const unreadCount = userMessages.filter(
              msg => msg.receiverId === user.id && !msg.read
            ).length;

            conversationMap.set(otherUser.id, {
              user: otherUser,
              lastMessage,
              unreadCount
            });
          }
        });

        // Add mock conversations if none exist
        if (conversationMap.size === 0) {
          mockUsers.forEach(otherUser => {
            conversationMap.set(otherUser.id, {
              user: otherUser,
              lastMessage: {
                id: Math.random().toString(36).substr(2, 9),
                senderId: otherUser.id,
                receiverId: user.id,
                content: `Hey! I saw your post about referrals. Would love to connect!`,
                createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                read: Math.random() > 0.5
              },
              unreadCount: Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0
            });
          });
        }

        const convArray = Array.from(conversationMap.values()).sort((a, b) =>
          new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
        );

        setConversations(convArray);

        // Auto-select first conversation
        if (convArray.length > 0) {
          setSelectedConversation(convArray[0]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };

    loadConversations();
  }, [user]);

  useEffect(() => {
    const loadConversationMessages = async () => {
      if (!selectedConversation || !user) return;

      try {
        // Load messages for selected conversation
        const conversationMessages = await getConversationMessages(user.id, selectedConversation.user.id);

        // Add mock messages if none exist
        if (conversationMessages.length === 0) {
          const mockMessages: Message[] = [
            {
              id: '1',
              senderId: selectedConversation.user.id,
              receiverId: user.id,
              content: `Hey! I saw your post about referrals. Would love to connect!`,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              read: true
            },
            {
              id: '2',
              senderId: user.id,
              receiverId: selectedConversation.user.id,
              content: `Hi! Thanks for reaching out. What role are you interested in?`,
              createdAt: new Date(Date.now() - 82800000).toISOString(),
              read: true
            },
            {
              id: '3',
              senderId: selectedConversation.user.id,
              receiverId: user.id,
              content: `I'm looking for Software Engineer positions. I have 5 years of experience in React and Node.js.`,
              createdAt: new Date(Date.now() - 79200000).toISOString(),
              read: true
            }
          ];
          setMessages(mockMessages);
        } else {
          setMessages(conversationMessages);
        }

        // Mark messages as read
        await markMessagesAsRead(user.id, selectedConversation.user.id);

        // Update conversation unread count
        setConversations(prevConvs =>
          prevConvs.map(conv =>
            conv.user.id === selectedConversation.user.id
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (error) {
        console.error('Error loading conversation messages:', error);
      }
    };

    loadConversationMessages();
  }, [selectedConversation, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      // Send message
      const message = await sendMessage(user.id, selectedConversation.user.id, newMessage);

      // Add to messages
      setMessages([...messages, message]);
      setNewMessage('');

      // Update conversation last message
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.user.id === selectedConversation.user.id
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now.getTime() - messageDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-140px)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500 mt-1">{conversations.length} conversations</p>
            </div>

            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b hover:bg-gray-50 text-left ${
                    selectedConversation?.user.id === conv.user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                          <span className="text-xs text-gray-500 ml-2">{formatTime(conv.lastMessage.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{conv.user.company} • {conv.user.jobTitle}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage.senderId === user.id ? 'You: ' : ''}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="ml-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {conversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start chatting by sending a DM from posts!</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversation.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.user.name}</h3>
                      <p className="text-sm text-gray-500">{selectedConversation.user.company} • {selectedConversation.user.jobTitle}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.senderId === user.id ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-lg p-3 ${
                          message.senderId === user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-3">{formatTime(message.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    DMs remaining today: 7/10 • Earn karma to increase your limit
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
