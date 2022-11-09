import Image from 'next/image';
import Link from 'next/link';
import './page.scss';
import { FiSettings, FiSearch } from 'react-icons/fi';

type ChatListItemProps = {
    active?: boolean,
};

function ChatListItem(props: ChatListItemProps) {
    const { active } = props;
    return (
        <div className={`chat-list-item ${active ? 'chat-list-item-active' : ''}`}>
            <div className="chat-list-image-container">
                <Image
                    src="/avatars/av16.jpg"
                    width={92}
                    height={92}
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
                <div className="unread-counter">1</div>
                <time>
                    22:34
                </time>
            </div>
        </div>
    );
}

ChatListItem.defaultProps = {
    active: false,
};

export default function Home() {
    return (
        <>
            <header className="chat-header">
                <Link href="/settings" className="settings-icon">
                    <FiSettings strokeWidth="0.5" size="40px" />
                </Link>
                <div className="search-form">
                    <form action="/search" method="get">
                        <input type="text" name="query" id="chat-search" placeholder="Search..." />
                        <button type="submit" className="searchButton">
                            <FiSearch size="15px" />
                        </button>
                    </form>
                </div>
            </header>
            <aside className="chats-list">
                <ChatListItem />
                <ChatListItem active />
                <ChatListItem />
            </aside>

        </>
    );
}
