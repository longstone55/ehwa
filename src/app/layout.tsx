import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "세무법인이화 - 전문적인 세무 솔루션",
  description: "국세청 출신 전문가 그룹이 제안하는 최적의 세무 및 자산 설계 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-pretendard">
        <Header />
        {children}
      </body>
    </html>
  );
}
