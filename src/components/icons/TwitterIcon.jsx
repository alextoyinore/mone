"use client";

import Image from 'next/image';
import Twitter from '@/assets/twitter.svg';

import React from 'react';

export default function TwitterIcon({ className = '', ...props }) {
  return (
    <Image
      src={Twitter}
      alt="Twitter"
      width={24}
      height={24}
      className={className + ' cursor-pointer'}
      {...props}
    />
  );
}
