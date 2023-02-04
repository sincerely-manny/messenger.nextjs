'use client';

import ChatsList from 'components/ChatsList';
import ChatsListHeader from 'components/ChatsListHeader';
import ChatWindow from 'components/ChatWindow';
import ChatWindowHeader from 'components/ChatWindowHeader';
import { connectedState, setConnectedState } from 'components/ConnectionStatus/connectedState.slice';
import Preloader from 'components/Preloader';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import { Message } from 'lib/api/message';
import { PUSHER_AUTH_ENDPOINT, PUSHER_PRESENCE_CHANNEL_NAME, PUSHER_PRIVATE_CHANNEL_PREFIX } from 'lib/api/pusher';
import { useSession } from 'next-auth/react';
import Pusher, { PresenceChannel } from 'pusher-js';
// import Pusher from 'pusher-js/with-encryption';
// TODO: add encrypted- when fixed https://github.com/pusher/pusher-js/issues/624
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useGetPusherAppKeyQuery } from 'service';
import { updateOrAppendMessage } from './messages.slice';
import './page.scss';

const Messenger = () => {
    const session = useSession({ required: true });
    const dispatch = useDispatch();

    // const sse = useMemo(() => { // setting connection to SSE endpoint
    //     dispatch(setConnectedState(connectedState.CONNECTING));
    //     if (typeof EventSource === 'undefined') {
    // Next tries to render this serverside and fails on build
    //         return {
    //             close: ():undefined => undefined,
    //         };
    //     }
    //     const es = new EventSource('/api/messenger/incoming', { withCredentials: true });
    //     es.onopen = () => {
    //         dispatch(setConnectedState(connectedState.OPEN));
    //     };
    //     es.onerror = () => {
    //         dispatch(setConnectedState(connectedState.CONNECTING));
    //     };
    //     es.addEventListener('MESSAGE', (r) => {
    //         const msg = JSON.parse(r.data as string) as Message;
    //         dispatch(updateOrAppendMessage({
    //             message: msg,
    //             chatId: 0,
    //         }));
    //     });
    //     return es;
    // }, [dispatch]);

    // // purely for closing connection on unmounting
    // useEffect(() => () => {
    //     dispatch(setConnectedState(connectedState.CLOSED));
    //     sse.close();
    // }, [dispatch, sse]);

    const pusherAppKeyQuery = useGetPusherAppKeyQuery(null);

    useMemo(() => {
        dispatch(setConnectedState(connectedState.CONNECTING));
    }, [dispatch]);

    useMemo(() => {
        const appKey = pusherAppKeyQuery.data?.appKey;
        if (!appKey || !session.data?.user.id) {
            return false;
        }
        const p = new Pusher(appKey, {
            cluster: 'eu',
            authEndpoint: PUSHER_AUTH_ENDPOINT,
            channelAuthorization: {
                transport: 'ajax',
                endpoint: PUSHER_AUTH_ENDPOINT,
            },
        });
        const privateChannel = p.subscribe(`${PUSHER_PRIVATE_CHANNEL_PREFIX}${session.data?.user.id}`);
        privateChannel.bind('pusher:subscription_succeeded', () => {
            dispatch(setConnectedState(connectedState.OPEN));
        });
        privateChannel.bind('pusher:subscription_error', () => {
            dispatch(setConnectedState(connectedState.CLOSED));
        });
        privateChannel.bind('message', (data: Message) => {
            dispatch(updateOrAppendMessage({
                message: data,
                chatId: 0,
            }));
        });

        const presenceChannel = p.subscribe(PUSHER_PRESENCE_CHANNEL_NAME) as PresenceChannel;
        // presenceChannel.bind('pusher:subscription_error', (data) => {
        //     console.log('pusher:subscription_error', data);
        // });
        presenceChannel.bind('pusher:subscription_succeeded', () => {
            presenceChannel.members.each((member: { id: string, info: unknown }) => {
                console.log(member);
            });
        });

        p.user.watchlist.bind('online', (event: { user_ids: string[], name: string }) => {
            console.log(event);
        });
        p.user.watchlist.bind('offline', (event: { user_ids: string[], name: string }) => {
            console.log(event);
        });

        return p;
    }, [dispatch, pusherAppKeyQuery.data?.appKey, session.data?.user.id]);

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
