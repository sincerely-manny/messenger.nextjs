'use client';

import ConnectionStatus from 'components/ConnectionStatus';
import './ChatWindowHeader.scss';

const ChatWindowHeader = () => (
    <header className="chat-window-header">
        <ConnectionStatus />
    </header>
);

export default ChatWindowHeader;
