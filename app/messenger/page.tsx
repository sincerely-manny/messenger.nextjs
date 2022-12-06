'use client';

import ChatListItem from 'components/ChatListItem';
import ChatMessage from 'components/ChatMessage';
import HeaderSearchForm from 'components/HeaderSearchForm';
import { addNotification } from 'components/PopUpNotifications';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import { Message } from 'lib/api/message';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { connectedState, setConnectedState } from './connectedState.slice';
import { catchMessage } from './messages.slice';
import './page.scss';

const Messenger = () => {
    const session = useSession({ required: true });
    const messages = useSelector((state: RootState) => state.messages);
    const dispatch = useDispatch();
    const sse = useMemo(() => {
        dispatch(setConnectedState(connectedState.CONNECTING));
        const es = new EventSource('/api/messenger', { withCredentials: true });
        es.onopen = () => {
            dispatch(setConnectedState(connectedState.OPEN));
            dispatch(addNotification({ message: 'Connected to SSE gateway' }));
        };
        es.onerror = () => {
            dispatch(setConnectedState(connectedState.CONNECTING));
            dispatch(addNotification({ message: 'Connection to SSE gateway lost. Reconnecting...' }));
        };
        es.addEventListener('MESSAGE', (r) => {
            dispatch(addNotification({
                message: r.data as string,
            }));
            const msg = JSON.parse(r.data as string) as {
                text: string,
                id: string,
                senderId: string,
            } as Message;
            dispatch(catchMessage(msg));
        });
        return es;
    }, [dispatch]);

    useEffect(() => () => {
        dispatch(setConnectedState(connectedState.CLOSED));
        sse.close();
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
                {messages[0].map(({ text, id, senderId }) => (
                    <ChatMessage fromSelf={(senderId === session.data?.user.id)} key={id}>
                        {text}
                    </ChatMessage>
                ))}
            </section>
        </main>
    );
};

export default withStoreProvider(withSessionProvider(Messenger));
