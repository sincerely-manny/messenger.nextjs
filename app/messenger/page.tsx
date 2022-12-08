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
import {
    FormEvent, KeyboardEvent, useEffect, useMemo, useState,
} from 'react';
import { FiSend, FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { connectedState, setConnectedState } from './connectedState.slice';
import { catchMessage } from './messages.slice';
import './page.scss';

const Messenger = () => {
    const session = useSession({ required: true });
    const messages = useSelector((state: RootState) => state.messages);
    const dispatch = useDispatch();
    const sse = useMemo(() => { // setting connection to SSE endpoint
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

    const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

    const handleResize = (e: FormEvent<HTMLTextAreaElement>) => {
        const area = e.currentTarget;
        area.rows = 1;
        while ((area.scrollHeight > area.clientHeight) && area.rows < 5) {
            area.rows += 1;
        }
    };

    const textareaKeyUpHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !submitIsDisabled) {
            e.preventDefault();
            (e.currentTarget.parentElement as HTMLFormElement).submit();
        }
    };

    const formInputHandler = (e: FormEvent<HTMLFormElement>) => {
        if ((e.currentTarget.querySelector('textarea.new-message') as HTMLTextAreaElement).value.trim().length > 0) {
            setSubmitIsDisabled(false);
        } else {
            setSubmitIsDisabled(true);
        }
    };

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
                <div className="new-message-form">
                    <form action="./" method="post" onInput={formInputHandler}>
                        <textarea rows={1} className="new-message" placeholder="New message..." onInput={handleResize} onKeyDown={textareaKeyUpHandler} />
                        <button type="submit" className="new-message-send" title="⌘/ctrl + enter" disabled={submitIsDisabled}>
                            <FiSend size="2em" strokeWidth="1px" />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default withStoreProvider(withSessionProvider(Messenger));
