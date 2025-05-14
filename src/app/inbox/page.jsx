"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import AuthRequired from '../../components/AuthRequired';

const SAMPLE_CONVERSATIONS = [
  {
    id: '1',
    user: {
      name: 'Alex Rodriguez',
      avatar: 'https://placehold.co/',
      lastSeen: '2 hours ago'
    },
    lastMessage: {
      text: 'Hey, want to collaborate on a new track?',
      time: '1:45 PM',
      unread: true
    }
  },
  {
    id: '2',
    user: {
      name: 'Sarah Thompson',
      avatar: 'https://placehold.co/',
      lastSeen: '1 day ago'
    },
    lastMessage: {
      text: 'Thanks for sharing that playlist!',
      time: 'Yesterday',
      unread: false
    }
  },
  {
    id: '3',
    user: {
      name: 'Music Collective',
      avatar: 'https://placehold.co/',
      lastSeen: '3 days ago'
    },
    lastMessage: {
      text: 'Invitation to join our weekly jam session',
      time: '3 days ago',
      unread: true
    }
  }
];

export default function InboxPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Simulated message sending logic
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  if (!user) {
    return <AuthRequired message="You must be logged in to view messages." />;
  }


  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 pr-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full px-4 py-2 mb-4 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        />

        <div className="space-y-2">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full flex items-center p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                selectedConversation?.id === conv.id 
                  ? 'bg-gray-200 dark:bg-gray-700' 
                  : ''
              }`}
            >
              <Image 
                src={conv.user.avatar} 
                alt={conv.user.name} 
                width={48} 
                height={48} 
                className="rounded-full mr-4"
              />
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{conv.user.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {conv.lastMessage.time}
                  </span>
                </div>
                <p className={`text-sm ${
                  conv.lastMessage.unread 
                    ? 'font-bold text-blue-600' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {conv.lastMessage.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className="w-2/3 pl-4">
        {selectedConversation ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
              <Image 
                src={selectedConversation.user.avatar} 
                alt={selectedConversation.user.name} 
                width={64} 
                height={64} 
                className="rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedConversation.user.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last seen {selectedConversation.user.lastSeen}
                </p>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto mb-4 space-y-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {/* Placeholder for message history */}
              <div className="text-center text-gray-500 dark:text-gray-400">
                No message history yet
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input 
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
