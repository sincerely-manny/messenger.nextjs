import Link from 'next/link';
import Image from 'next/image';
import './ChatListItem.scss';

type ChatListItemProps = {
    active?: boolean,
    unread?: string,
    chatData: {
        image: string,
        title: string,
        preview: string,
        lastMessageAt: number,
    },
};

const ChatListItem = ({ active = false, unread = '', chatData }: ChatListItemProps) => (
    <Link className={`chat-list-item ${active ? 'chat-list-item-active' : ''}`} href="/messenger/25">
        <div className="chat-list-image-container">
            <Image
                src={chatData.image}
                width={100}
                height={100}
                alt={chatData.title}
                quality={100}
            />
        </div>
        <div className="chat-list-last-message">
            <p className="chat-list-name">{chatData.title}</p>
            <p className="chat-list-message-preview">{chatData.preview}</p>
        </div>
        <div className="chat-list-info">
            <div className="unread-counter">{unread}</div>
            <time>
                {chatData.lastMessageAt}
            </time>
        </div>
    </Link>
);

export default ChatListItem;
