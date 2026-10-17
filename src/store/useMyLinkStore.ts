import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, LinkItem, ThemeKey, ButtonStyle } from '@/types';
import { DEFAULT_USER_PROFILE } from '@/data/dummy-data';

interface MyLinkState {
  profile: UserProfile;
  // 액션
  updateProfile: (data: Partial<UserProfile>) => void;
  setUserProfile: (profile: UserProfile) => void;
  addLink: (link: Omit<LinkItem, 'id' | 'clicks' | 'order'>) => void;
  updateLink: (id: string, data: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (startIndex: number, endIndex: number) => void;
  toggleLinkActive: (id: string) => void;
  incrementClick: (id: string) => void;
  setTheme: (theme: ThemeKey) => void;
  setButtonStyle: (style: ButtonStyle) => void;
  resetToDefault: () => void;
}

export const useMyLinkStore = create<MyLinkState>()(
  persist(
    (set) => ({
      profile: DEFAULT_USER_PROFILE,

      updateProfile: (data) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...data,
          },
        })),

      setUserProfile: (profile) =>
        set(() => ({
          profile,
        })),

      addLink: (link) =>
        set((state) => {
          const newOrder = state.profile.links.length + 1;
          const newLinkItem: LinkItem = {
            ...link,
            id: `link-${Date.now()}`,
            clicks: 0,
            order: newOrder,
          };
          return {
            profile: {
              ...state.profile,
              links: [...state.profile.links, newLinkItem],
            },
          };
        }),

      updateLink: (id, data) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, ...data } : link
            ),
          },
        })),

      deleteLink: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.filter((link) => link.id !== id),
          },
        })),

      reorderLinks: (startIndex, endIndex) =>
        set((state) => {
          const updated = [...state.profile.links];
          const [removed] = updated.splice(startIndex, 1);
          updated.splice(endIndex, 0, removed);
          return {
            profile: {
              ...state.profile,
              links: updated.map((item, index) => ({
                ...item,
                order: index + 1,
              })),
            },
          };
        }),

      toggleLinkActive: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, isActive: !link.isActive } : link
            ),
          },
        })),

      incrementClick: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
            ),
          },
        })),

      setTheme: (theme) =>
        set((state) => ({
          profile: {
            ...state.profile,
            theme,
          },
        })),

      setButtonStyle: (buttonStyle) =>
        set((state) => ({
          profile: {
            ...state.profile,
            buttonStyle,
          },
        })),

      resetToDefault: () =>
        set(() => ({
          profile: DEFAULT_USER_PROFILE,
        })),
    }),
    {
      name: 'mylink-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
