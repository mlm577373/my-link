/**
 * Firestore CRUD 헬퍼 — users/{userId}/links 컬렉션 기준 개인화
 */
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  where,
  limit,
  increment,
} from 'firebase/firestore';
import { User, updateProfile } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { LinkItem, UserProfile } from '@/types';
import { DEFAULT_USER_PROFILE } from '@/data/dummy-data';

const DEFAULT_ANONYMOUS_ID = 'anonymous';

/** 현재 유효한 사용자 ID 반환 */
function resolveUserId(userId?: string): string {
  return userId || auth.currentUser?.uid || DEFAULT_ANONYMOUS_ID;
}

/** links 서브컬렉션 참조 반환: users/{userId}/links */
export function linksCol(userId?: string) {
  const targetId = resolveUserId(userId);
  return collection(db, 'users', targetId, 'links');
}

/** user 문서 참조 반환: users/{userId} */
export function userDoc(userId?: string) {
  const targetId = resolveUserId(userId);
  return doc(db, 'users', targetId);
}

/** profile 문서 참조 반환: users/{userId}/profile/info */
export function profileDoc(userId?: string) {
  const targetId = resolveUserId(userId);
  return doc(db, 'users', targetId, 'profile', 'info');
}

/** undefined 값을 가진 키를 제거 (Firestore는 undefined 비허용) */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

/** Firestore의 Timestamp 등 비직렬화 필드를 React Server Component 규격에 맞는 Plain JSON 객체로 변환 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'object') {
    const maybeTimestamp = obj as unknown as { toDate?: () => Date; seconds?: number };
    if (typeof maybeTimestamp.toDate === 'function') {
      return maybeTimestamp.toDate().toISOString() as unknown as T;
    }
    if (typeof maybeTimestamp.seconds === 'number') {
      return new Date(maybeTimestamp.seconds * 1000).toISOString() as unknown as T;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeFirestoreData(item)) as unknown as T;
    }
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      clean[key] = sanitizeFirestoreData(val);
    }
    return clean as T;
  }

  return obj;
}

/** 링크 1개를 Firestore에 추가하고 생성된 문서 ID를 포함한 LinkItem을 반환 */
export async function addLinkToFirestore(
  userIdOrLink: string | Omit<LinkItem, 'id'>,
  maybeLink?: Omit<LinkItem, 'id'>
): Promise<LinkItem> {
  let userId: string;
  let link: Omit<LinkItem, 'id'>;

  if (typeof userIdOrLink === 'string') {
    userId = userIdOrLink;
    link = maybeLink!;
  } else {
    userId = resolveUserId();
    link = userIdOrLink;
  }

  const data = stripUndefined({ ...link, createdAt: serverTimestamp() });
  const docRef = await addDoc(linksCol(userId), data);
  return { ...link, id: docRef.id };
}

/** users/{userId}/links 컬렉션의 모든 링크를 order 기준 오름차순으로 조회 */
export async function getLinksFromFirestore(userId?: string): Promise<LinkItem[]> {
  const q = query(linksCol(userId), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LinkItem));
  return sanitizeFirestoreData(items);
}

/** users/{userId}/links 실시간 구독 (onSnapshot) */
export function subscribeLinksFromFirestore(
  userId: string,
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const targetId = resolveUserId(userId);
  const q = query(linksCol(targetId), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const links = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LinkItem));
      onUpdate(links);
    },
    (err) => {
      console.error(`users/${targetId}/links 구독 오류:`, err);
      if (onError) onError(err);
    }
  );
}

/** 특정 링크 문서를 업데이트 */
export async function updateLinkInFirestore(
  userIdOrId: string,
  idOrData: string | Partial<LinkItem>,
  maybeData?: Partial<LinkItem>
): Promise<void> {
  let userId: string;
  let id: string;
  let data: Partial<LinkItem>;

  if (typeof idOrData === 'string') {
    userId = userIdOrId;
    id = idOrData;
    data = maybeData || {};
  } else {
    userId = resolveUserId();
    id = userIdOrId;
    data = idOrData;
  }

  const docRef = doc(linksCol(userId), id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const initialData = stripUndefined({
      id,
      ...data,
      createdAt: serverTimestamp(),
    });
    await setDoc(docRef, initialData);
    return;
  }

  const updatePayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      updatePayload[key] = deleteField();
    } else {
      updatePayload[key] = value;
    }
  }

  await updateDoc(docRef, updatePayload);
}

/**
 * 링크 클릭 수(clicks)를 원자적으로 1 증가 (동시성 안전)
 */
export async function incrementLinkClick(
  userId: string,
  linkId: string
): Promise<void> {
  if (!userId || !linkId) return;
  const targetId = resolveUserId(userId);
  const docRef = doc(linksCol(targetId), linkId);
  await updateDoc(docRef, {
    clicks: increment(1),
  });
}

