'use client';

import { nanoid } from '@reduxjs/toolkit';
import ChatMessage from 'components/ChatMessage';
import NewMessageForm from 'components/NewMessageForm';
import Spinner from 'components/Spinner';
import { trpc } from 'components/withTrpcProvider';

import { throttle } from 'lodash';
import { useSession } from 'next-auth/react';
import { createRef, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import './ChatWindow.scss';

const ChatWindow = () => {
    const session = useSession();
    const messages = trpc.message.list.useQuery('clcm46x3n0000rihrdhxpmkm1');
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
        // const loader = () => { // older messages loader
        //     chatContainerIsLoading.current = true;
        //     if (chatContainerScrollHeight.current === undefined) {
        //         chatContainerScrollHeight.current = elem.scrollHeight;
        //     }
        //     const newMessages:Message[] = [];
        //     for (let i = 0; i < 5; i++) { // loading mock
        //         newMessages.push({
        //             id: nanoid(),
        //             text: nanoid(),
        //             senderId: nanoid(),
        //         });
        //     }
        //     dispatch(prependMessages({ messages: newMessages, chatId: 0 }));
        //     if (elem.scrollTop === 0) { // TODO: Refactor onload-scroll behaviour
        //         elem.scrollTo({
        //             top: elem.scrollHeight - chatContainerScrollHeight.current,
        //             behavior: 'auto',
        //         });
        //     }
        //     chatContainerScrollHeight.current = elem.scrollHeight;
        //     chatContainerIsLoading.current = false; // TODO: pay attention to preloader behaviour
        // };

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
                // loader();
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
                {(chatContainerIsLoading.current || messages.isLoading) && (
                    <div className={`spinner ${chatContainerIsLoading.current ? 'active' : 'hidden'}`}>
                        <Spinner size={70} />
                    </div>
                )}
                {messages.isSuccess && messages.data?.map(({
                    text, id, userId, sentAt,
                }) => (
                    <ChatMessage
                        fromSelf={(userId === session.data?.user.id)}
                        key={id}
                        timestamp={sentAt}
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
