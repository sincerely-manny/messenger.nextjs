'use client';

import { nanoid } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import ChatListItem from 'components/ChatListItem';
import ChatMessage from 'components/ChatMessage';
import ConnectionStatus from 'components/ConnectionStatus';
import HeaderSearchForm from 'components/HeaderSearchForm';
import { addNotification } from 'components/PopUpNotifications';
import Preloader from 'components/Preloader';
import Spinner from 'components/Spinner';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import { Message } from 'lib/api/message';
import { throttle } from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    createRef, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState,
} from 'react';
import { FiSend, FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { connectedState, setConnectedState } from '../../components/ConnectionStatus/connectedState.slice';
import { appendMessage, prependMessages, updateOrAppendMessage } from './messages.slice';
import './page.scss';

const Messenger = () => {
    const session = useSession({ required: true });
    const messages = useSelector((state: RootState) => state.messages);
    const dispatch = useDispatch();

    const sse = useMemo(() => { // setting connection to SSE endpoint
        dispatch(setConnectedState(connectedState.CONNECTING));
        if (typeof EventSource === 'undefined') { // Next tries to render this serverside and fails on build
            return {
                close: ():undefined => undefined,
            };
        }
        const es = new EventSource('/api/messenger/incoming', { withCredentials: true });
        es.onopen = () => {
            dispatch(setConnectedState(connectedState.OPEN));
        };
        es.onerror = () => {
            dispatch(setConnectedState(connectedState.CONNECTING));
        };
        es.addEventListener('MESSAGE', (r) => {
            const msg = JSON.parse(r.data as string) as Message;
            dispatch(updateOrAppendMessage({
                message: msg,
                chatId: 0,
            }));
        });
        return es;
    }, [dispatch]);

    // purely for closing connection on unmounting
    useEffect(() => () => {
        dispatch(setConnectedState(connectedState.CLOSED));
        sse.close();
    }, [dispatch, sse]);

    const [form, setForm] = useState({
        message: '',
        disabled: false,
    });

    const textarea = createRef<HTMLTextAreaElement>();

    const sendMessage = () => {
        const clientsideMessageId = nanoid();
        dispatch(appendMessage({ // optimisticly sending message
            id: clientsideMessageId,
            text: form.message,
            senderId: session.data?.user.id || '0',
        }));
        setForm({
            message: '',
            disabled: false,
        });
        axios.post('/api/messenger/outgoing', {
            id: clientsideMessageId,
            text: form.message,
            senderId: session.data?.user || '0',
        } as Message)
            .then(() => {})
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

    const chatContainer = createRef<HTMLDivElement>();
    const chatContainerScrollHeight = useRef<number>();
    const chatContainerScrollTop = useRef<number>();
    const chatContainerIsLoading = useRef<boolean>();

    useEffect(() => {
        if (!chatContainer.current) {
            return () => {};
        }
        const elem = chatContainer.current;
        const loader = () => { // older messages loader
            chatContainerIsLoading.current = true;
            if (chatContainerScrollHeight.current === undefined) {
                chatContainerScrollHeight.current = elem.scrollHeight;
            }
            const newMessages:Message[] = [];
            for (let i = 0; i < 5; i++) { // loading mock
                newMessages.push({
                    id: nanoid(),
                    text: nanoid(),
                    senderId: nanoid(),
                });
            }
            dispatch(prependMessages({ messages: newMessages, chatId: 0 }));
            if (elem.scrollTop === 0) { // TODO: Refactor onload-scroll behaviour
                elem.scrollTo({
                    top: elem.scrollHeight - chatContainerScrollHeight.current,
                    behavior: 'auto',
                });
            }
            chatContainerScrollHeight.current = elem.scrollHeight;
            chatContainerIsLoading.current = false; // TODO: pay attention to preloader behaviour
        };

        const scrollToBottom = (instant = false) => {
            elem.scrollTo({
                top: elem.scrollHeight,
                behavior: instant ? 'auto' : 'smooth',
            });
        };

        const checkIfIsScrolledToEnd = () => {
            if (!elem) {
                return false;
            }
            const { scrollTop, scrollHeight, clientHeight } = elem;
            return (scrollHeight - clientHeight - scrollTop) < 50;
        };
        let wasScrolledToEnd = checkIfIsScrolledToEnd();

        const scrollCb = throttle(() => {
            wasScrolledToEnd = checkIfIsScrolledToEnd();

            if (elem.scrollTop <= 200 && !chatContainerIsLoading.current) {
                loader();
            }
        }, 500);

        elem.addEventListener('scroll', scrollCb);

        // elem.addEventListener('DOMNodeInserted', () => {
        //     if (wasScrolledToEnd === true) {
        //         scrollToBottom();
        //     }
        // }); // works w/o event  listner for now

        if (wasScrolledToEnd === true) {
            scrollToBottom();
        }

        if (chatContainerScrollTop.current === undefined) { // scroll to botton on 1st load
            scrollToBottom(true);
            chatContainerScrollTop.current = elem.scrollTop;
            chatContainerScrollHeight.current = elem.scrollHeight;
        }

        return () => {
            chatContainerIsLoading.current = false;
            elem.removeEventListener('scroll', scrollCb);
        };
    }, [chatContainer, dispatch]);

    if (session.status !== 'authenticated') { // Preload while fetching session data
        return (
            <Preloader />
        );
    }

    return (
        <main className="messenger">
            <header className="chat-list-header">
                <Link href="/settings" className="settings-icon">
                    <FiSettings strokeWidth="0.5" size="40px" />
                </Link>
                <HeaderSearchForm />
            </header>
            <header className="chat-window-header">
                <ConnectionStatus />
            </header>
            <aside className="chats-list">
                <ChatListItem unread="4" />
                <ChatListItem active />
                <ChatListItem />
            </aside>
            <section className="chat-window">
                <div className="chat-messages-container" ref={chatContainer}>
                    {chatContainerIsLoading.current && (
                        <div className={`spinner ${chatContainerIsLoading.current ? 'active' : 'hidden'}`}>
                            <Spinner size={70} />
                        </div>
                    )}
                    {messages[0].map(({
                        text, id, senderId, timestamp,
                    }) => (
                        <ChatMessage
                            fromSelf={(senderId === session.data?.user.id)}
                            key={id}
                            timestamp={timestamp}
                        >
                            {text}
                        </ChatMessage>
                    ))}
                </div>
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
