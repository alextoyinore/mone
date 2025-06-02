import Image from 'next/image';
import defaultImage from '@/assets/default-image.svg';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function ConversationItem({ conv, user }) {

    const getOtherUser = (conversation, currentUser) => {
        return conversation.users.find(userId => userId !== currentUser?.uid);
      };
    
    const { currentSong } = useAudioPlayer();
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
    }, [conv, user]);

    const lastMessage = conv.lastMessage || {
        text: 'No messages yet',
        timestamp: null
    };

    if (!otherUserData) {
        return <div>Loading...</div>;
    }

    return (
        <button
        key={conv.id}
        onClick={() => setSelectedConversation(conv)}
        className={`w-full flex items-center p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition ${
            selectedConversation?.id === conv.id 
            ? 'bg-gray-100 dark:bg-gray-900' 
            : ''
        }`}
        >
        <div className="rounded-full mr-4 bg-gray-200 dark:bg-gray-800 w-12 h-12 flex items-center justify-center">
            {otherUserData.displayName[0]}
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-sm">{otherUserData.displayName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
            {lastMessage.text}
            </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(lastMessage.timestamp)}
        </p>
        </button>
    );
}

