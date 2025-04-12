import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

export default function WebSocketMessage() {
  const [messageBroker, setMessageBroker] = useState('')

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Connected to WebSocket');

        client.subscribe('/topic/receive', (message: IMessage) => {
          console.log('📩 Message received:', message.body);
          setMessageBroker(message.body);
        });
      },
      onStompError: (frame) => {
        console.error('❌ Broker error:', frame.headers['message']);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return <p>{messageBroker}</p>;
}
