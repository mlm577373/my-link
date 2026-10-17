'use client';

import React from 'react';
import { SocialLink } from '@/types';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialBarProps {
  socialLinks?: SocialLink[];
}

export function SocialBar({ socialLinks }: SocialBarProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {socialLinks.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target={item.url.startsWith('http') ? '_blank' : undefined}
          rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          title={item.title || item.platform}
          aria-label={item.title || item.platform}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md shadow-sm hover:scale-110 active:scale-95 transition-all duration-200'
          )}
        >
          <PlatformIcon name={item.platform} className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
