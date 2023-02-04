'use client';

import ChatListItem, { ChatListItemProps } from 'components/ChatListItem';
import Spinner from 'components/Spinner';
import { useGetChatsListQuery } from 'service';
import './ChatsList.scss';

const ChatsList = () => {
    const { data: chats, error, isLoading } = useGetChatsListQuery(null);

    if (error) {
        return (
            <div>Error fetching chats list</div>
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
                    lastMessageAt: Date.now(),
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
