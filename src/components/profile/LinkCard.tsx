'use client';

import React, { useState } from 'react';
import { ChevronRight, Pencil, Trash2, X, Check, Sparkles, Loader2 } from 'lucide-react';
import { LinkItem, ButtonStyle } from '@/types';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { detectSocialPlatform } from '@/data/dummy-data';
import { updateLinkInFirestore } from '@/lib/firestore';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const AVAILABLE_ICONS = [
  { key: 'github', label: 'GitHub' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'X (Twitter)' },
  { key: 'mail', label: 'Email' },
  { key: 'blog', label: 'Blog' },
  { key: 'discord', label: 'Discord' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'code', label: 'Code' },
  { key: 'globe', label: 'Website' },
];

const BADGE_PRESETS = ['Official', 'Featured', 'Contact', 'New', 'Soon'];

interface LinkCardProps {
  link: LinkItem;
  buttonStyle?: ButtonStyle;
  cardThemeClass?: string;
  onLinkClick?: (id: string) => void;
  readOnly?: boolean;
}

export function LinkCard({
  link,
  buttonStyle = { shape: 'pill', variant: 'soft-glass' },
  cardThemeClass,
  onLinkClick,
  readOnly = false,
}: LinkCardProps) {
  // 인라인 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  // 삭제 확인 모달 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 수정 폼 상태
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [subtitle, setSubtitle] = useState(link.subtitle || '');
  const [icon, setIcon] = useState(link.icon || 'globe');
  const [badge, setBadge] = useState<string>(link.badge || '');
  const [isActive, setIsActive] = useState<boolean>(link.isActive ?? true);
  const [detectedBrand, setDetectedBrand] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateLinkInStore = useMyLinkStore((state) => state.updateLink);

  // 형태별 라운딩 클래스
  const shapeClass =
    buttonStyle.shape === 'pill'
      ? 'rounded-full px-5'
      : buttonStyle.shape === 'sharp'
      ? 'rounded-md px-4'
      : 'rounded-2xl px-5'; // default rounded

  const isSolidVariant = buttonStyle.variant === 'solid';
  const isOutlineVariant = buttonStyle.variant === 'outline';

  // 스타일 변형 클래스
  const getVariantClass = () => {
    switch (buttonStyle.variant) {
      case 'solid':
        return 'bg-white text-slate-900 border border-slate-200/80 shadow-md hover:bg-slate-50';
      case 'outline':
        return cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
          ? 'bg-white/70 border-2 border-slate-700/60 text-slate-900 hover:border-slate-900 hover:bg-white/90 shadow-sm'
          : 'bg-transparent border-2 border-white/40 text-white hover:border-white/80 hover:bg-white/10 shadow-sm';
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

  const handleClick = (e: React.MouseEvent) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  // 인라인 수정 모드 진입 시 기존 데이터로 초기화
  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUrl(link.url);
    setTitle(link.title);
    setSubtitle(link.subtitle || '');
    setIcon(link.icon || 'globe');
    setBadge(link.badge || '');
    setIsActive(link.isActive ?? true);
    setErrors({});
    setSubmitError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setSubmitError(null);
  };

  // URL 변경 시 플랫폼 감지
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (errors.url) {
      setErrors((prev) => ({ ...prev, url: undefined }));
    }

    if (newUrl.trim().length > 3) {
      const detection = detectSocialPlatform(newUrl);
      if (detection.platform !== 'custom') {
        setIcon(detection.icon);
        setDetectedBrand(detection.brandName);
        if (!title.trim()) {
          setTitle(detection.brandName);
        }
      } else {
        setDetectedBrand(null);
      }
    } else {
      setDetectedBrand(null);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  // 수정 저장 처리
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newErrors: { url?: string; title?: string } = {};

    if (!url.trim()) {
      newErrors.url = '연결할 URL을 입력해 주세요.';
    }

    if (!title.trim()) {
      newErrors.title = '링크 제목을 입력해 주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:')) {
      finalUrl = `https://${finalUrl}`;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const updatedData: Partial<LinkItem> = {
      ...link,
      title: title.trim(),
      url: finalUrl,
      icon,
      subtitle: subtitle.trim() || undefined,
      badge: badge.trim() || undefined,
      isActive,
    };

    try {
      await updateLinkInFirestore(link.id, updatedData);
      updateLinkInStore(link.id, updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Firestore 업데이트 실패:', err);
      setSubmitError('수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isEditing ? (
        /* 인라인 편집 모드 */
        <div
          className={cn(
            'w-full text-left p-4 rounded-2xl bg-slate-900/90 border border-white/20 text-white shadow-xl backdrop-blur-md transition-all duration-200'
          )}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5" />
              링크 정보 수정
            </span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="취소"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-3">
            {/* URL 입력 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-200">
                  URL <span className="text-pink-400">*</span>
                </label>
                {detectedBrand && (
                  <span className="flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-500/20">
                    <Sparkles className="w-2.5 h-2.5 text-pink-400" />
                    {detectedBrand}
                  </span>
                )}
              </div>
              <Input
                type="text"
                placeholder="https://..."
                value={url}
                onChange={handleUrlChange}
                className={errors.url ? 'border-pink-500 focus:ring-pink-500/20 text-xs py-1.5 h-8' : 'text-xs py-1.5 h-8'}
              />
              {errors.url && (
                <p className="text-[10px] text-pink-400 font-medium">{errors.url}</p>
              )}
            </div>

            {/* 링크 제목 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                링크 제목 <span className="text-pink-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="링크 제목 입력"
                value={title}
                onChange={handleTitleChange}
                className={errors.title ? 'border-pink-500 focus:ring-pink-500/20 text-xs py-1.5 h-8' : 'text-xs py-1.5 h-8'}
              />
              {errors.title && (
                <p className="text-[10px] text-pink-400 font-medium">{errors.title}</p>
              )}
            </div>

            {/* 보조 설명 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                보조 설명 <span className="text-slate-400 font-normal">(선택)</span>
              </label>
              <Input
                type="text"
                placeholder="보조 설명 입력"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="text-xs py-1.5 h-8"
              />
            </div>

            {/* 아이콘 선택 */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-200 block">아이콘</span>
              <div className="grid grid-cols-5 gap-1.5">
                {AVAILABLE_ICONS.map((item) => {
                  const isSelected = icon === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setIcon(item.key)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[11px] transition-all ${
                        isSelected
                          ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                      }`}
                      title={item.label}
                    >
                      <PlatformIcon name={item.key} className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[9px] truncate max-w-[45px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 뱃지 선택 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">강조 뱃지</span>
                {badge && (
                  <button
                    type="button"
                    onClick={() => setBadge('')}
                    className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                  >
                    지우기
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {BADGE_PRESETS.map((b) => {
                  const isSelected = badge === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBadge(isSelected ? '' : b)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                        isSelected
                          ? 'bg-pink-500/30 border-pink-400 text-pink-200 shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 공개 여부 토글 */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-semibold text-slate-200">링크 즉시 공개</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            {submitError && (
              <p className="text-[11px] text-pink-400 font-medium">{submitError}</p>
            )}

            {/* 액션 버튼 */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="text-xs h-8 text-slate-400 hover:text-white"
              >
                취소
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !url.trim() || !title.trim()}
                className="text-xs h-8 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    수정 완료
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* 기본 카드 뷰 (수정 & 삭제 버튼 항상 표시) */
        <div
          className={cn(
            'group relative flex items-center justify-between py-3.5 transition-all duration-300 ease-out',
            'hover:scale-[1.01]',
            shapeClass,
            getVariantClass()
          )}
        >
          {/* 본문 링크 영역 */}
          <a
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            onClick={handleClick}
            className="flex items-center gap-3.5 min-w-0 flex-1 pr-2"
          >
            {/* 아이콘 컨테이너 */}
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-6 transition-transform duration-300',
                isSolidVariant
                  ? 'bg-slate-100 text-slate-800 border border-slate-200'
                  : cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
                  ? 'bg-slate-900/10 text-slate-800 border border-slate-900/15'
                  : 'bg-white/10 text-white border border-white/15'
              )}
            >
              <PlatformIcon name={link.icon} className="w-5 h-5" />
            </div>

            {/* 텍스트 내용 */}
            <div className="text-left truncate">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'font-semibold text-sm sm:text-base tracking-tight truncate group-hover:underline underline-offset-4',
                    isSolidVariant
                      ? 'text-slate-900 decoration-slate-400'
                      : cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
                      ? 'text-slate-900 decoration-slate-500'
                      : 'text-white decoration-white/40'
                  )}
                >
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
                <p
                  className={cn(
                    'text-xs truncate mt-0.5 font-normal',
                    isSolidVariant
                      ? 'text-slate-600'
                      : cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
                      ? 'text-slate-600'
                      : 'text-white/80'
                  )}
                >
                  {link.subtitle}
                </p>
              )}
            </div>
          </a>

          {/* 우측 액션 영역: 수정/삭제 버튼 (작성자 전용) + 이동 화살표 */}
          <div className="flex items-center gap-1.5 pl-2 shrink-0">
            {!readOnly && (
              <>
                {/* 수정 버튼 */}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className={cn(
                    'p-1.5 rounded-lg active:scale-95 transition-all shadow-sm border',
                    isSolidVariant
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300'
                      : cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border-slate-300'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border-white/15'
                  )}
                  title="링크 수정"
                  aria-label="링크 수정"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  className={cn(
                    'p-1.5 rounded-lg active:scale-95 transition-all shadow-sm border',
                    isSolidVariant || cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
                      ? 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200'
                      : 'bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-red-200 border-red-500/20'
                  )}
                  title="링크 삭제"
                  aria-label="링크 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* 화살표 아이콘 */}
            <div
              className={cn(
                'transition-all ml-0.5',
                isSolidVariant || cardThemeClass?.includes('text-slate-900') || cardThemeClass?.includes('text-gray-900')
                  ? 'text-slate-500 group-hover:text-slate-900 group-hover:translate-x-0.5'
                  : 'opacity-60 group-hover:opacity-100 text-white group-hover:translate-x-0.5'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        linkId={link.id}
        linkTitle={link.title}
      />
    </>
  );
}
