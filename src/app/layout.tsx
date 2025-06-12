import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/context/UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Market - Your Campus Marketplace",
  description: "Buy and sell items with your fellow students. Find everything you need for your college life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
