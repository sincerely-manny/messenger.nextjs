'use client';

import ChatListItem from 'components/ChatListItem';
import Spinner from 'components/Spinner';
import { useGetChatsListQuery } from 'service';
import './ChatsList.scss';

const ChatsList = () => {
    const { data, error, isLoading } = useGetChatsListQuery(null);

    if (error) {
        return (
            <div>Error fetching chats list</div>
        );
    }

    if (isLoading) {
        return (
            <center>
                <Spinner size={40} />
            </center>
        );
    }
    console.log(data?.payload);
    return (
        <aside className="chats-list">
            {/* {data?.payload?.map((chat) => (
                <ChatListItem chatData={chat} />
            ))} */}
        </aside>
    );
};

export default ChatsList;
