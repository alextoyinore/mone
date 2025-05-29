"use client";

import React from 'react';
import Instagram from '@/assets/instagram.svg';
import Image from 'next/image';

export default function InstagramIcon({ className = '', ...props }) {
  return (
    <Image
      src={Instagram}
      alt="Instagram"
      width={24}
      height={24}
      className={className + ' cursor-pointer'}
      {...props}
    />
  );
}
