import { User } from '@prisma/client';
import { toHhMm } from 'lib/date/timeFormat';
import acronym from 'lib/string/acronym';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import fonts from 'scss/fonts';
import stc from 'string-to-color';
import './ChatListItem.scss';

export type ChatListItemProps = {
    active?: boolean,
    unread?: string,
    chatData: {
        id: string,
        image: string | null,
        title: string | null,
        preview: string,
        lastMessageAt: number,
        users: User[],
    },
};

const ChatListItem = ({ active = false, unread = '', chatData }: ChatListItemProps) => {
    const session = useSession();

    let { title, image } = chatData;

    if (title === null) {
        if (chatData.users.length === 2) {
            title = chatData.users.find((e) => e.id !== session.data?.user.id)?.name || '[unnamed]';
        } else {
            title = chatData.users.map((e) => e.name).join(', ');
        }
    }

    if (!image && chatData.users.length <= 2) {
        image = chatData.users.find((e) => e.id !== session.data?.user.id)?.image || null;
    }

    const avatar = image && false ? (
        <Image
            src={image}
            width={100}
            height={100}
            alt={title}
            quality={100}
        />
    ) : (
        <div className={`image-fallback ${fonts.lora.className}`} style={{ backgroundColor: stc(title) }}>
            <span>{acronym(title)}</span>
        </div>
    );

    return (
        <Link className={`chat-list-item ${active ? 'chat-list-item-active' : ''}`} href={`/messenger/${chatData.id}`}>
            <div className="chat-list-image-container">
                {avatar}
            </div>
            <div className="chat-list-last-message">
                <p className="chat-list-name">{title}</p>
                <p className="chat-list-message-preview">{chatData.preview}</p>
            </div>
            <div className="chat-list-info">
                <div className="unread-counter">{unread}</div>
                <time>
                    {toHhMm(chatData.lastMessageAt)}
                </time>
            </div>
        </Link>
    );
};

export default ChatListItem;
