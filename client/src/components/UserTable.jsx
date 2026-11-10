import { useEffect, useState } from 'react';
import { UsuariosAPI } from '../api';

export default function UserTable({ onEdit, reload }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await UsuariosAPI.list();
      setData(rows);
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [reload]);

  const remove = async (username) => {
    if (!confirm('¿Eliminar usuario?')) return;
    try {
      await UsuariosAPI.remove(username);
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Usuarios</h3>
      {loading && <p>Cargando...</p>}
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left', background: 'white' }}>
        <thead style={{ background: '#e2e8f0' }}>
          <tr>
            <th>Username</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(u => (
            <tr key={u.username}>
              <td>{u.username}</td>
              <td>{u.nombre}</td>
              <td>{u.edad}</td>
              <td>{u.estado}</td>
              <td>{u.tipo}</td>
              <td>
                <button onClick={() => onEdit(u.username)} style={{ marginRight: '5px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => remove(u.username)} style={{ color: 'red', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
          {!data.length && !loading && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Sin datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}