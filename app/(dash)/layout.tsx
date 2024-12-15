"use client"

import Header from "@/components/app/layout/header";

//import type { Metadata } from "next";
 
/*export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};*/
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { startChat } from "@/providers/logged-in/chat.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { LoaderCircle, MessagesSquare } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const [startingChat, setStartingChat] = useState(false);
  const [alerts, setAlerts] = useState<number | null>(null);
  const router = useRouter();

  const startChatClicked = () => {
    setStartingChat(true);
 
    startChat().then(async res => {
      setStartingChat(false);
    
      if (res.operation == "error") {
        alert(errorMessage(res.message))
      }
      else 
      {
        router.push('/chat/' + res.chat.chat_uuid);
      }
    });
  };
 
  return (
    <div className="bg-[#f7f8fa] min-h-screen xs:pb-20 sm:pb-0">

      <Header></Header>
{/** className="max-w-5xl mx-auto p-[24px]" */}
      <div suppressHydrationWarning={true}>
        {children}
      </div>
      
      <div className="fixed bottom-4 right-4" id="btn-chat">
        <Button className="btn-fab rounded-full p-4 w-10 h-10" onClick={startChatClicked}>
          {!startingChat ? (
            <MessagesSquare className="w-6" />
          ) : (
            <LoaderCircle className="w-6 animate-spin" />
          )}
        </Button>
        {alerts && <Badge color="warning">{alerts}</Badge>}
      </div>
    </div>
  );
}
