"use client"

//import type { Metadata } from "next";
import "../globals.css";
import { Inter } from 'next/font/google';
import OnboardHeader from "@/components/on-board/layout/header";
 
/*export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OnboardHeader></OnboardHeader>
      <div className="max-w-5xl mx-auto p-[24px]">
        {children}
      </div>
    </>
  );
}
