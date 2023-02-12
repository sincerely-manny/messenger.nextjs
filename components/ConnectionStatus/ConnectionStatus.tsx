import Spinner from 'components/Spinner';
import { ReactElement } from 'react';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { connectedState } from './connectedState.slice';
import './ConnectionStatus.scss';

const ConnectionStatus = (
    {
        connectionStatus = connectedState.CLOSED,
    }: {
        connectionStatus?: typeof connectedState[keyof typeof connectedState],
    },
) => {
    // const connectionStatus = useSelector((state: RootState) => state.connectedState);
    let StatusDisplay: ReactElement;
    if (connectionStatus === connectedState.CONNECTING) {
        StatusDisplay = (
            <>
                <span className="connecting">
                    Connecting
                </span>
                <Spinner />
            </>
        );
    } else if (connectionStatus === connectedState.CLOSED) {
        StatusDisplay = (
            <span className="disconnected">
                Disconnected
                <VscDebugDisconnect />
            </span>
        );
    } else {
        StatusDisplay = (
            <span className="connected">Connected</span>
        );
    }
    return (
        <div className="connestion-status-widget">
            {StatusDisplay}
        </div>
    );
};

export default ConnectionStatus;
