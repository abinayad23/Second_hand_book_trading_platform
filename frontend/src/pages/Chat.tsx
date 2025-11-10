import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../api/client';

export default function Chat({threadId, userId}: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const stompRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS((import.meta.env.VITE_API_BASE || 'http://localhost:8080') + '/ws');
    const client = new Client({
      webSocketFactory: () => socket as any,
      debug: () => {},
      onConnect: () => {
        client.subscribe('/topic/thread.' + threadId, (msg) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        });
        client.subscribe('/queue/notifications.' + userId, (m) => {
        });
      }
    });
    client.activate();
    stompRef.current = client;
    api.get(`/chat/threads/${threadId}/messages`).then(r => setMessages(r.data)).catch(()=>{});
    return () => client.deactivate();
  }, [threadId]);

  function send() {
    if (!stompRef.current) return;
    const payload = { threadId, senderId: userId, message: text };
    stompRef.current.publish({ destination: '/app/thread.send', body: JSON.stringify(payload) });
    setText('');
  }

  return (
    <div className="p-4 border">
      <div className="h-72 overflow-auto mb-2">
        {messages.map((m,i)=> <div key={i} className="mb-1"><b>{m.senderId}</b>: {m.message}</div>)}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2" />
        <button onClick={send} className="bg-blue-600 text-white px-3">Send</button>
      </div>
    </div>
  );
}