import { UserProfile, LinkItem, ThemePreset, SocialPlatform } from '@/types';

/**
 * PRD 4.3 및 시나리오 A 기준 기본 시드 데이터
 * 사용자: 김민준 (@mlm577373)
 */
export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: 'link-1',
    title: 'GitHub',
    subtitle: '@mlm577373 • 오픈소스 프로젝트 & 코드',
    url: 'https://github.com/mlm577373',
    icon: 'github',
    isActive: true,
    clicks: 342,
    order: 1,
    badge: 'Official',
  },
  {
    id: 'link-2',
    title: '포트폴리오 웹사이트',
    subtitle: '최신 프로젝트 & 작업물 모음',
    url: 'https://portfolio.mlm577373.dev',
    icon: 'globe',
    isActive: true,
    clicks: 528,
    order: 2,
    badge: 'Featured',
  },
  {
    id: 'link-3',
    title: '이메일 문의',
    subtitle: 'mlm577373@gmail.com',
    url: 'mailto:mlm577373@gmail.com',
    icon: 'mail',
    isActive: true,
    clicks: 89,
    order: 3,
    badge: 'Contact',
  },
  {
    id: 'link-4',
    title: '개발 & 테크 유튜브 채널',
    subtitle: '실전 코딩 강좌와 개발자 브이로그 📺',
    url: 'https://youtube.com/@mlm577373',
    icon: 'youtube',
    isActive: true,
    clicks: 215,
    order: 4,
    badge: 'New',
  },
  {
    id: 'link-5',
    title: '인스타그램',
    subtitle: '일상과 개발 라이프스타일 📸',
    url: 'https://instagram.com/mlm577373',
    icon: 'instagram',
    isActive: true,
    clicks: 147,
    order: 5,
  },
  {
    id: 'link-6',
    title: '기술 블로그 (준비 중)',
    subtitle: '배운 것을 깊이 기록하고 나누는 공간',
    url: 'https://velog.io/@mlm577373',
    icon: 'blog',
    isActive: false, // PRD 시나리오 4: 임시 비공개(숨김) 상태 테스트용
    clicks: 12,
    order: 6,
    badge: 'Soon',
  },
  {
    id: 'link-7',
    title: '커피 한 잔 후원하기',
    subtitle: '오픈소스 활동을 응원해 주세요 ☕',
    url: 'https://buymeacoffee.com/mlm577373',
    icon: 'coffee',
    isActive: true,
    clicks: 64,
    order: 7,
  },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  username: 'mlm577373',
  displayName: '김민준',
  bio: '아이디어를 현실로 만드는 개발 공간 🚀\nNext.js와 TypeScript로 사용자 중심 서비스를 만듭니다.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  tags: ['Next.js', 'TypeScript', 'Frontend', 'Creative'],
  theme: 'aurora-dream', // PRD 시나리오 5: Aurora Dream 테마 기본 적용
  buttonStyle: {
    shape: 'pill',
    variant: 'soft-glass',
  },
  links: DEFAULT_LINKS,
  socialLinks: [
    { id: 'social-1', platform: 'github', url: 'https://github.com/mlm577373', title: 'GitHub' },
    { id: 'social-2', platform: 'youtube', url: 'https://youtube.com/@mlm577373', title: 'YouTube' },
    { id: 'social-3', platform: 'instagram', url: 'https://instagram.com/mlm577373', title: 'Instagram' },
    { id: 'social-4', platform: 'mail', url: 'mailto:mlm577373@gmail.com', title: 'Email' },
  ],
};

/**
 * PRD 4.1 E: 6가지 완성형 프리셋 테마 정의
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    key: 'modern-dark',
    name: 'Modern Dark',
    description: '딥 네이비 & 인디고 글래스모피즘',
    bgClass: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950',
    cardClass: 'bg-slate-900/60 border-slate-700/60 text-slate-100 hover:border-indigo-500/80 backdrop-blur-md',
    textClass: 'text-slate-100',
    accentColor: '#6366f1',
  },
  {
    key: 'minimalist-light',
    name: 'Minimalist Light',
    description: '깔끔하고 단정한 화이트 & 라이트 그레이',
    bgClass: 'bg-gradient-to-br from-neutral-50 via-gray-100 to-stone-200',
    cardClass: 'bg-white/80 border-gray-200 text-gray-900 hover:border-gray-400 shadow-sm backdrop-blur-sm',
    textClass: 'text-gray-900',
    accentColor: '#18181b',
  },
  {
    key: 'aurora-dream',
    name: 'Aurora Dream',
    description: '몽환적인 핑크-퍼플 그라데이션',
    bgClass: 'bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900',
    cardClass: 'bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-pink-400/50 backdrop-blur-lg shadow-lg',
    textClass: 'text-white',
    accentColor: '#ec4899',
  },
  {
    key: 'cyber-neon',
    name: 'Cyber Neon',
    description: '미래지향적 네온 그린 & 블랙 콘트라스트',
    bgClass: 'bg-gradient-to-b from-black via-zinc-950 to-neutral-900',
    cardClass: 'bg-black/80 border-emerald-500/40 text-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    textClass: 'text-emerald-400',
    accentColor: '#10b981',
  },
  {
    key: 'sunset-warm',
    name: 'Sunset Warm',
    description: '따뜻한 오렌지-코랄 노을 감성',
    bgClass: 'bg-gradient-to-br from-amber-700 via-rose-800 to-orange-950',
    cardClass: 'bg-white/10 border-orange-300/20 text-amber-50 hover:bg-white/15 hover:border-orange-300/40 backdrop-blur-md',
    textClass: 'text-amber-50',
    accentColor: '#f97316',
  },
  {
    key: 'forest-sage',
    name: 'Forest Sage',
    description: '차분하고 안정적인 세이지 그린/올리브 톤',
    bgClass: 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950',
    cardClass: 'bg-emerald-900/30 border-emerald-800/40 text-emerald-100 hover:border-emerald-600/60 backdrop-blur-md',
    textClass: 'text-emerald-100',
    accentColor: '#14b8a6',
  },
];

/**
 * 테스팅 및 데모용 다양한 페르소나 프로필 목록
 */
