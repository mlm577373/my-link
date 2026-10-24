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
} from 'firebase/firestore';
import { User } from 'firebase/auth';
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

/** users/{userId} 유저 프로필 조회 */
export async function getUserProfileFromFirestore(
  userId?: string
): Promise<UserProfile | null> {
  const docRef = userDoc(userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return docSnap.data() as UserProfile;
}

/** users/{userId} 유저 프로필 저장/업데이트 */
export async function saveUserProfileToFirestore(
  userId: string,
  profile: Partial<UserProfile>
): Promise<void> {
  const docRef = userDoc(userId);
  const data = stripUndefined({
    ...profile,
    updatedAt: serverTimestamp(),
  });
  await setDoc(docRef, data, { merge: true });
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
