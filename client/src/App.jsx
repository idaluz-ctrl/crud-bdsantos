import { useState } from 'react';
import { UsuariosAPI } from './api';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [reload, setReload] = useState(false);

  const handleEdit = async (username) => {
    const data = await UsuariosAPI.get(username);
    setSelected(data);
  };

  const refresh = () => setReload(v => !v);

  return (
    <div style={{ padding: '20px', display: 'grid', gap: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b' }}>CRUD Usuarios - React + Vite + Node.js</h2>
      <UserForm selected={selected} onSuccess={() => { setSelected(null); refresh(); }} />
      <UserTable onEdit={handleEdit} reload={reload} />
    </div>
  );
}