export const SAMPLE_PROFILES: Record<string, UserProfile> = {
  mlm577373: DEFAULT_USER_PROFILE,
  sophia_tech: {
    username: 'sophia_tech',
    displayName: '소피아 | 테크 크리에이터',
    bio: '생산성 앱 & 테크 디바이스를 리뷰합니다 📱\n새로운 영상은 매주 목요일 오후 6시 업로드!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    tags: ['Tech Review', 'Gadgets', 'Productivity'],
    theme: 'modern-dark',
    buttonStyle: {
      shape: 'rounded',
      variant: 'solid',
    },
    links: [
      {
        id: 'sophia-1',
        title: '최신 맥북 세팅 & 데스크테리어 영상',
        subtitle: '유튜브 본편 바로가기',
        url: 'https://youtube.com',
        icon: 'youtube',
        isActive: true,
        clicks: 1420,
        order: 1,
        badge: 'NEW',
      },
      {
        id: 'sophia-2',
        title: '2026 생산성 노션 템플릿',
        subtitle: '무료 배포 중 (1만 다운로드 돌파)',
        url: 'https://notion.so',
        icon: 'globe',
        isActive: true,
        clicks: 3105,
        order: 2,
        badge: 'BEST',
      },
      {
        id: 'sophia-3',
        title: '비즈니스 및 광고 협업 문의',
        subtitle: 'sophia.tech@business.com',
        url: 'mailto:sophia.tech@business.com',
        icon: 'mail',
        isActive: true,
        clicks: 430,
        order: 3,
      },
    ],
    socialLinks: [
      { id: 's-1', platform: 'youtube', url: 'https://youtube.com' },
      { id: 's-2', platform: 'instagram', url: 'https://instagram.com' },
      { id: 's-3', platform: 'mail', url: 'mailto:sophia.tech@business.com' },
    ],
  },
  seoyeon_design: {
    username: 'seoyeon_design',
    displayName: '이서연',
    bio: 'UX/UI Product Designer ✨\n복잡한 문제를 직관적이고 아름다운 인터페이스로 풀어냅니다.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    tags: ['UX/UI', 'Figma', 'Design System'],
    theme: 'minimalist-light',
    buttonStyle: {
      shape: 'sharp',
      variant: 'outline',
    },
    links: [
      {
        id: 'seoyeon-1',
        title: 'Behance 디자인 포트폴리오',
        subtitle: '선정작 & 프로덕트 케이스 스터디',
        url: 'https://behance.net',
        icon: 'globe',
        isActive: true,
        clicks: 890,
        order: 1,
        badge: 'Portfolio',
      },
      {
        id: 'seoyeon-2',
        title: 'Figma 커뮤니티 디자인 시스템',
        subtitle: '피그마 공식 커뮤니티 배포 킷',
        url: 'https://figma.com',
        icon: 'globe',
        isActive: true,
        clicks: 654,
        order: 2,
      },
    ],
  },
};

/**
 * URL 분석을 통한 자동 소셜 아이콘 매칭 유틸리티 (PRD 4.1 C 요구사항)
 */
export function detectSocialPlatform(url: string): { platform: SocialPlatform; icon: string; brandName: string } {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('github.com')) {
    return { platform: 'github', icon: 'github', brandName: 'GitHub' };
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { platform: 'youtube', icon: 'youtube', brandName: 'YouTube' };
  }
  if (lowerUrl.includes('instagram.com')) {
    return { platform: 'instagram', icon: 'instagram', brandName: 'Instagram' };
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return { platform: 'twitter', icon: 'twitter', brandName: 'X (Twitter)' };
  }
  if (lowerUrl.startsWith('mailto:')) {
    return { platform: 'mail', icon: 'mail', brandName: 'Email' };
  }
  if (lowerUrl.includes('linkedin.com')) {
    return { platform: 'linkedin', icon: 'linkedin', brandName: 'LinkedIn' };
  }
  if (lowerUrl.includes('discord.gg') || lowerUrl.includes('discord.com')) {
    return { platform: 'discord', icon: 'discord', brandName: 'Discord' };
  }
  if (lowerUrl.includes('velog.io') || lowerUrl.includes('tistory.com') || lowerUrl.includes('medium.com')) {
    return { platform: 'blog', icon: 'blog', brandName: 'Tech Blog' };
  }
  if (lowerUrl.includes('buymeacoffee.com')) {
    return { platform: 'coffee', icon: 'coffee', brandName: 'Buy Me a Coffee' };
  }

  return { platform: 'custom', icon: 'globe', brandName: 'Website' };
}

/**
 * 전체 링크의 총 누적 클릭 수를 계산하는 헬퍼 함수 (PRD 4.1 D 요구사항)
 */
export function getTotalClicks(links: LinkItem[]): number {
  return links.reduce((total, link) => total + (link.clicks || 0), 0);
}
