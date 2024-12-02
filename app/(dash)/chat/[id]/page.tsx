// app/(dash)/chat/ChatViewPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { alertUpdate$ } from '@/providers/event.service';
import { viewChat, getMessages, getNewMessages } from '@/providers/logged-in/chat.service';
import { Chat } from '@/models/chat';
import { ChatMessage } from '@/models/chat-message';
import { useTranslation } from 'react-i18next';
import { page, track } from '@/providers/analytics.service';

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
        loadChat();
        loadMessages();
        const subscription = alertUpdate$.subscribe(() => {
            checkNewMessages();
        });

        page('Chat Page');

        return () => {
            track('page_exit', { page: 'Chat Page' });
            subscription.unsubscribe();
        };
    }, []);

    const loadChat = async () => {
        const response = await viewChat(id);
        setChat(response);
    };

    const loadMessages = async () => {
        setLoading(true);
        const response = await getMessages(id);
        setMessages(response.reverse());
        processMessageList();
        setLoading(false);
    };

    const processMessageList = () => {
        const groupedMessages = messages.reduce((acc: any, message: any) => {
            const date = new Date(message.created_at || new Date()).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { date, messages: [] };
            }
            acc[date].messages.push(message);
            return acc;
        }, {});

        setMessageGroups(Object.values(groupedMessages));
    };

    const checkNewMessages = async () => {
        if (loading || loadingMoreMessages) return;
        const latestMessageIndex = messages.length > 0 ? messages[messages.length - 1].message_index : null;
        const newMessages = await getNewMessages(id, latestMessageIndex);
        if (newMessages.length > 0) {
            setMessages([...messages, ...newMessages]);
            processMessageList();
            setHaveUnreadMessage(true);
        }
    };

    const sendMessage = async () => {
        if (!txtMessage) return;
        setSendingMessage(true);
        await postMessage(id, txtMessage);
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
        <div className="flex flex-col h-full">
            
            <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="text-center"><span className="skeleton-text">Loading messages...</span></div>
                ) : (
                    messageGroups.map((group: any) => (
                        <div key={group.date}>
                            <div className="date text-center my-2">{group.date}</div>
                            {group.messages.map((message: any) => (
                                <div key={message.message_index} className={`message ${message.from === 'candidate' ? 'sent' : 'received'}`}>
                                    <div className="author">
                                        {message.from === 'candidate' ? 'You' : message.from === 'contact' ? 
                                        chat?.contact?.contact_name : chat?.staff?.staff_name}
                                    </div>
                                    <div className="chat-content">
                                        <p className="message-text">{message.message}</p>
                                        <span className="message-created_at">{new Date(message.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
                {haveUnreadMessage && (
                    <button className="alert-new-message" onClick={() => { setHaveUnreadMessage(false); scrollToBottom(); }}>
                        New message
                    </button>
                )}
            </div>

            <footer className="bg-white p-4">
                <div className="flex">
                    <input
                        type="text"
                        value={txtMessage}
                        onChange={(e) => setTxtMessage(e.target.value)}
                        placeholder={t('Type message here')}
                        className="txt-message"
                    />
                    <button className="btn-send" onClick={sendMessage} disabled={sendingMessage}>
                        {sendingMessage ? <span>Sending...</span> : <span>Send</span>}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatViewPage;