import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/common/Header";
import { getBaseUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: "마이링크 | MyLink",
  description: "나만의 링크를 편리하게 모으고 공유하는 마이링크 서비스",
  openGraph: {
    title: "마이링크 | MyLink",
    description: "나만의 링크를 편리하게 모으고 공유하는 마이링크 서비스",
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 | MyLink",
    description: "나만의 링크를 편리하게 모으고 공유하는 마이링크 서비스",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
