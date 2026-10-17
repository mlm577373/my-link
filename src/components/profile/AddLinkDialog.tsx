'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { detectSocialPlatform } from '@/data/dummy-data';
import { addLinkToFirestore } from '@/lib/firestore';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

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

interface AddLinkDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddLinkDialog({ trigger, open: controlledOpen, onOpenChange: setControlledOpen }: AddLinkDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const addLinkToStore = useMyLinkStore((state) => state.addLink);

  // 폼 상태
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [icon, setIcon] = useState('globe');
  const [badge, setBadge] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [detectedBrand, setDetectedBrand] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // URL 입력 시 스마트 플랫폼 자동 감지
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
        // 만약 제목이 비어있다면 추천 브랜드명 자동 제안
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

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setSubtitle('');
    setIcon('globe');
    setBadge('');
    setIsActive(true);
    setDetectedBrand(null);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { url?: string; title?: string } = {};

    if (!url.trim()) {
      newErrors.url = '연결할 URL을 입력해 주세요.';
    } else {
      // URL 형식 보정 (http나 https나 mailto가 없으면 기본 https:// 추가)
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://') && !formattedUrl.startsWith('mailto:')) {
        formattedUrl = `https://${formattedUrl}`;
      }
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

    setIsLoading(true);
    setSubmitError(null);

    try {
      const newOrder = Date.now(); // 임시 order (추가 순서 보장)
      // Firestore에 저장 후 반환된 문서 ID로 스토어 동기화
      const savedLink = await addLinkToFirestore({
        title: title.trim(),
        url: finalUrl,
        icon,
        subtitle: subtitle.trim() || undefined,
        badge: badge.trim() || undefined,
        isActive,
        clicks: 0,
        order: newOrder,
      });

      // 스토어를 직접 패치하여 id를 Firestore 문서 ID로 일치시킴
      useMyLinkStore.setState((state) => ({
        profile: {
          ...state.profile,
          links: [...state.profile.links, savedLink],
        },
      }));

      resetForm();
      setIsOpen(false);
    } catch (err) {
      console.error('Firestore 저장 실패:', err);
      setSubmitError('링크 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle>새 링크 추가하기</DialogTitle>
              <DialogDescription>
                방문자에게 보여줄 새로운 링크 카드를 등록합니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* 1. URL 입력 (스마트 감지) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">
                연결 URL <span className="text-pink-400">*</span>
              </label>
              {detectedBrand && (
                <span className="flex items-center gap-1 text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  {detectedBrand} 감지됨
                </span>
              )}
            </div>
            <Input
              type="text"
              placeholder="https://github.com/username 또는 URL"
              value={url}
              onChange={handleUrlChange}
              className={errors.url ? 'border-pink-500 focus:ring-pink-500/20' : ''}
              autoFocus
            />
            {errors.url && (
              <p className="text-[11px] text-pink-400 font-medium">{errors.url}</p>
            )}
          </div>

          {/* 2. 링크 제목 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              링크 제목 <span className="text-pink-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="예: 내 GitHub 레포지토리"
              value={title}
              onChange={handleTitleChange}
              className={errors.title ? 'border-pink-500 focus:ring-pink-500/20' : ''}
            />
            {errors.title && (
              <p className="text-[11px] text-pink-400 font-medium">{errors.title}</p>
            )}
          </div>

          {/* 3. 서브타이틀 / 상세 설명 (선택) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              보조 설명 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <Input
              type="text"
              placeholder="예: 오픈소스 프로젝트 및 소스 코드 모음"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          {/* 4. 아이콘 선택 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">아이콘 선택</span>
              <span className="text-slate-400 text-[11px]">
                현재: <span className="text-indigo-300 font-medium uppercase">{icon}</span>
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = icon === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setIcon(item.key)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                    title={item.label}
                  >
                    <PlatformIcon name={item.key} className="w-4 h-4 mb-1" />
                    <span className="text-[10px] truncate max-w-[50px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 뱃지 프리셋 선택 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                강조 뱃지 <span className="text-slate-400 font-normal">(선택)</span>
              </span>
              {badge && (
                <button
                  type="button"
                  onClick={() => setBadge('')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                >
                  지우기
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BADGE_PRESETS.map((b) => {
                const isSelected = badge === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(isSelected ? '' : b)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
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

          {/* 6. 공개 여부 토글 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-xs font-semibold text-slate-200">링크 즉시 공개</p>
              <p className="text-[11px] text-slate-400">
                비활성화 시 방문자에게 카드가 숨겨집니다.
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* 에러 메시지 */}
          {submitError && (
            <p className="text-[11px] text-pink-400 font-medium text-center">{submitError}</p>
          )}

          {/* 다이얼로그 푸터 (버튼) */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              disabled={isLoading}
              className="text-slate-400 hover:text-white"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!!errors.url || !!errors.title || !url.trim() || !title.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  링크 추가 완료
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
