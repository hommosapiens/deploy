import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useEffect, useRef} from 'react';

const webSocket = (onMessage, onDeleteMessage, endPoint) => {
    const clientRef = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log(`Connected to ${endPoint}`);
                client.subscribe(`/topic/${endPoint}`, (message) => {
                    console.log(`Received ${endPoint}: ` + message.body);
                    const data = JSON.parse(message.body);
                    onMessage(data);
                });
                client.subscribe(`/topic/${endPoint}-deleted`, (message) => {
                    console.log(`Delete ${endPoint}: ` + message.body);
                    const deletedId = message.body;
                    onDeleteMessage(deletedId);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current.deactivate();
        };
    }, []);
};

export default webSocket;