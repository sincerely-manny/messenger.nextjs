'use client';

import ChatListItem from 'components/ChatListItem';
import './ChatsList.scss';

const ChatsList = () => (
    <aside className="chats-list">
        <ChatListItem unread="4" />
        <ChatListItem active />
        <ChatListItem />
    </aside>
);

export default ChatsList;
