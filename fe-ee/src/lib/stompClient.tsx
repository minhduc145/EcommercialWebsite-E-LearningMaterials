import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

export default function WebSocketMessage() {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws'); // Thay bằng endpoint backend bạn
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Connected to WebSocket');

        client.subscribe('/topic/test', (message: IMessage) => {
          console.log('📩 Message received:', message.body);
          alert(`Nhận được tin nhắn: ${message.body}`);
        });
      },
      onStompError: (frame) => {
        console.error('❌ Broker error:', frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  return (
      <p>Kết nối WebSocket thành công? Gửi tin từ server để test!</p>
  );
}
