import { useState } from 'react';
import { UsuariosAPI } from './api';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import './App.css'; // <-- IMPORTANTE: Importamos los estilos

export default function App() {
  const [selected, setSelected] = useState(null);
  const [reload, setReload] = useState(false);

  const handleEdit = async (username) => {
    const data = await UsuariosAPI.get(username);
    setSelected(data);
  };

  const refresh = () => setReload(v => !v);

  return (
    <div className="app-container">
      <h2 className="header-title">Gestión de Usuarios</h2>
      <p className="header-subtitle">
        Desarrollado por: <strong>Laura Vanessa Colon</strong> e <strong>Ida Luz Cabana</strong>
      </p>

      <UserForm selected={selected} onSuccess={() => { setSelected(null); refresh(); }} />
      <UserTable onEdit={handleEdit} reload={reload} />
    </div>
  );
}