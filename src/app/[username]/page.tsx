import { notFound } from 'next/navigation';
import { SAMPLE_PROFILES, DEFAULT_USER_PROFILE } from '@/data/dummy-data';
import { ProfileView } from '@/components/profile/ProfileView';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const profile = SAMPLE_PROFILES[username] || (username === DEFAULT_USER_PROFILE.username ? DEFAULT_USER_PROFILE : null);

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

  // 샘플 프로필 검색
  let profile = SAMPLE_PROFILES[username];

  // 만약 샘플에 없고 기본 유저명인 경우
  if (!profile && username === DEFAULT_USER_PROFILE.username) {
    profile = DEFAULT_USER_PROFILE;
  }

  // 등록되지 않은 사용자인 경우 404
  if (!profile) {
    notFound();
  }

  return <ProfileView initialProfile={profile} useLiveStore={username === DEFAULT_USER_PROFILE.username} />;
}
