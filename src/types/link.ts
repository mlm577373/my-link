export type ThemeKey =
  | 'modern-dark'
  | 'minimalist-light'
  | 'aurora-dream'
  | 'cyber-neon'
  | 'sunset-warm'
  | 'forest-sage';

export type ButtonShape = 'pill' | 'rounded' | 'sharp';
export type ButtonVariant = 'solid' | 'soft-glass' | 'outline';

export interface ButtonStyle {
  shape: ButtonShape;
  variant: ButtonVariant;
}

export type SocialPlatform =
  | 'github'
  | 'youtube'
  | 'instagram'
  | 'twitter'
  | 'mail'
  | 'linkedin'
  | 'blog'
  | 'discord'
  | 'globe'
  | 'coffee'
  | 'custom';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  clicks: number;
  order: number;
  subtitle?: string;
  badge?: string;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  title?: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  tags?: string[];
  theme: ThemeKey;
  buttonStyle: ButtonStyle;
  links: LinkItem[];
  socialLinks?: SocialLink[];
}

export interface ThemePreset {
  key: ThemeKey;
  name: string;
  description: string;
  bgClass: string;
  cardClass: string;
  textClass: string;
  accentColor: string;
}
