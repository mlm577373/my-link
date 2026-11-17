import { ImageResponse } from 'next/og';
import { SAMPLE_PROFILES, DEFAULT_USER_PROFILE } from '@/data/dummy-data';
import { findUserByDisplayNameAndLinks } from '@/lib/firestore';
import { UserProfile } from '@/types';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{
    displayName: string;
  }>;
}

/**
 * displayName 기준으로 프로필 데이터 조회
 */
async function getProfile(rawDisplayName: string): Promise<{ profile: UserProfile; linkCount: number }> {
  const decodedName = decodeURIComponent(rawDisplayName).trim();

  // 1. Firestore 조회 시도
  try {
    const firestoreResult = await findUserByDisplayNameAndLinks(decodedName);
    if (firestoreResult?.profile) {
      return {
        profile: firestoreResult.profile,
        linkCount: firestoreResult.profile.links?.length || 0,
      };
    }
  } catch (err) {
    // Firestore 오류 시 더미 폴백으로 진행
  }

  // 2. 샘플 프로필 확인
  if (SAMPLE_PROFILES[decodedName]) {
    const sample = SAMPLE_PROFILES[decodedName];
    return {
      profile: sample,
      linkCount: sample.links?.length || 0,
    };
  }

  // 3. 기본 데모 사용자 확인
  if (
    decodedName === DEFAULT_USER_PROFILE.displayName ||
    decodedName === DEFAULT_USER_PROFILE.username
  ) {
    return {
      profile: DEFAULT_USER_PROFILE,
      linkCount: DEFAULT_USER_PROFILE.links?.length || 0,
    };
  }

  // 4. 조회되지 않는 이름일 경우 기본 가상 프로필 생성
  return {
    profile: {
      username: decodedName,
      displayName: decodedName,
      bio: '마이링크에서 나만의 링크와 소셜 채널을 모아보세요 🚀',
      tags: ['MyLink', 'Creator'],
      theme: 'aurora-dream',
      buttonStyle: {
        shape: 'pill',
        variant: 'soft-glass',
      },
      links: [],
    },
    linkCount: 3,
  };
}

/**
 * 외부 아바타 이미지를 배포 환경에서도 안전하게 base64 data URL로 로드
 * 실패나 타임아웃 시 null을 반환하여 이니셜 아바타로 안전하게 대체
 */
async function getSafeAvatarDataUrl(url?: string): Promise<string | null> {
  if (!url || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: Props) {
  const { displayName: rawDisplayName } = await params;
  const decodedName = decodeURIComponent(rawDisplayName || 'MyLink').trim();
  const { profile, linkCount } = await getProfile(decodedName);

  const initial = profile.displayName ? profile.displayName.slice(0, 1).toUpperCase() : 'M';
  const avatarDataUrl = await getSafeAvatarDataUrl(profile.avatarUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '50px 60px',
          backgroundColor: '#020617', // slate-950
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.28) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.25) 0%, transparent 45%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 상단 바: 로고 및 고유 공유 링크 뱃지 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* MyLink 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(236, 72, 153, 0.35)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(to right, #f472b6, #c084fc, #818cf8)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              MyLink
            </span>
          </div>

          {/* 고유 URL 배지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#e2e8f0',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
          >
            <span style={{ color: '#f472b6' }}>@</span>
            <span>{profile.username || decodedName}</span>
          </div>
        </div>

        {/* 중앙: 대형 메인 글래스 프로필 쇼케이스 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '28px',
            padding: '36px 44px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
          }}
        >
          {/* 카드 상단: 아바타 + 프로필 텍스트 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* 아바타 (그라데이션 링) */}
            <div
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '9999px',
                padding: '4px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(99, 102, 241, 0.35)',
                flexShrink: 0,
              }}
            >
              {avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarDataUrl}
                  alt={profile.displayName}
                  width="102"
                  height="102"
                  style={{
                    width: '102px',
                    height: '102px',
                    borderRadius: '9999px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '102px',
                    height: '102px',
                    borderRadius: '9999px',
                    backgroundColor: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#ffffff',
                  }}
                >
                  {initial}
                </div>
              )}
            </div>

            {/* 유저 텍스트 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '38px',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {profile.displayName || decodedName}
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(236, 72, 153, 0.18)',
                    border: '1px solid rgba(236, 72, 153, 0.35)',
                    color: '#f472b6',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  PROFILE
                </span>
              </div>

              {/* 바이오 소개글 */}
              <p
                style={{
                  fontSize: '18px',
                  color: '#cbd5e1',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '750px',
                }}
              >
                {profile.bio?.split('\n')[0] || '아이디어를 현실로 만드는 나만의 링크 공간 🚀'}
              </p>

              {/* 태그 리스트 */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {(profile.tags && profile.tags.length > 0 ? profile.tags : ['MyLink', 'Creator']).slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#94a3b8',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 카드 하단 메트릭스 & 액션 인디케이터 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* 링크 수 정보 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
                {linkCount > 0 ? `${linkCount}개의 연결된 링크 및 소셜 채널` : '소셜 채널 및 포트폴리오 모음'}
              </span>
            </div>

            {/* 바로가기 버튼 UI 모양 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              }}
            >
              <span>프로필 둘러보기</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 하단 푸터 바 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          <span>원클릭으로 완성하는 나만의 올인원 프로필 링크</span>
          <span style={{ fontFamily: 'monospace' }}>mylink.io/@{encodeURIComponent(profile.username || decodedName)}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
