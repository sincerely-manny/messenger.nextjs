import HeaderSearchForm from 'components/HeaderSearchForm';
import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import './ChatsListHeader.scss';

const ChatsListHeader = () => (
    <header className="chat-list-header">
        <Link href="/settings" className="settings-icon">
            <FiSettings strokeWidth="0.5" size="40px" />
        </Link>
        <HeaderSearchForm />
    </header>
);

export default ChatsListHeader;
