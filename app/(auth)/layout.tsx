"use client"

import type { Metadata } from "next";
import "../globals.css";
import { Inter } from 'next/font/google';
import OnboardHeader from "@/components/on-board/layout/header";

import { Provider } from 'react-redux';
import { store } from '../../store/store';

const inter = Inter({ subsets: ['latin'] });

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
    <Provider store={store}>
    <html lang="en">
      
      <body
        className={inter.className}
      >
         
        <OnboardHeader></OnboardHeader>
        <div className="max-w-5xl mx-auto p-[24px]">
          {children}
        </div>
        
      </body>
    </html>
    </Provider>
  );
}
