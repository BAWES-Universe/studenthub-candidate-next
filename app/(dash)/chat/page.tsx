"use client"
// app/(dash)/chat/ChatListPage.tsx

import Pager from '@/components/common/pager';
import { Chat } from '@/models/chat';
import { page, track } from '@/providers/analytics.service';
import { alertCount$ } from '@/providers/event.service';
import { listChats } from '@/providers/logged-in/chat.service';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ChatListPage = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(false);  

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        loadChatData();
        const subscription = alertCount$.subscribe((data: any) => {
            if (data && data.total !== totalUnreadCount) {
                setTotalUnreadCount(data.total);
                loadChatData();
            }
            updateChatData(data);
        });
 
        page('Chat List Page');

        return () => {
            track('page_exit', { page: 'Chat List Page' });
            subscription.unsubscribe();
        }
    }, []);

    const loadChatData = async (page = 1) => {
        setLoading(true);
        const response = await listChats(page, {});
        setLoading(false);

        setPagination({
            current_page: parseInt(response.headers['X-Pagination-Current-Page']),
            total_pages: parseInt(response.headers['X-Pagination-Page-Count']),
        });
           
        setChats(response.data);
    };

    const updateChatData = (data: any) => {
        if (!chats) return;
        chats.forEach((chat: any) => {
            if (data[chat.chat_uuid]) {
                chat.candidateUnreadCount = data[chat.chat_uuid].candidateUnreadCount;
                chat.recentMessage = data[chat.chat_uuid].recentMessage;
            }
        });
        setChats([...chats].sort((a: any, b: any) => b.candidateUnreadCount - a.candidateUnreadCount));
    };


  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadChatData(page);
  }

    const handleRefresh = () => {
        loadPage(1);
    };

    const handleChatDetail = (conversation: Chat) => {
        router.push(`/chat/${conversation.chat_uuid}`);
    };
    
    const onLogoError = (chat: Chat) => {
        if (chat.company) {
            chat.company.company_logo = null;
            setChats([...chats]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4"> 
        <div className={`flex flex-col h-full text-start`}>
            <header className="bg-white shadow">
                <h1 className="text-xl font-bold p-4">{t("Chats")}</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col">
                    {loading && <div>Loading...</div>}
                    {chats.length === 0 && !loading && <p>{t("You have no active chats")}</p>}
                    {chats.map((chat: Chat) => (
                        <div key={chat.chat_uuid} className="bg-white shadow-md rounded-lg p-4 mb-2 cursor-pointer" onClick={() => handleChatDetail(chat)}>
                            <div className="flex items-center">
                                <div className="w-12 h-12 mr-4">
                                    <img src={chat.company?.company_logo ? process.env.NEXT_PUBLIC_CLOUDINARY_URL + chat.company.company_logo : 'assets/images/building.svg'} 
                                        alt="Logo" className="w-full h-full rounded-full" onError={() => onLogoError(chat)} />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold">{chat.contact?.contact_name || chat.staff?.staff_name}</span>
                                    <p>{chat.recentMessage?.message}</p>
                                    <span className="text-gray-500 text-sm">{chat.created_at && new Date(chat.created_at).toLocaleString()}</span>
                                    {chat.candidateUnreadCount && chat.candidateUnreadCount > 0 && (
                                        <span className="bg-red-500 text-white rounded-full px-2 text-xs">
                                            {chat.candidateUnreadCount < 9 ? chat.candidateUnreadCount : '9+'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <Pager pagination={pagination} loadPage={loadPage} />
         
                    {/* <Pager pagination={pagination} loadPage={loadChatData} /> */}

                </div>
            </div>
        </div>
        </div>
    );
};

export default ChatListPage;