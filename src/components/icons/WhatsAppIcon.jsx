"use client";

import React from 'react';
import WhatsApp from '@/assets/whatsapp.svg';
import Image from 'next/image';

export default function WhatsAppIcon({ className = '', ...props }) {
  return (
    <Image
      src={WhatsApp}
      alt="WhatsApp"
      width={24}
      height={24}
      className={className + ' cursor-pointer'}
      {...props}
    />
  );
}
