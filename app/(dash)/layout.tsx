"use client"

import Header from "@/components/app/layout/header";

//import type { Metadata } from "next";
 
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
    <div className="bg-[#f7f8fa] min-h-screen xs:pb-20 sm:pb-0">

      <Header></Header>
      <div className="max-w-5xl mx-auto p-[24px]" suppressHydrationWarning={true}>
        {children}
      </div>
    </div>
  );
}
