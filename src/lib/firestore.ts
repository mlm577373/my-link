/**
 * Firestore CRUD 헬퍼 — users/anonymous/links 컬렉션 기준
 */
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LinkItem } from '@/types';

const ANONYMOUS_USER_ID = 'anonymous';

/** links 서브컬렉션 참조 반환 */
function linksCol() {
  return collection(db, 'users', ANONYMOUS_USER_ID, 'links');
}

/** undefined 값을 가진 키를 제거 (Firestore는 undefined 비허용) */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

/** 링크 1개를 Firestore에 추가하고 생성된 문서 ID를 포함한 LinkItem을 반환 */
export async function addLinkToFirestore(
  link: Omit<LinkItem, 'id'>
): Promise<LinkItem> {
  const data = stripUndefined({ ...link, createdAt: serverTimestamp() });
  const docRef = await addDoc(linksCol(), data);
  return { ...link, id: docRef.id };
}

/** users/anonymous/links 컬렉션의 모든 링크를 order 기준 오름차순으로 조회 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  const q = query(linksCol(), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LinkItem));
}

/** 특정 링크 문서를 업데이트 */
export async function updateLinkInFirestore(
  id: string,
  data: Partial<LinkItem>
): Promise<void> {
  await updateDoc(doc(linksCol(), id), data);
}

/** 특정 링크 문서를 삭제 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(linksCol(), id));
}
