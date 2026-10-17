import { chromium } from 'playwright';

async function main() {
  console.log('🔗 사용자의 실제 Chrome 창에 연결 중...');

  let browser;
  for (let i = 0; i < 10; i++) {
    try {
      browser = await chromium.connectOverCDP('http://localhost:9222');
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!browser) {
    console.error('Chrome 원격 디버깅 포트에 연결하지 못했습니다.');
    return;
  }

  const contexts = browser.contexts();
  const context = contexts[0] || (await browser.newContext());
  const pages = context.pages();
  const page = pages.find((p) => p.url().includes('localhost:3000')) || pages[0] || (await context.newPage());

  console.log('✅ Chrome 창 연결 성공! 이제 자동으로 조작을 시작합니다.');
  await page.waitForTimeout(2000);

  // 1. 페이지 새로고침하여 초기 상태 확인
  console.log('1. 페이지 접속 확인...');
  if (!page.url().includes('localhost:3000')) {
    await page.goto('http://localhost:3000');
  }
  await page.waitForTimeout(2000);

  // 2. 스크롤하여 링크 추가 버튼으로 이동
  console.log('2. "+ 새 링크 추가하기" 버튼 찾는 중...');
  const addButton = page.getByRole('button', { name: /\+ 새 링크 추가하기/i }).first();
  await addButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  // 3. 버튼 클릭하여 다이얼로그 모달 오픈
  console.log('3. "+ 새 링크 추가하기" 버튼 클릭! (팝업 오픈)');
  await addButton.click();
  await page.waitForTimeout(2000);

  // 4. URL 입력 (스마트 감지 확인)
  console.log('4. 유튜브 URL을 한 글자씩 타이핑합니다...');
  const urlInput = page.locator('input[placeholder*="https://github.com"]');
  await urlInput.click();
  await urlInput.pressSequentially('https://youtube.com/@codewithminjun', { delay: 120 });
  await page.waitForTimeout(2000);

  // 5. 제목 입력
  console.log('5. 링크 제목을 타이핑합니다...');
  const titleInput = page.locator('input[placeholder*="내 GitHub 레포지토리"]');
  await titleInput.click();
  await titleInput.fill('');
  await titleInput.pressSequentially('실시간 코딩 유튜브 채널 🚀', { delay: 100 });
  await page.waitForTimeout(1500);

  // 6. 보조 설명 입력
  console.log('6. 보조 설명을 타이핑합니다...');
  const descInput = page.locator('input[placeholder*="오픈소스 프로젝트"]');
  await descInput.click();
  await descInput.pressSequentially('매주 새로운 풀스택 프로젝트 라이브 코딩 📺', { delay: 80 });
  await page.waitForTimeout(1500);

  // 7. New 뱃지 클릭
  console.log('7. "New" 뱃지를 클릭합니다...');
  const badgeButton = page.getByRole('button', { name: 'New', exact: true });
  await badgeButton.click();
  await page.waitForTimeout(2000);

  // 8. 링크 추가 완료 버튼 클릭
  console.log('8. "링크 추가 완료" 버튼을 클릭합니다!');
  const submitButton = page.getByRole('button', { name: /링크 추가 완료/i });
  await submitButton.click();
  await page.waitForTimeout(2000);

  // 9. 추가된 링크 카드로 스크롤하여 확인
  console.log('9. 새로 추가된 링크 카드를 확인합니다!');
  const newCard = page.getByText('실시간 코딩 유튜브 채널 🚀');
  await newCard.scrollIntoViewIfNeeded();

  console.log('🎉 모든 자동 조작 시연이 성공적으로 끝났습니다!');
  console.log('브라우저 창은 닫지 않고 그대로 두겠습니다.');
}

main();
