import Link from 'next/link';
import Image from 'next/image';
import './ChatListItem.scss';

type ChatListItemProps = {
    active?: boolean,
    unread?: string,
};

function ChatListItem(props: ChatListItemProps) {
    const { active, unread } = props;
    return (
        <Link className={`chat-list-item ${active ? 'chat-list-item-active' : ''}`} href="/messenger/25">
            <div className="chat-list-image-container">
                <Image
                    src="/avatars/av16.jpg"
                    width={100}
                    height={100}
                    alt="av16"
                    quality={100}
                    // placeholder="blur" // TODO: blurDataURL
                />
            </div>
            <div className="chat-list-last-message">
                <p className="chat-list-name">Tamanna Elliott</p>
                <p className="chat-list-message-preview">
                    Fish every, the divided face also,
                    light that there light heaven him
                    hath above above midst also earth green.
                    Called.
                </p>
            </div>
            <div className="chat-list-info">
                <div className="unread-counter">{unread}</div>
                <time>
                    22:34
                </time>
            </div>
        </Link>
    );
}

ChatListItem.defaultProps = {
    active: false,
    unread: '',
};

export default ChatListItem;
