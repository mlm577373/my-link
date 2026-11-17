/**
 * 배포 환경(Vercel, Firebase 등) 및 로컬 환경에 맞는 절대 Base URL 반환
 * Next.js metadataBase 설정 및 절대 OG 이미지 URL 생성에 필수
 */
export function getBaseUrl(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const raw = process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
    return new URL(raw);
  }

  // Vercel 프로덕션 도메인 환경 변수
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  // Vercel 프리뷰 배포 도메인 환경 변수
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }

  // 로컬 개발 환경
  return new URL('http://localhost:3000');
}
