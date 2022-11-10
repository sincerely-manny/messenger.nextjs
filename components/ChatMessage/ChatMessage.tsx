import { HTMLProps } from 'react';
import './ChatMessage.scss';

type ChatMessageProps = HTMLProps<HTMLDivElement> & {
    fromSelf?: boolean,
};

export default function ChatMessage(props: ChatMessageProps) {
    const { children, fromSelf } = props;
    return (
        <div className={`message-container ${fromSelf ? 'message-self' : ''}`}>
            <div className="message-text">
                <p>
                    {children}
                </p>
            </div>
            <time>
                22:34
            </time>
        </div>
    );
}

ChatMessage.defaultProps = {
    fromSelf: false,
};
