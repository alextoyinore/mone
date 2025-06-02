"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import AuthRequired from '@/components/AuthRequired';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import defaultImage from '@/assets/default-image.svg';

const formatTime = (timestamp) => {
  const date = new Date(timestamp?.toDate());
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
  return date.toLocaleDateString();
};

const getConversationId = (user1, user2) => {
  const users = [user1, user2].sort();
  return users.join('_');
};

const getOtherUser = (conversation, currentUser) => {
  return conversation.users.find(userId => userId !== currentUser?.uid);
};


export default function InboxPage() {
  const { user } = useAuth();

  // Create test user
  const createUser = async () => {
    try {
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      const usersRef = collection(db, 'users');
      const userDocRef = doc(usersRef, user.uid);
      
      await setDoc(userDocRef, {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp()
      });
      
      console.log('User profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    createUser();
  }, []);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationQuery, setNewConversationQuery] = useState('');
  const { currentSong } = useAudioPlayer();

  // Load users for new conversation search
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const ConversationItem = ({ conv, user }) => {
    const [otherUserData, setOtherUserData] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        const otherUserId = getOtherUser(conv, user);
        const otherUserDocRef = doc(db, 'users', otherUserId);
        const docSnap = await getDoc(otherUserDocRef);
        if (docSnap.exists()) {
          setOtherUserData(docSnap.data());
        }
      };
      fetchUserData();
    }, []);
  
    const lastMessage = conv.lastMessage || {
      text: 'No messages yet',
      timestamp: null
    };
  
    if (!otherUserData) {
      return <div className='text-gray-500 dark:text-gray-400'>Loading...</div>;
    }
  
    return (
      <button
        key={conv.id}
        onClick={() => setSelectedConversation(conv)}
        className={`w-full flex items-center p-3 gap-2 cursor-pointer rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition ${
          selectedConversation?.id === conv.id 
            ? 'bg-gray-100 dark:bg-gray-900' 
            : ''
        }`}
      >
        {
          otherUserData.photoURL ? (
            <Image 
              src={otherUserData.photoURL}
              alt={otherUserData.displayName}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 flex-shrink-0"
            />
          ) : (
            <div className="rounded-full flex-shrink-0 bg-gray-200 dark:bg-gray-800 w-12 h-12 flex items-center justify-center">
              {otherUserData.displayName[0]}
            </div>
          )
        }
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{otherUserData.displayName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(lastMessage.timestamp)}
            </p>
          </div>
          <p className="text-xs font-semibold text-blue-500 dark:text-blue-400">
            {lastMessage.text}
          </p>
        </div>
      </button>
    );
  };

  useEffect(() => {
    if (!newConversationQuery.trim()) {
      setSearchedUsers([]);
      return;
    }

    setLoadingUsers(true);

    const searchQuery = newConversationQuery.toLowerCase();

    // Search users in Firebase Authentication
    const searchUsers = async () => {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('email', '>=', searchQuery),
        where('email', '<=', searchQuery + '\uf8ff'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(users);
      setSearchedUsers(users);
      setLoadingUsers(false);
    };

    searchUsers();
  }, [newConversationQuery]);


  // Load conversations for the current user
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'conversations'),
      where('users', 'array-contains', user.uid),
      orderBy('lastMessage.timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('conversations', convs);
      setConversations(convs);
    });

    return () => unsubscribe();
  }, [user]);


  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', selectedConversation.id),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).reverse();
        setMessages(msgs);
      },
      (error) => {
        if (error.code === 'failed-precondition') {
          // Show a user-friendly message about the missing index
          console.error('Missing Firestore index. Please create the following index in Firebase Console:');
          console.error('Collection: messages');
          console.error('Fields: conversationId (Ascending), timestamp (Ascending)');
          console.error('You can create this index at: https://console.firebase.google.com/v1/r/project/mone-f4d3d/firestore/indexes');
          
          // Set an empty array of messages to prevent UI errors
          setMessages([]);
        } else {
          console.error('Error loading messages:', error);
          setMessages([]);
        }
      }
    );

    return () => unsubscribe();
  }, [selectedConversation]);


  // Update conversation last message when a new message is sent
  const updateConversationLastMessage = async (conversationId, message) => {
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: {
        text: message.text,
        senderId: user.uid,
        timestamp: message.timestamp
      },
      updatedAt: serverTimestamp()
    });
  };


  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      const message = {
        text: messageInput,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        read: false
      };

      console.log(message);

      // Add message to messages collection
      await addDoc(collection(db, 'messages'), {
        ...message,
        conversationId: selectedConversation.id
      });

      // Update conversation last message
      await updateConversationLastMessage(selectedConversation.id, message);

      // Clear input
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  // Create new conversation
  const createConversation = async (otherUserId) => {
    try {
      const conversationId = getConversationId(user.uid, otherUserId);
      
      // Check if conversation already exists
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        // Create new conversation
        await setDoc(conversationRef, {
          users: [user.uid, otherUserId],
          lastMessage: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Select the conversation
      setSelectedConversation({
        id: conversationId,
        users: [user.uid, otherUserId]
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };


  const filteredConversations = conversations.filter(conv => 
    getOtherUser(conv, user)?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  if (!user) {
    return <AuthRequired message="You must be logged in to view messages." />;
  }


  return (
    <div className={`h-screen bg-white ${ currentSong ? 'max-h-[calc(100vh-7em)]' : 'max-h-screen' } dark:bg-black text-gray-900 dark:text-white flex`}>
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 pr-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
        
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full px-4 py-2 mb-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
        />

        <div className="flex flex-col items-center justify-center mb-4">
          <span
            onClick={() => setShowNewConversation(true)}
            className="text-blue-600 transition cursor-pointer text-sm hover:underline"
          >
            New Conversation
          </span> 
        </div> 

        <div className="space-y-2">
          {showNewConversation ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Start New Conversation</h2>
                <button
                  onClick={() => setShowNewConversation(false)}
                  className="text-gray-500 text-xs cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Close
                </button>
              </div>

              <input 
                type="text"
                value={newConversationQuery}
                onChange={(e) => setNewConversationQuery(e.target.value)}
                placeholder="Search for a user..."
                className="w-full px-4 py-2 mb-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
              />  
              
              {loadingUsers ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-2">
                  {searchedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        createConversation(user.id);
                        setShowNewConversation(false);
                      }}
                      className="w-full flex items-center p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      <div className="rounded-full mr-4 bg-gray-200 dark:bg-gray-800 w-12 h-12 flex items-center justify-center">
                        {user.displayName[0]}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-sm">{user.displayName}</h3>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            conversations.map((conv) => {
              return <ConversationItem key={conv.id} conv={conv} user={user} />
            })
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="w-2/3 pl-4">
        {selectedConversation ? (
          <div className={`${currentSong ? 'h-[calc(100vh-7em)]' : 'h-[calc(100vh-2rem)]' } overflow-y-auto flex flex-col`}>
            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-3">
              {selectedConversation?.user ? (
                <>
                  <Image 
                    src={selectedConversation.user.photoURL || defaultImage} 
                    alt={selectedConversation.user.displayName} 
                    width={64} 
                    height={64} 
                    className="rounded-full mr-4"
                    unoptimized
                  />
                  <div>
                    <h2 className="text-sm font-semibold">
                      {selectedConversation.user.displayName}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last seen {selectedConversation.user.lastSeen}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Image 
                    src={selectedConversation?.otherUser?.photoURL || defaultImage} 
                    alt={selectedConversation?.otherUser?.displayName || 'New Conversation'} 
                    width={64} 
                    height={64} 
                    className="rounded-full mr-4"
                    unoptimized
                  />
                  <div>
                    <h2 className="text-sm font-semibold">
                      {selectedConversation?.otherUser?.displayName || 'New Conversation'}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Starting new conversation...
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex-grow overflow-y-auto mb-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex mb-2 ${
                    msg.senderId === user.uid 
                      ? 'justify-end' 
                      : 'justify-start'
                  }`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.senderId === user.uid 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-200 dark:bg-gray-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-40 dark:text-gray-400 mt-1">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input 
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
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

