import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={inter.className}
      >
        
          {children} 
      </body>
    </html>
  );
}
