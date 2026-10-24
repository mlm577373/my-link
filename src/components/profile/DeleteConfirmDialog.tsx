'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { deleteLinkFromFirestore } from '@/lib/firestore';
import { useMyLinkStore } from '@/store/useMyLinkStore';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkId: string;
  linkTitle: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  linkId,
  linkTitle,
}: DeleteConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deleteLinkFromStore = useMyLinkStore((state) => state.deleteLink);

  const handleDelete = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await deleteLinkFromFirestore(linkId);
      deleteLinkFromStore(linkId);
      onOpenChange(false);
    } catch (error) {
      console.error('링크 삭제 실패:', error);
      setErrorMessage('링크 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">정말 삭제하시겠습니까?</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                선택한 링크가 영구적으로 삭제됩니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-left">
          {/* 삭제할 링크 정보 표시 */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">삭제할 링크:</span>
            <p className="text-sm font-semibold text-white break-words">
              {linkTitle}
            </p>
          </div>

          {/* 경고 문구 */}
          <p className="text-xs font-medium text-red-400 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>이 작업은 되돌릴 수 없습니다.</span>
          </p>

          {errorMessage && (
            <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              {errorMessage}
            </p>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-slate-300 hover:text-white"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                삭제 중...
              </>
            ) : (
              '삭제하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
