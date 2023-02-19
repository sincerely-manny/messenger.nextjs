import Spinner from 'components/Spinner';
import { toHhMm } from 'lib/date/timeFormat';
import { HTMLProps } from 'react';
import './ChatMessage.scss';

type ChatMessageProps = HTMLProps<HTMLDivElement> & {
    fromSelf?: boolean,
    timestamp?: Date,
};

const ChatMessage = ({ children, fromSelf = false, timestamp = undefined }: ChatMessageProps) => {
    const formattedTime = timestamp ? toHhMm(timestamp) : null;
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
