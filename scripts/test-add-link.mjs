import { chromium } from 'playwright';

async function runTest() {
  console.log('🚀 사용자 화면에 브라우저 창을 크게 띄웁니다...');

  // 브라우저를 최대화하여 화면 맨 앞으로 띄우고 느린 속도로 시연
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1200, // 1.2초 단위로 천천히 동작하여 눈으로 확인 가능
    args: [
      '--start-maximized',
      '--window-position=100,50',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    viewport: null, // 최대화 창 크기에 맞춤
  });

  const page = await context.newPage();

  try {
    console.log('1. http://localhost:3000 페이지 접속 중...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    console.log('2. 화면 스크롤 후 "+ 새 링크 추가하기" 버튼 클릭...');
    const addButton = page.getByRole('button', { name: /\+ 새 링크 추가하기/i }).first();
    await addButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await addButton.click();
    console.log('   👉 다이얼로그 모달이 열렸습니다!');
    await page.waitForTimeout(2000);

    console.log('3. 연결 URL에 유튜브 주소 입력 (스마트 감지 확인)...');
    const urlInput = page.locator('input[placeholder*="https://github.com"]');
    await urlInput.click();
    await urlInput.pressSequentially('https://youtube.com/@codewithminjun', { delay: 100 });
    console.log('   👉 YouTube 브랜드 및 아이콘이 자동 감지되었습니다!');
    await page.waitForTimeout(2000);

    console.log('4. 링크 제목 입력...');
    const titleInput = page.locator('input[placeholder*="내 GitHub 레포지토리"]');
    await titleInput.click();
    await titleInput.fill('');
    await titleInput.pressSequentially('실시간 코딩 유튜브 채널 🚀', { delay: 100 });
    await page.waitForTimeout(1500);

    console.log('5. 보조 설명 입력...');
    const descInput = page.locator('input[placeholder*="오픈소스 프로젝트"]');
    await descInput.click();
    await descInput.pressSequentially('매주 새로운 풀스택 프로젝트 라이브 코딩 📺', { delay: 80 });
    await page.waitForTimeout(1500);

    console.log('6. "New" 강조 뱃지 클릭...');
    const badgeButton = page.getByRole('button', { name: 'New', exact: true });
    await badgeButton.click();
    console.log('   👉 New 뱃지가 선택되었습니다!');
    await page.waitForTimeout(2000);

    console.log('7. "링크 추가 완료" 버튼 클릭...');
    const submitButton = page.getByRole('button', { name: /링크 추가 완료/i });
    await submitButton.click();
    console.log('   👉 다이얼로그가 닫히고 목록에 추가되었습니다!');
    await page.waitForTimeout(2000);

    console.log('8. 새로 추가된 링크 카드로 스크롤하여 확인...');
    const newCard = page.getByText('실시간 코딩 유튜브 채널 🚀');
    await newCard.scrollIntoViewIfNeeded();
    console.log('   ✨ 링크 카드가 성공적으로 목록에 나타났습니다!');

    console.log('👀 화면을 편하게 확인하실 수 있도록 10초간 브라우저를 유지합니다...');
    await page.waitForTimeout(10000);

    console.log('✅ 모든 시연이 성공적으로 완료되었습니다!');
  } catch (error) {
    console.error('❌ 시연 중 오류 발생:', error);
  } finally {
    await browser.close();
    console.log('🏁 브라우저 창을 닫았습니다.');
  }
}

runTest();
