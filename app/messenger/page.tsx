'use client';

import ChatsList from 'components/ChatsList';
import ChatsListHeader from 'components/ChatsListHeader';
import ChatWindow from 'components/ChatWindow';
import ChatWindowHeader from 'components/ChatWindowHeader';
import Preloader from 'components/Preloader';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import { Message } from 'lib/api/message';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { connectedState, setConnectedState } from '../../components/ConnectionStatus/connectedState.slice';
import { updateOrAppendMessage } from './messages.slice';
import './page.scss';

const Messenger = () => {
    const session = useSession({ required: true });
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

    if (session.status !== 'authenticated') { // Preload while fetching session data
        return (
            <Preloader />
        );
    }

    return (
        <>
            <ChatsListHeader />
            <ChatWindowHeader />
            <ChatsList />
            <ChatWindow />
        </>
    );
};

export default withStoreProvider(withSessionProvider(Messenger));
