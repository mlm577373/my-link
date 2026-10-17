'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LinkItem, ButtonStyle } from '@/types';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  link: LinkItem;
  buttonStyle?: ButtonStyle;
  cardThemeClass?: string;
  onLinkClick?: (id: string) => void;
}

export function LinkCard({
  link,
  buttonStyle = { shape: 'pill', variant: 'soft-glass' },
  cardThemeClass,
  onLinkClick,
}: LinkCardProps) {
  // 형태별 라운딩 클래스
  const shapeClass =
    buttonStyle.shape === 'pill'
      ? 'rounded-full px-5'
      : buttonStyle.shape === 'sharp'
      ? 'rounded-md px-4'
      : 'rounded-2xl px-5'; // default rounded

  // 스타일 변형 클래스
  const getVariantClass = () => {
    switch (buttonStyle.variant) {
      case 'solid':
        return 'bg-white/90 text-slate-900 border-white shadow-md hover:bg-white';
      case 'outline':
        return 'bg-transparent border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/5';
      case 'soft-glass':
      default:
        return cardThemeClass || 'bg-white/10 border border-white/20 text-white hover:bg-white/15 backdrop-blur-md shadow-lg';
    }
  };

  const getBadgeVariant = (badgeText?: string) => {
    if (!badgeText) return 'default';
    const lower = badgeText.toLowerCase();
    if (lower.includes('official')) return 'official';
    if (lower.includes('featured')) return 'featured';
    if (lower.includes('contact')) return 'contact';
    if (lower.includes('new')) return 'new';
    if (lower.includes('soon')) return 'soon';
    return 'default';
  };

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  return (
    <a
      href={link.url}
      target={link.url.startsWith('http') ? '_blank' : undefined}
      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={cn(
        'group relative flex items-center justify-between py-3.5 transition-all duration-300 ease-out',
        'hover:scale-[1.02] active:scale-[0.98]',
        shapeClass,
        getVariantClass()
      )}
    >
      {/* 좌측: 아이콘 + 텍스트 영역 */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* 아이콘 컨테이너 */}
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-6 transition-transform duration-300">
          <PlatformIcon name={link.icon} className="w-5 h-5" />
        </div>

        {/* 텍스트 내용 */}
        <div className="text-left truncate">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight truncate group-hover:underline underline-offset-4 decoration-white/40">
              {link.title}
            </span>
            {link.badge && (
              <Badge
                variant={getBadgeVariant(link.badge)}
                className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider"
              >
                {link.badge}
              </Badge>
            )}
          </div>
          {link.subtitle && (
            <p className="text-xs opacity-80 truncate mt-0.5 font-normal">
              {link.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* 우측: 화살표 아이콘 */}
      <div className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all pl-2 shrink-0">
        <ChevronRight className="w-5 h-5" />
      </div>
    </a>
  );
}
