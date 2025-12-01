import { useWebSocket } from '../../contexts/WebSocketContext';
import './ConnectionStatus.css';

function ConnectionStatus() {
  const { isConnected } = useWebSocket();

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator"></div>
      <span className="status-text">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
}

export default ConnectionStatus;
