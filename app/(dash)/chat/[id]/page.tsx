"use client"
// app/(dash)/chat/ChatViewPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { alertUpdate$ } from '@/providers/event.service';
import { viewChat, getMessages, getNewMessages, postChatMessage } from '@/providers/logged-in/chat.service';
import { Chat } from '@/models/chat';
import { ChatMessage } from '@/models/chat-message';
import { useTranslation } from 'react-i18next';
import { page, track } from '@/providers/analytics.service';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChatMessageComponent } from '@/components/app/chat-message';

const ChatViewPage = () => {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [txtMessage, setTxtMessage] = useState('');
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    const [haveUnreadMessage, setHaveUnreadMessage] = useState(false);
    const [messageGroups, setMessageGroups] = useState([]);
    const contentRef = useRef(null);
    const panelRef = useRef(null);
    const { t } = useTranslation();


    useEffect(() => {

        const btnChat = document.getElementById('btn-chat');
        if (btnChat) {
            btnChat.classList.add('hidden');
        }

        loadChat();
        loadMessages();
        const subscription = alertUpdate$.subscribe(() => {
            checkNewMessages();
        });

        page('Chat Page');

        return () => {
            track('page_exit', { page: 'Chat Page' });
            subscription.unsubscribe();
            if (btnChat) {
                btnChat.classList.remove('hidden');
            }
        };
    }, []);

    const loadChat = async () => {
        const response = await viewChat(id);
        setChat(response);
    };

    const loadMessages = async () => {
        setLoading(true);
        const response = await getMessages(id);
        console.log(response, response.data.reverse());

        setMessages(response.data.reverse());
        processMessageList(response.data.reverse());
        setLoading(false);
    };

    const processMessageList = (messages: ChatMessage[]) => {
        const groupedMessages = messages.reduce((acc: any, message: any) => {
            const date = format(message.created_at, 'MMMM d, yyyy');
            if (!acc[date]) {
                acc[date] = { date, messages: [] };
            }
            acc[date].messages.push(message);
            return acc;
        }, {});

        console.log(groupedMessages);

        setMessageGroups(Object.values(groupedMessages));
    };

    const checkNewMessages = async () => {
        if (loading || loadingMoreMessages) return;
        const latestMessageIndex = messages.length > 0 ? messages[messages.length - 1].message_index : null;
        const newMessages = await getNewMessages(id, latestMessageIndex);
        if (newMessages.length > 0) {
            setMessages([...messages, ...newMessages]);
            processMessageList([...messages, ...newMessages]);
            setHaveUnreadMessage(true);
        }
    };

    const sendMessage = async () => {
        if (!txtMessage) return;
        setSendingMessage(true);
        await postChatMessage(id, txtMessage);
        setTxtMessage('');
        setSendingMessage(false);
        loadMessages();
    };

    const scrollToBottom = () => {
        if (contentRef.current) {
            (contentRef.current as HTMLElement).scrollTop = (contentRef.current as HTMLElement).scrollHeight;
        }
    };

    //{chat ? chat.contact?.contact_name || chat.staff?.staff_name : 
    //<span className="skeleton-text">Loading...</span>}

    return (
        <>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                        { chat && <>
                            { chat.staff && chat.staff.staff_name }
                            { chat.contact && chat.contact.contact_name }

                            { chat.store && <>
                                <br />
                                <small>{chat.store.store_name}</small>
                            </>} 
                        </>}     
                    </h5>

                </div>    
            </div>
            
            <div className="max-w-4xl mx-auto p-6">
 
                {loading && (
                    <div className="text-center"><span className="skeleton-text">Loading messages...</span></div>
                )} 
                
                { chat && messageGroups.map((group: any) => (
                        <div key={group.date}>
                            <div className="date text-center my-2">{group.date}</div>
                            {group.messages.map((message: any) => (
                                <ChatMessageComponent message={message} chat={chat} />
                            ))}
                        </div>
                    ))
                }
                {haveUnreadMessage && (
                    <button className="alert-new-message" onClick={() => { setHaveUnreadMessage(false); scrollToBottom(); }}>
                        New message
                    </button>
                )}
            </div>

            <footer className="bg-white p-4 fixed bottom-0 w-full">
                <div className="flex max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={txtMessage}
                        onChange={(e) => setTxtMessage(e.target.value)}
                        placeholder={t('Type message here')}
                        className="txt-message"
                    />
                    <Button className="btn-send" onClick={sendMessage} disabled={sendingMessage}>
                        {sendingMessage ? <span>Sending...</span> : <span>Send</span>}
                    </Button>
                </div>
            </footer>
        </>
    );
};

export default ChatViewPage;