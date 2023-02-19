'use client';

import { Message } from '@prisma/client';
import { nanoid } from '@reduxjs/toolkit';
import { trpc } from 'components/withTrpcProvider';
import { useSession } from 'next-auth/react';
import {
    createRef, FormEvent, KeyboardEvent, useEffect, useState,
} from 'react';
import { FiSend } from 'react-icons/fi';
import './NewMessageForm.scss';

const NewMessageForm = () => {
    const session = useSession();
    const chatId = 'clcm46x3n0000rihrdhxpmkm1';
    const messageListUtils = trpc.useContext().message.list;

    const sendMessageMutation = trpc.message.send.useMutation({
        onMutate: async (newMessage) => {
            await messageListUtils.cancel();
            // const previousMessages = queryClient.getQueryData(queryKey) as Message[];
            // queryClient.setQueryData(queryKey, [...previousMessages, newMessage]);
            const previousMessages = messageListUtils.getData(chatId);
            if (Array.isArray(previousMessages)) {
                messageListUtils.setData(
                    chatId,
                    [...previousMessages, newMessage],
                );
            }
            return { previousMessages };
        },
        onError: (err, newMessage, context) => {
            messageListUtils.setData(chatId, context?.previousMessages);
        },
        onSettled: async () => {
            await messageListUtils.invalidate(chatId);
        },
    });

    const [form, setForm] = useState({
        message: '',
        disabled: true,
    });

    const textarea = createRef<HTMLTextAreaElement>();

    const sendMessage = () => {
        if (form.disabled === true) {
            return;
        }
        const clientsideMessageId = nanoid();
        // dispatch(appendMessage({ // optimisticly sending message
        //     id: clientsideMessageId,
        //     text: form.message,
        //     senderId: session.data?.user.id || '0',
        // }));
        const message: Message = {
            id: clientsideMessageId,
            text: form.message,
            sentAt: new Date(),
            userId: session.data?.user.id || '0',
            chatId,
            status: 'SENT',
        };
        setForm({
            message: '',
            disabled: true,
        });
        sendMessageMutation.mutate(message);
        // sendMessageMutation.mutate({
        //     id: clientsideMessageId,
        //     text: form.message,
        //     senderId: session.data?.user.id || '0',
        // });
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
    );
};

export default NewMessageForm;
