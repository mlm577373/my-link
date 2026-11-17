import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'MyLink - 나만의 올인원 프로필 링크';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          backgroundColor: '#020617', // slate-950
          backgroundImage:
            'radial-gradient(circle at 15% 25%, rgba(99, 102, 241, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(236, 72, 153, 0.20) 0%, transparent 45%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 상단: 로고 및 서비스 배지 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '32px',
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

          {/* 배지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            <span>✨ ALL-IN-ONE LINK PLATFORM</span>
          </div>
        </div>

        {/* 중앙: 메인 헤드라인 & 소개 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            <span>나의 모든 활동을</span>
            <span
              style={{
                background: 'linear-gradient(to right, #f472b6, #d8b4fe, #818cf8)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              단 하나의 감각적인 링크로
            </span>
          </div>

          <p
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            소셜 미디어, 포트폴리오, 유튜브, 블로그를 모아 나만의 프로필 페이지를 1분 만에 완성하세요.
          </p>
        </div>

        {/* 하단: 기능 배지 태그 & 도메인 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
          }}
        >
          {/* 핵심 특징 3개 */}
          <div style={{ display: 'flex', gap: '14px' }}>
            {['🎨 6+ 감성 테마', '📊 실시간 통계 분석', '⚡ Google 원클릭 시작'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '7px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* 도메인 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            <span>mylink.io</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
