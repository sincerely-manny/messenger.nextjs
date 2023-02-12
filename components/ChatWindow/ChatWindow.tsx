'use client';

import { nanoid } from '@reduxjs/toolkit';
import { prependMessages } from 'app/messenger/messages.slice';
import ChatMessage from 'components/ChatMessage';
import NewMessageForm from 'components/NewMessageForm';
import Spinner from 'components/Spinner';
import { Message } from 'lib/api/message';
import { throttle } from 'lodash';
import { useSession } from 'next-auth/react';
import { createRef, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import './ChatWindow.scss';

const ChatWindow = () => {
    const session = useSession();
    const messages = useSelector((state: RootState) => state.messages);
    const dispatch = useDispatch();

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
            scrollToBottom(); // TODO: not scrolling on multi-line messages??
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
    return (
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
            <NewMessageForm />
        </section>
    );
};

export default ChatWindow;
