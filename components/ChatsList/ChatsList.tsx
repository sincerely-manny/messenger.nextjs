'use client';

import ChatListItem, { ChatListItemProps } from 'components/ChatListItem';
import Spinner from 'components/Spinner';
import { trpc } from 'components/withTrpcProvider';
import './ChatsList.scss';

const ChatsList = () => {
    // const { data: chats, error, isLoading } = useGetChatsListQuery(null);
    const { data: chats, error, isLoading } = trpc.chat.list.useQuery();
    if (error) {
        return (
            <div>Error fetching chats list</div>
            // TODO: Custom error message (icon??)
        );
    }

    if (isLoading) {
        return (
            <center>
                <Spinner size={80} />
            </center>
        );
    }

    return (
        <aside className="chats-list">
            {chats?.map((chat) => {
                const c: ChatListItemProps['chatData'] = {
                    id: chat.id,
                    image: chat.image,
                    title: chat.title,
                    preview: 'preview',
                    lastMessageAt: new Date().toString(),
                    users: chat.users,
                };
                return (
                    <ChatListItem chatData={c} key={c.id} />
                );
            })}
        </aside>
    );
};

export default ChatsList;
