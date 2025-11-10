import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function NotificationsPanel({ userId }: any) {
  const [notes, setNotes] = useState<any[]>([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ const res = await api.get('/notifications', { params: { userId } }); setNotes(res.data); }
  async function mark(id: number){ await api.post(`/notifications/mark-read/${id}`); load(); }
  return (
    <div className="p-2">
      <h3 className="font-semibold">Notifications</h3>
      {notes.map(n => (
        <div key={n.id} className={`p-2 ${n.readFlag ? 'bg-gray-100' : 'bg-white'} border mb-2`}> 
          <div className="text-sm">{n.type}</div>
          <div className="text-xs text-gray-600">{n.payload}</div>
          <div><button className="text-blue-600 text-xs" onClick={()=>mark(n.id)}>Mark read</button></div>
        </div>
      ))}
    </div>
  );
}