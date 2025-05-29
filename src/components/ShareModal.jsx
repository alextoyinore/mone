"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import CopyIcon from '@/components/icons/CopyIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import CloseIcon from '@/components/icons/CloseIcon';

export default function ShareModal({ isOpen, onClose, url, title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform) => {
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title || '');

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank');
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/share?url=${shareUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${shareTitle}%20${shareUrl}`, '_blank');
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Share "{title}"</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseIcon className='h-6 w-6 cursor-pointer' />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCopy}
                className={`flex items-center text-sm cursor-pointer gap-2 px-4 py-2 rounded-full transition-colors ${
                  copied ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <CopyIcon className="w-5 h-5" />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center cursor-pointer text-sm gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <FacebookIcon className="w-5 h-5" />
                {/* <span>Facebook</span> */}
              </button>

              <button 
                onClick={() => handleShare('twitter')}
                className="flex items-center cursor-pointer text-sm gap-2 px-4 py-2 rounded-full bg-blue-400 text-white hover:bg-blue-500"
              >
                <TwitterIcon className="w-5 h-5 cursor-pointer text-white" />
                {/* <span>Twitter</span> */}
              </button>

              <button 
                onClick={() => handleShare('instagram')}
                className="flex items-center cursor-pointer text-sm gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
              >
                <InstagramIcon className="w-5 h-5 cursor-pointer" />
                {/* <span>Instagram</span> */}
              </button>

              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex items-center cursor-pointer text-sm gap-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                <WhatsAppIcon className="w-5 h-5 cursor-pointer" />
                {/* <span>WhatsApp</span> */}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <p>Link to share:</p>
              <div className="mt-1 bg-gray-100 p-2 rounded">
                <span className="text-gray-800">{url}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
