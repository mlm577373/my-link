import { chromium } from 'playwright';
import path from 'path';

async function captureSteps() {
  const outputDir = 'c:/Users/김민준/Desktop/군e러닝/바이브코딩/my-link/docs/screenshots';

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const page = await context.newPage();

  console.log('1. 홈 화면 캡처...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outputDir}/1-home.png` });

  console.log('2. 다이얼로그 오픈 캡처...');
  const addButton = page.getByRole('button', { name: /\+ 새 링크 추가하기/i }).first();
  await addButton.scrollIntoViewIfNeeded();
  await addButton.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outputDir}/2-dialog-open.png` });

  console.log('3. URL 입력 및 스마트 감지 캡처...');
  const urlInput = page.locator('input[placeholder*="https://github.com"]');
  await urlInput.fill('https://youtube.com/@codewithminjun');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outputDir}/3-url-detected.png` });

  console.log('4. 폼 입력 및 New 뱃지 선택 캡처...');
  const titleInput = page.locator('input[placeholder*="내 GitHub 레포지토리"]');
  await titleInput.fill('코딩 유튜브 채널 🚀');
  const descInput = page.locator('input[placeholder*="오픈소스 프로젝트"]');
  await descInput.fill('매주 새로운 풀스택 프로젝트 라이브 코딩 📺');
  const badgeButton = page.getByRole('button', { name: 'New', exact: true });
  await badgeButton.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outputDir}/4-form-filled.png` });

  console.log('5. 추가 완료 및 새 카드 렌더링 캡처...');
  const submitButton = page.getByRole('button', { name: /링크 추가 완료/i });
  await submitButton.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outputDir}/5-card-added.png` });

  await browser.close();
  console.log('✅ 모든 스크린샷 캡처 완료!');
}

captureSteps().catch(console.error);
