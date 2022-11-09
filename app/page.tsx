import Image from 'next/image';
import Link from 'next/link';
import './page.scss';
import { FiSettings, FiSearch } from 'react-icons/fi';

type ChatListItemProps = {
    active?: boolean,
    unread?: string,
};

function ChatListItem(props: ChatListItemProps) {
    const { active, unread } = props;
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
                <div className="unread-counter">{unread}</div>
                <time>
                    22:34
                </time>
            </div>
        </div>
    );
}

ChatListItem.defaultProps = {
    active: false,
    unread: '',
};

export default function Home() {
    return (
        <main className="messenger">
            <header className="chat-list-header">
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
            <header className="chat-window-header" />
            <aside className="chats-list">
                <ChatListItem unread="39" />
                <ChatListItem active />
                <ChatListItem />
            </aside>
            <section className="chat-window">
                <div className="message-container">
                    <div className="message-text">
                        <p>
                            Fish every, the divided face also, light that there light heaven him
                            hath above above midst also earth green. Called.
                            Saying had. You&apos;ll she&apos;d image dry grass may male.
                            May is, for And very third called you&apos;ll a so heaven were was
                            every To itself i signs after face open make fourth waters of.
                            Blessed Own that. Stars. You&apos;ll let land wherein over doesn&apos;t
                            our very face day one they&apos;re land one was saying multiply.
                            Us were set, day from. In. Which spirit void.
                            Form gathered given is fly abundantly living air seas creepeth god.
                            Us great multiply beast herb.
                        </p>
                    </div>
                    <time>
                        22:34
                    </time>
                </div>
                <div className="message-container message-self">
                    <div className="message-text">
                        <p>
                            Fish every, the divided face also, light that there light
                            heaven him hath above above midst also earth green. Called.
                        </p>
                    </div>
                    <time>
                        22:34
                    </time>
                </div>
            </section>
        </main>
    );
}
