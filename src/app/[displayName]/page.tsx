import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SAMPLE_PROFILES, DEFAULT_USER_PROFILE } from '@/data/dummy-data';
import { PublicProfileView } from '@/components/profile/PublicProfileView';
import { findUserByDisplayNameAndLinks } from '@/lib/firestore';
import { UserProfile } from '@/types';

interface PageProps {
  params: Promise<{
    displayName: string;
  }>;
}

/**
 * displayName 기준으로 Firestore 및 데모 프로필 데이터 조회
 */
async function getProfileData(rawDisplayName: string): Promise<{ profile: UserProfile; userId?: string } | null> {
  const decodedName = decodeURIComponent(rawDisplayName).trim();

  // 1. Firestore 조회: displayName 기준 쿼리
  // - 프로필: users/{userId}/profile (또는 users/{userId} 호환)
  // - 링크: users/{userId}/links
  try {
    const firestoreResult = await findUserByDisplayNameAndLinks(decodedName);
    if (firestoreResult) {
      return firestoreResult;
    }
  } catch (err) {
    console.error('Firestore 사용자 조회 오류:', err);
  }

  // 2. 샘플 더미 프로필 확인 (데모용 호환)
  if (SAMPLE_PROFILES[decodedName]) {
    return { profile: SAMPLE_PROFILES[decodedName] };
  }

  // 3. 기본 데모 사용자 확인
  if (
    decodedName === DEFAULT_USER_PROFILE.displayName ||
    decodedName === DEFAULT_USER_PROFILE.username
  ) {
    return { profile: DEFAULT_USER_PROFILE };
  }

  return null;
}

/**
 * 동적 SEO 메타데이터 생성
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { displayName } = await params;
  const data = await getProfileData(displayName);

  if (!data) {
    return {
      title: '사용자를 찾을 수 없습니다 | MyLink',
      description: '존재하지 않거나 삭제된 사용자의 프로필입니다.',
    };
  }

  const { profile } = data;
  return {
    title: `${profile.displayName}님의 마이링크`,
    description: profile.bio || `${profile.displayName}님의 마이링크 페이지입니다.`,
    openGraph: {
      title: `${profile.displayName}님의 마이링크`,
      description: profile.bio,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

/**
 * /[displayName] 동적 라우팅 페이지 컴포넌트
 */
export default async function DisplayNameProfilePage({ params }: PageProps) {
  const { displayName } = await params;
  const data = await getProfileData(displayName);

  // 일치하는 사용자가 없는 경우 404 Not Found 반환
  if (!data || !data.profile) {
    notFound();
  }

  const { profile, userId } = data;

  return (
    <PublicProfileView
      profile={profile}
      userId={userId}
    />
  );
}
