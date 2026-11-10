'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  checkDisplayNameAvailability,
  checkUsernameAvailability,
  updateUserProfileWithAuth,
} from '@/lib/firestore';
import { UserProfile } from '@/types';
import {
  Pencil,
  Check,
  AlertCircle,
  Loader2,
  X,
  Plus,
  RotateCcw,
  User as UserIcon,
  AtSign,
  FileText,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditProfileDialogProps {
  user: User;
  profile: UserProfile;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
}

export function EditProfileDialog({
  user,
  profile,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  // 폼 입력 상태
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [username, setUsername] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [tags, setTags] = useState<string[]>(profile.tags || []);
  const [tagInput, setTagInput] = useState('');

  // 중복 확인 상태: 'idle' | 'checking' | 'available' | 'unavailable'
  const [displayNameCheckStatus, setDisplayNameCheckStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle');
  const [displayNameCheckMessage, setDisplayNameCheckMessage] = useState<string>('');

  const [usernameCheckStatus, setUsernameCheckStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle');
  const [usernameCheckMessage, setUsernameCheckMessage] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // 모달이 열릴 때 초기 데이터 세팅
  useEffect(() => {
    if (isOpen) {
      setDisplayName(profile.displayName || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl || user.photoURL || '');
      setTags(profile.tags || []);
      setTagInput('');
      setDisplayNameCheckStatus('idle');
      setDisplayNameCheckMessage('');
      setUsernameCheckStatus('idle');
      setUsernameCheckMessage('');
      setErrorBanner(null);
    }
  }, [isOpen, profile, user.photoURL]);

  // displayName 변경 시 중복 확인 상태 리셋
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setDisplayName(nextVal);
    if (nextVal.trim() === profile.displayName.trim()) {
      setDisplayNameCheckStatus('idle');
      setDisplayNameCheckMessage('');
    } else {
      setDisplayNameCheckStatus('idle');
      setDisplayNameCheckMessage('닉네임이 변경되었습니다. 중복 확인을 진행해주세요.');
    }
  };

  // username 변경 시 중복 확인 상태 리셋
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(nextVal);
    if (nextVal.trim() === profile.username.trim()) {
      setUsernameCheckStatus('idle');
      setUsernameCheckMessage('');
    } else {
      setUsernameCheckStatus('idle');
      setUsernameCheckMessage('아이디가 변경되었습니다. 중복 확인을 진행해주세요.');
    }
  };

  // displayName 중복 확인 실행
  const handleCheckDisplayName = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      setDisplayNameCheckStatus('unavailable');
      setDisplayNameCheckMessage('닉네임을 입력해주세요.');
      return;
    }

    // 본인의 원래 닉네임과 동일한 경우
    if (trimmed === profile.displayName.trim()) {
      setDisplayNameCheckStatus('available');
      setDisplayNameCheckMessage('현재 사용 중인 본인의 닉네임입니다.');
      return;
    }

    setDisplayNameCheckStatus('checking');
    try {
      const result = await checkDisplayNameAvailability(trimmed, user.uid);
      if (result.isAvailable) {
        setDisplayNameCheckStatus('available');
        setDisplayNameCheckMessage(result.message);
      } else {
        setDisplayNameCheckStatus('unavailable');
        setDisplayNameCheckMessage(result.message);
      }
    } catch {
      setDisplayNameCheckStatus('unavailable');
      setDisplayNameCheckMessage('확인 중 오류가 발생했습니다.');
    }
  };

  // username 중복 확인 실행
  const handleCheckUsername = async () => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) {
      setUsernameCheckStatus('unavailable');
      setUsernameCheckMessage('아이디를 입력해주세요.');
      return;
    }

    if (trimmed === profile.username.trim().toLowerCase()) {
      setUsernameCheckStatus('available');
      setUsernameCheckMessage('현재 사용 중인 본인의 아이디입니다.');
      return;
    }

    setUsernameCheckStatus('checking');
    try {
      const result = await checkUsernameAvailability(trimmed, user.uid);
      if (result.isAvailable) {
        setUsernameCheckStatus('available');
        setUsernameCheckMessage(result.message);
      } else {
        setUsernameCheckStatus('unavailable');
        setUsernameCheckMessage(result.message);
      }
    } catch {
      setUsernameCheckStatus('unavailable');
      setUsernameCheckMessage('확인 중 오류가 발생했습니다.');
    }
  };

  // Google 기본 프로필 이미지로 복원
  const handleResetGoogleAvatar = () => {
    if (user.photoURL) {
      setAvatarUrl(user.photoURL);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    if (tags.length >= 6) {
      alert('태그는 최대 6개까지 등록할 수 있습니다.');
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput('');
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // 폼 제출 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedDisplayName) {
      setErrorBanner('닉네임을 입력해주세요.');
      return;
    }

    // 닉네임이 변경되었는데 중복 확인이 안 된 경우 자동 중복 확인 실행
    if (
      trimmedDisplayName !== profile.displayName.trim() &&
      displayNameCheckStatus !== 'available'
    ) {
      const result = await checkDisplayNameAvailability(trimmedDisplayName, user.uid);
      if (!result.isAvailable) {
        setDisplayNameCheckStatus('unavailable');
        setDisplayNameCheckMessage(result.message);
        setErrorBanner(`닉네임 중복 오류: ${result.message}`);
        return;
      }
    }

    // username이 변경되었는데 중복 확인이 안 된 경우 자동 중복 확인 실행
    if (
      trimmedUsername &&
      trimmedUsername !== profile.username.trim().toLowerCase() &&
      usernameCheckStatus !== 'available'
    ) {
      const result = await checkUsernameAvailability(trimmedUsername, user.uid);
      if (!result.isAvailable) {
        setUsernameCheckStatus('unavailable');
        setUsernameCheckMessage(result.message);
        setErrorBanner(`아이디 중복 오류: ${result.message}`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const updatedProfileData: Partial<UserProfile> = {
        displayName: trimmedDisplayName,
        username: trimmedUsername || profile.username,
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        tags: tags,
      };

      await updateUserProfileWithAuth(user.uid, updatedProfileData);

      const mergedProfile: UserProfile = {
        ...profile,
        ...updatedProfileData,
      };

      if (onProfileUpdated) {
        onProfileUpdated(mergedProfile);
      }

      setIsOpen(false);
    } catch (err) {
      console.error('프로필 저장 오류:', err);
      setErrorBanner('프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white/10 hover:bg-white/20 border-white/20 text-white gap-1.5 text-xs h-8 px-3 transition-colors backdrop-blur-md"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>프로필 수정</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md w-full bg-slate-900/95 border-white/15 text-white backdrop-blur-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left pb-2 border-b border-white/10">
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
            <Pencil className="w-5 h-5 text-indigo-400" />
            프로필 수정
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            마이링크 페이지에 표시될 프로필 정보와 닉네임을 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {errorBanner && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorBanner}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 pt-3">
          {/* 1. 프로필 이미지 미리보기 및 설정 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              프로필 이미지
            </label>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <Avatar size="lg" className="border-2 border-indigo-400/50 shadow-md shrink-0">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback className="text-sm font-bold bg-indigo-950 text-indigo-300">
                  {displayName ? displayName.slice(0, 2).toUpperCase() : 'ML'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1.5 min-w-0">
                <Input
                  type="url"
                  placeholder="이미지 URL (https://...)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="h-8 text-xs bg-black/40 border-white/15"
                />
                {user.photoURL && avatarUrl !== user.photoURL && (
                  <button
                    type="button"
                    onClick={handleResetGoogleAvatar}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Google 프로필 사진 사용
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Display Name (표시 이름 / 닉네임) + 중복 확인 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                표시 이름 (Display Name) <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-slate-400">2~20자 이내</span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="표시될 닉네임을 입력하세요"
                value={displayName}
                maxLength={20}
                onChange={handleDisplayNameChange}
                required
                className={cn(
                  'h-9 text-sm bg-black/40 border-white/15',
                  displayNameCheckStatus === 'available' && 'border-emerald-500/60 focus:border-emerald-400',
                  displayNameCheckStatus === 'unavailable' && 'border-rose-500/60 focus:border-rose-400'
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCheckDisplayName}
                disabled={
                  displayNameCheckStatus === 'checking' ||
                  !displayName.trim() ||
                  (displayName.trim() === profile.displayName.trim() &&
                    displayNameCheckStatus === 'available')
                }
                className="h-9 px-3 text-xs shrink-0 bg-indigo-600/30 hover:bg-indigo-600/50 border-indigo-500/40 text-indigo-200"
              >
                {displayNameCheckStatus === 'checking' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  '중복 확인'
                )}
              </Button>
            </div>

            {/* 중복 확인 피드백 메시지 */}
            {displayNameCheckMessage && (
              <p
                className={cn(
                  'text-[11px] flex items-center gap-1 pt-0.5',
                  displayNameCheckStatus === 'available' && 'text-emerald-400 font-medium',
                  displayNameCheckStatus === 'unavailable' && 'text-rose-400 font-medium',
                  displayNameCheckStatus === 'idle' && 'text-amber-300/90'
                )}
              >
                {displayNameCheckStatus === 'available' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : displayNameCheckStatus === 'unavailable' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
                <span>{displayNameCheckMessage}</span>
              </p>
            )}
          </div>

          {/* 3. Username (@아이디 / 공개 페이지 URL) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-indigo-400" />
                공개 주소 아이디 (Username)
              </label>
              <span className="text-[10px] text-slate-400">영문/숫자/_- (3~20자)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 select-none">
                  @
                </span>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  maxLength={20}
                  onChange={handleUsernameChange}
                  className="pl-7 h-9 text-sm font-mono bg-black/40 border-white/15"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCheckUsername}
                disabled={
                  usernameCheckStatus === 'checking' ||
                  !username.trim() ||
                  (username.trim().toLowerCase() === profile.username.trim().toLowerCase() &&
                    usernameCheckStatus === 'available')
                }
                className="h-9 px-3 text-xs shrink-0 bg-white/5 hover:bg-white/15 border-white/15 text-slate-200"
              >
                {usernameCheckStatus === 'checking' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  '중복 확인'
                )}
              </Button>
            </div>

            {usernameCheckMessage ? (
              <p
                className={cn(
                  'text-[11px] flex items-center gap-1 pt-0.5',
                  usernameCheckStatus === 'available' && 'text-emerald-400 font-medium',
                  usernameCheckStatus === 'unavailable' && 'text-rose-400 font-medium',
                  usernameCheckStatus === 'idle' && 'text-amber-300/90'
                )}
              >
                {usernameCheckStatus === 'available' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : usernameCheckStatus === 'unavailable' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
                <span>{usernameCheckMessage}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 font-mono">
                공유 링크: /{username || 'username'}
              </p>
            )}
          </div>

          {/* 4. Bio (한 줄 소개글) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                소개글 (Bio)
              </label>
              <span className="text-[10px] text-slate-400">{bio.length} / 150자</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={2}
              placeholder="나를 소개하는 멋진 한마디를 적어보세요."
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition-all outline-none focus:border-indigo-400 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-400/20 resize-none"
            />
          </div>

          {/* 5. Tags (관심사 태그) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                관심사 태그 ({tags.length}/6)
              </label>
              <span className="text-[10px] text-slate-400">Enter로 추가</span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="태그 입력 (예: 개발자, 음악, 취미)"
                value={tagInput}
                maxLength={15}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="h-8 text-xs bg-black/40 border-white/15"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 6}
                className="h-8 px-2.5 text-xs bg-white/5 hover:bg-white/15 border-white/15 text-slate-200 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                추가
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="pl-2.5 pr-1.5 py-0.5 text-xs bg-white/5 border-white/15 text-slate-200 flex items-center gap-1 rounded-full group hover:border-rose-400/40"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                      title="태그 삭제"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-white/10 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
              className="h-9 px-4 text-xs bg-white/5 hover:bg-white/10 border-white/15 text-slate-300"
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || displayNameCheckStatus === 'unavailable' || usernameCheckStatus === 'unavailable'}
              className="h-9 px-5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-md shadow-indigo-500/25 border-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장 완료'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
