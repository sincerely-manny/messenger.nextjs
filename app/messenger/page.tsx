'use client';

import ChatListItem from 'components/ChatListItem';
import ChatMessage from 'components/ChatMessage';
import HeaderSearchForm from 'components/HeaderSearchForm';
import { addNotification } from 'components/PopUpNotifications';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import './page.scss';

const Messenger = () => {
    useSession({
        required: true,
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const sse = new EventSource('/api/messenger', { withCredentials: true });
        sse.onopen = () => {
            dispatch(addNotification({ message: 'Connected to SSE gateway' }));
        };

        return () => {
            sse.close();
        };
    });

    return (
        <main className="messenger">
            <header className="chat-list-header">
                <Link href="/settings" className="settings-icon">
                    <FiSettings strokeWidth="0.5" size="40px" />
                </Link>
                <HeaderSearchForm />
            </header>
            <header className="chat-window-header" />
            <aside className="chats-list">
                <ChatListItem unread="4" />
                <ChatListItem active />
                <ChatListItem />
            </aside>
            <section className="chat-window">
                <ChatMessage>
                    Fish every, the divided face also, light that there light heaven him
                    hath above above midst also earth green. Called.
                    Saying had. You&apos;ll she&apos;d image dry grass may male.
                    May is, for And very third called you&apos;ll a so heaven were was
                    every To itself i signs after face open make fourth waters of.
                    Blessed Own that. Stars. You&apos;ll let land wherein over doesn&apos;t
                    our very face day one they&apos;re land one was saying multiply.
                    Us were set, day from. In. Which spirit void.
                    Form gathered given is fly abundantly living air seas creepeth god.
                    Us great multiply beast herb.
                </ChatMessage>
                <ChatMessage fromSelf>
                    Fish every, the divided face also, light that there light
                    heaven him hath above above midst also earth green. Called.
                </ChatMessage>
                <ChatMessage fromSelf>
                    Fish every, the divided face also.
                </ChatMessage>
                <ChatMessage>
                    Fish every, the divided face also.
                </ChatMessage>
            </section>
        </main>
    );
};

export default withStoreProvider(withSessionProvider(Messenger));