/** 특정 링크 문서를 삭제 */
export async function deleteLinkFromFirestore(
  userIdOrId: string,
  maybeId?: string
): Promise<void> {
  let userId: string;
  let id: string;

  if (maybeId) {
    userId = userIdOrId;
    id = maybeId;
  } else {
    userId = resolveUserId();
    id = userIdOrId;
  }

  const docRef = doc(linksCol(userId), id);
  await deleteDoc(docRef);
}

/** users/{userId} 및 users/{userId}/profile 유저 프로필 조회 */
export async function getUserProfileFromFirestore(
  userId?: string
): Promise<UserProfile | null> {
  const targetId = resolveUserId(userId);

  // 1. users/{userId}/profile/info 서브컬렉션 먼저 확인
  try {
    const subDocSnap = await getDoc(profileDoc(targetId));
    if (subDocSnap.exists()) {
      return subDocSnap.data() as UserProfile;
    }
  } catch (err) {
    console.error('users/{userId}/profile 조회 오류:', err);
  }

  // 2. 기존 users/{userId} 메인 문서 호환 확인
  const docRef = userDoc(targetId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return docSnap.data() as UserProfile;
}

/** users/{userId} 및 users/{userId}/profile 유저 프로필 저장/업데이트 */
export async function saveUserProfileToFirestore(
  userId: string,
  profile: Partial<UserProfile>
): Promise<void> {
  const data = stripUndefined({
    ...profile,
    updatedAt: serverTimestamp(),
  });

  // 1. users/{userId} 메인 문서 저장 (쿼리 검색 및 기본 식별)
  await setDoc(userDoc(userId), data, { merge: true });

  // 2. users/{userId}/profile/info 서브컬렉션 동시 저장
  try {
    await setDoc(profileDoc(userId), data, { merge: true });
  } catch (err) {
    console.warn('users/{userId}/profile 저장 경고:', err);
  }
}

/**
 * 로그인 시 유저 프로필을 조회하거나 존재하지 않으면 기본 프로필 생성 및 저장
 */
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const existing = await getUserProfileFromFirestore(user.uid);
  if (existing) {
    return existing;
  }

  const defaultUsername = user.email
    ? user.email.split('@')[0]
    : `user_${user.uid.slice(0, 6)}`;

  const newProfile: UserProfile = {
    username: defaultUsername,
    displayName: user.displayName || defaultUsername,
    bio: '환영합니다! 나만의 마이링크 페이지입니다.',
    avatarUrl: user.photoURL || undefined,
    theme: DEFAULT_USER_PROFILE.theme,
    buttonStyle: DEFAULT_USER_PROFILE.buttonStyle,
    links: [],
    tags: ['Google 연동', '크리에이터'],
    socialLinks: [],
  };

  await saveUserProfileToFirestore(user.uid, newProfile);
  return newProfile;
}

/**
 * username 또는 UID로 공개 사용자 프로필 및 해당 유저의 links 목록 조회
 */
export async function findUserAndLinks(
  identifier: string
): Promise<UserProfile | null> {
  if (!identifier) return null;

  let targetUid = identifier;
  let userProfile: UserProfile | null = null;

  // 1. identifier가 UID인 경우 먼저 직접 조회
  try {
    const directSnap = await getDoc(doc(db, 'users', identifier));
    if (directSnap.exists()) {
      userProfile = directSnap.data() as UserProfile;
      targetUid = directSnap.id;
    }
  } catch (err) {
    console.error('UID 조회 중 에러:', err);
  }

  // 2. UID로 찾지 못했으면 username 필드로 쿼리
  if (!userProfile) {
    try {
      const q = query(
        collection(db, 'users'),
        where('username', '==', identifier),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        userProfile = querySnap.docs[0].data() as UserProfile;
        targetUid = querySnap.docs[0].id;
      }
    } catch (err) {
      console.error('username 쿼리 중 에러:', err);
    }
  }

  if (!userProfile) {
    return null;
  }

  // 3. 해당 사용자의 links 서브컬렉션(users/{targetUid}/links) 조회
  const links = await getLinksFromFirestore(targetUid);

  return sanitizeFirestoreData({
    ...userProfile,
    links,
  });
}

/**
 * displayName으로 사용자를 검색하고 users/{userId}/profile 및 users/{userId}/links 데이터를 반환
 */
