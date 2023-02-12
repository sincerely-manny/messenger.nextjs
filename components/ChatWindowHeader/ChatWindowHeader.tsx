'use client';

import { PropsWithChildren } from 'react';
import './ChatWindowHeader.scss';

const ChatWindowHeader = (props: PropsWithChildren) => {
    const { children } = props;
    return (
        <header className="chat-window-header">
            {children}
        </header>
    );
};

export default ChatWindowHeader;
