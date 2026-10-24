import { notFound } from 'next/navigation';
import { SAMPLE_PROFILES, DEFAULT_USER_PROFILE } from '@/data/dummy-data';
import { ProfileView } from '@/components/profile/ProfileView';
import { findUserAndLinks, sanitizeFirestoreData } from '@/lib/firestore';
import { UserProfile } from '@/types';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getProfileData(username: string): Promise<UserProfile | null> {
  // 1. Firestore에서 유저 및 users/{uid}/links 데이터 조회 (실제 가입/로그인 유저)
  try {
    const firestoreUser = await findUserAndLinks(username);
    if (firestoreUser) {
      return firestoreUser;
    }
  } catch (err) {
    console.error('Firestore 사용자 조회 오류:', err);
  }

  // 2. 샘플 더미 프로필 확인 (데모용)
  if (SAMPLE_PROFILES[username]) {
    return SAMPLE_PROFILES[username];
  }

  // 3. 기본 데모 사용자 확인
  if (username === DEFAULT_USER_PROFILE.username) {
    return DEFAULT_USER_PROFILE;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileData(username);

  if (!profile) {
    return {
      title: '사용자를 찾을 수 없습니다 | MyLink',
    };
  }

  return {
    title: `${profile.displayName} (@${profile.username}) | MyLink`,
    description: profile.bio,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileData(username);

  // 등록되지 않은 사용자인 경우 404
  if (!profile) {
    notFound();
  }

  // 공개 페이지이므로 useLiveStore는 false로 읽기 전용 렌더링
  return <ProfileView initialProfile={sanitizeFirestoreData(profile)} useLiveStore={false} />;
}
