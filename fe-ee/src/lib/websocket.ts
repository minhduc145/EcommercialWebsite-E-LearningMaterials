import { useState, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUserInfo } from './user-info';

interface WebSocketConfig {
    url: string;
    userId?: string | number;
    onUserMessage?: (message: IMessage) => void;
    onBroadcastMessage?: (message: IMessage) => void;
    onConnect?: () => void;
    onError?: (error: string) => void;
}

export const useDefaultWebSocket = (config: WebSocketConfig) => {
    const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new SockJS(config.url);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                setIsConnected(true);

                if (config.userId) {
                    stompClient.subscribe(
                        `/topic/receive/${config.userId}`,
                        (message: IMessage) => {
                            console.log("📩 Message for user:", message.body);
                            config.onUserMessage?.(message);
                        }
                    );
                }

                stompClient.subscribe(
                    `/topic/receive`,
                    (message: IMessage) => {
                        console.log("📢 Broadcast message:", message.body);
                        config.onBroadcastMessage?.(message);
                    }
                );

                config.onConnect?.();
            },
            onStompError: (frame) => {
                const error = frame.headers["message"] || "Unknown STOMP error";
                console.error("❌ Broker error:", error);
                config.onError?.(error);
            },
            onDisconnect: () => {
                setIsConnected(false);
            }
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [config.url, config.userId]);

    return { client, isConnected };
};