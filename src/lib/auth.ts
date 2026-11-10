import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Google 로그인을 실행합니다.
 * 팝업이 차단된 경우(auth/popup-blocked) 자동으로 리디렉션 방식으로 전환합니다.
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    if (error instanceof FirebaseError && error.code === 'auth/popup-blocked') {
      console.warn('팝업이 차단되어 리디렉션 로그인 방식으로 전환합니다.');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

/**
 * 리디렉션 로그인 결과를 확인합니다.
 */
export async function checkRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error) {
    console.error('리디렉션 로그인 처리 오류:', error);
    return null;
  }
}

/**
 * 로그아웃을 실행합니다.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}