export async function findUserByDisplayNameAndLinks(
  displayName: string
): Promise<{ profile: UserProfile; userId: string } | null> {
  if (!displayName) return null;
  const targetName = displayName.trim();

  try {
    let targetUid: string | null = null;
    let userProfile: UserProfile | null = null;

    // 1. displayName 필드로 쿼리
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', targetName),
      limit(1)
    );
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      targetUid = querySnap.docs[0].id;
      userProfile = querySnap.docs[0].data() as UserProfile;
    }

    // 2. 일치 유저가 없으면 username 또는 UID로 폴백 검색
    if (!targetUid) {
      const qUsername = query(
        collection(db, 'users'),
        where('username', '==', targetName.toLowerCase()),
        limit(1)
      );
      const usernameSnap = await getDocs(qUsername);
      if (!usernameSnap.empty) {
        targetUid = usernameSnap.docs[0].id;
        userProfile = usernameSnap.docs[0].data() as UserProfile;
      }
    }

    // 3. UID 직접 검색 폴백
    if (!targetUid) {
      const directSnap = await getDoc(doc(db, 'users', targetName));
      if (directSnap.exists()) {
        targetUid = directSnap.id;
        userProfile = directSnap.data() as UserProfile;
      }
    }

    if (!targetUid) {
      return null;
    }

    // 4. users/{targetUid}/profile 서브컬렉션에서 프로필 상세 확인 (없으면 기존 userProfile)
    try {
      const profileSubSnap = await getDoc(profileDoc(targetUid));
      if (profileSubSnap.exists()) {
        userProfile = {
          ...userProfile,
          ...(profileSubSnap.data() as UserProfile),
        };
      }
    } catch (e) {
      console.warn('profile 서브컬렉션 확인 중 에러:', e);
    }

    if (!userProfile) {
      return null;
    }

    // 5. users/{targetUid}/links 서브컬렉션에서 활성 링크 목록 조회
    const links = await getLinksFromFirestore(targetUid);

    return {
      userId: targetUid,
      profile: sanitizeFirestoreData({
        ...userProfile,
        links,
      }),
    };
  } catch (error) {
    console.error('findUserByDisplayNameAndLinks 에러:', error);
    return null;
  }
}

/**
 * displayName(닉네임/표시 이름) 중복 여부 확인
 * @param displayName 확인할 표시 이름
 * @param currentUserId 현재 로그인한 사용자의 UID (자신의 기존 닉네임은 사용 가능 처리)
 */
export async function checkDisplayNameAvailability(
  displayName: string,
  currentUserId?: string
): Promise<{ isAvailable: boolean; message: string }> {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return { isAvailable: false, message: '닉네임을 입력해주세요.' };
  }
  if (trimmed.length < 2) {
    return { isAvailable: false, message: '닉네임은 2글자 이상이어야 합니다.' };
  }
  if (trimmed.length > 20) {
    return { isAvailable: false, message: '닉네임은 20자 이하로 입력해주세요.' };
  }

  try {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', trimmed),
      limit(5)
    );
    const snap = await getDocs(q);

    const isTakenByOther = snap.docs.some((doc) => doc.id !== currentUserId);

    if (isTakenByOther) {
      return { isAvailable: false, message: '이미 사용 중인 닉네임입니다.' };
    }

    return { isAvailable: true, message: '사용 가능한 닉네임입니다.' };
  } catch (error) {
    console.error('displayName 중복 확인 오류:', error);
    return { isAvailable: false, message: '중복 확인 중 오류가 발생했습니다.' };
  }
}

/**
 * username(공개 URL 핸들) 중복 여부 확인
 * @param username 확인할 사용자 핸들
 * @param currentUserId 현재 로그인한 사용자의 UID
 */
export async function checkUsernameAvailability(
  username: string,
  currentUserId?: string
): Promise<{ isAvailable: boolean; message: string }> {
  const trimmed = username.trim().toLowerCase();

  if (!trimmed) {
    return { isAvailable: false, message: '아이디를 입력해주세요.' };
  }
  if (!/^[a-z0-9_-]{3,20}$/.test(trimmed)) {
    return {
      isAvailable: false,
      message: '아이디는 3~20자의 영문 소문자, 숫자, 밑줄(_), 하이픈(-)만 가능합니다.',
    };
  }

  try {
    const q = query(
      collection(db, 'users'),
      where('username', '==', trimmed),
      limit(5)
    );
    const snap = await getDocs(q);

    const isTakenByOther = snap.docs.some((doc) => doc.id !== currentUserId);

    if (isTakenByOther) {
      return { isAvailable: false, message: '이미 사용 중인 아이디입니다.' };
    }

    return { isAvailable: true, message: '사용 가능한 아이디입니다.' };
  } catch (error) {
    console.error('username 중복 확인 오류:', error);
    return { isAvailable: false, message: '중복 확인 중 오류가 발생했습니다.' };
  }
}

/**
 * 사용자 프로필 저장 및 Firebase Auth 동기화
 */
export async function updateUserProfileWithAuth(
  userId: string,
  updatedData: Partial<UserProfile>
): Promise<void> {
  // 1. Firestore users/{userId} 저장
  await saveUserProfileToFirestore(userId, updatedData);

  // 2. Firebase Auth 사용자 객체 동기화
  if (auth.currentUser && auth.currentUser.uid === userId) {
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    if (updatedData.displayName !== undefined) {
      authUpdatePayload.displayName = updatedData.displayName;
    }
    if (updatedData.avatarUrl !== undefined) {
      authUpdatePayload.photoURL = updatedData.avatarUrl || '';
    }

    if (Object.keys(authUpdatePayload).length > 0) {
      try {
        await updateProfile(auth.currentUser, authUpdatePayload);
      } catch (err) {
        console.warn('Firebase Auth updateProfile 경고:', err);
      }
    }
  }
}
