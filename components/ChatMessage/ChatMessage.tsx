import Spinner from 'components/Spinner';
import { HTMLProps } from 'react';
import './ChatMessage.scss';

type ChatMessageProps = HTMLProps<HTMLDivElement> & {
    fromSelf?: boolean,
    timestamp?: string,
};

const ChatMessage = ({ children, fromSelf = false, timestamp = undefined }: ChatMessageProps) => {
    const formattedTime = timestamp ? new Date(parseInt(timestamp, 10)).toLocaleTimeString('ru-RU', { timeStyle: 'short' }) : null;
    return (
        <div className={`message-container ${fromSelf ? 'message-self' : ''}`}>
            <div className="message-text">
                <p>
                    {children}
                </p>
            </div>
            <time>
                {formattedTime || (<Spinner size={20} />)}
            </time>
        </div>
    );
};

export default ChatMessage;
