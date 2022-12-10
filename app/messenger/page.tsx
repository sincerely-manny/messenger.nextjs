'use client';

import axios, { AxiosError } from 'axios';
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
    createRef, FormEvent, KeyboardEvent, useEffect, useMemo, useState,
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
        const es = new EventSource('/api/messenger/incoming', { withCredentials: true });
        es.onopen = () => {
            dispatch(setConnectedState(connectedState.OPEN));
            dispatch(addNotification({ message: 'Connected to SSE gateway' }));
        };
        es.onerror = () => {
            dispatch(setConnectedState(connectedState.CONNECTING));
            dispatch(addNotification({ message: 'Connection to SSE gateway lost. Reconnecting...' }));
        };
        es.addEventListener('MESSAGE', (r) => {
            const msg = JSON.parse(r.data as string) as Message;
            dispatch(addNotification({ message: msg.text, title: msg.senderId }));
            dispatch(catchMessage(msg));
        });
        return es;
    }, [dispatch]);

    // purely for closing connection on unmounting
    useEffect(() => () => {
        dispatch(setConnectedState(connectedState.CLOSED));
        dispatch(addNotification({ message: 'Connection to SSE gateway closed' }));
        sse.close();
    }, [dispatch, sse]);

    const [form, setForm] = useState({
        message: '',
        disabled: true,
    });

    const textarea = createRef<HTMLTextAreaElement>();

    const sendMessage = () => {
        axios.post('/api/messenger/outgoing', form)
            .then(() => {
                setForm({
                    message: '',
                    disabled: true,
                });
            })
            .catch((err: AxiosError) => {
                dispatch(addNotification({
                    message: err.message,
                }));
            });
    };

    // binding ctrl+enter to send
    const textareaKeyDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !form.disabled) {
            e.preventDefault();
            sendMessage();
        }
    };

    // handling state
    const inputHadler = (e: FormEvent<HTMLTextAreaElement>) => {
        const message = e.currentTarget.value;
        let disabled = true;

        if (message.trim().length > 0) {
            disabled = false;
        }

        setForm({ ...form, message, disabled });
    };

    // setting textarea height
    useEffect(() => {
        const area = textarea.current;
        if (!area) {
            return;
        }

        area.rows = 1;
        while ((area.scrollHeight > area.clientHeight) && area.rows < 5) {
            area.rows += 1;
        }
    }, [form.message, textarea]);

    const formSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage();
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
                    <form action="./" method="post" onSubmit={formSubmitHandler}>
                        <textarea
                            rows={1}
                            className="new-message"
                            placeholder="New message..."
                            onInput={inputHadler}
                            onKeyDown={textareaKeyDownHandler}
                            value={form.message}
                            ref={textarea}
                        />
                        <button type="submit" className="new-message-send" title="⌘/ctrl + enter" disabled={form.disabled}>
                            <FiSend size="2em" strokeWidth="1px" />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default withStoreProvider(withSessionProvider(Messenger));
