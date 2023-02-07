'use client';

import ChatsList from 'components/ChatsList';
import ChatsListHeader from 'components/ChatsListHeader';
import ChatWindow from 'components/ChatWindow';
import ChatWindowHeader from 'components/ChatWindowHeader';
import { connectedState, setConnectedState } from 'components/ConnectionStatus/connectedState.slice';
import withSessionProvider from 'components/withSessionProvider';
import withStoreProvider from 'components/withStoreProvider';
import withTrpcProvider, { trpc } from 'components/withTrpcProvider';
import { Message } from 'lib/api/message';
import { PUSHER_AUTH_ENDPOINT, PUSHER_PRESENCE_CHANNEL_NAME, PUSHER_PRIVATE_CHANNEL_PREFIX } from 'lib/api/pusher';
import { useSession } from 'next-auth/react';
import Pusher, { PresenceChannel } from 'pusher-js';
// import Pusher from 'pusher-js/with-encryption';
// TODO: add encrypted- when fixed https://github.com/pusher/pusher-js/issues/624
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateOrAppendMessage } from './messages.slice';
import './page.scss';

const Messenger = () => {
    const session = useSession({ required: true });
    const dispatch = useDispatch();

    useMemo(() => {
        dispatch(setConnectedState(connectedState.CONNECTING));
    }, [dispatch]);

    const pusherConfig = trpc.pusherAppConfig.useQuery().data;

    const pusherSubscription = useMemo(() => {
        if (!pusherConfig?.appKey || !pusherConfig?.cluster || !session.data?.user.id) {
            return false;
        }
        const pusher = new Pusher(pusherConfig.appKey, {
            cluster: pusherConfig.cluster,
            authEndpoint: PUSHER_AUTH_ENDPOINT,
            channelAuthorization: {
                transport: 'ajax',
                endpoint: PUSHER_AUTH_ENDPOINT,
            },
        });
        const privateChannel = pusher.subscribe(`${PUSHER_PRIVATE_CHANNEL_PREFIX}${session.data?.user.id}`);
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

        const presenceChannel = pusher.subscribe(PUSHER_PRESENCE_CHANNEL_NAME) as PresenceChannel;
        // presenceChannel.bind('pusher:subscription_error', (data) => {
        //     console.log('pusher:subscription_error', data);
        // });
        // presenceChannel.bind('pusher:subscription_succeeded', () => {
        //     presenceChannel.members.each((member: { id: string, info: unknown }) => {
        //         console.log('presenceChannel member', member);
        //     });
        // });

        // pusher.user.watchlist.bind('online', (event: { user_ids: string[], name: string }) => {
        //     console.log('pusher.user.watchlist.bind online', event);
        // });
        // pusher.user.watchlist.bind('offline', (event: { user_ids: string[], name: string }) => {
        //     console.log('pusher.user.watchlist.bind offline', event);
        // });

        return { pusher, privateChannel, presenceChannel };
    }, [dispatch, pusherConfig?.appKey, pusherConfig?.cluster, session.data?.user.id]);

    useEffect(() => () => {
        dispatch(setConnectedState(connectedState.CLOSED));
        if (pusherSubscription) {
            pusherSubscription.privateChannel.disconnect();
            pusherSubscription.presenceChannel.disconnect();
        }
    }, [dispatch, pusherSubscription]);

    // const u = trpc.hello.useQuery({ greeting: '111' }).data?.text;

    // console.log('trpc test', u);

    return (
        <>
            <ChatsListHeader />
            <ChatWindowHeader />
            <ChatsList />
            <ChatWindow />
        </>
    );
};

export default withTrpcProvider(
    withStoreProvider(
        withSessionProvider(
            Messenger,
        ),
    ),
);
