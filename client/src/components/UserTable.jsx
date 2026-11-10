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
    // Retrasamos 1 milisegundo la carga para evitar retraso
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
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
    <div className="table-container">
      <h3>Usuarios Registrados</h3>
      {loading && <p>Cargando datos...</p>}
      
      <table>
        <thead>
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
                <button onClick={() => onEdit(u.username)} className="btn-edit">Editar</button>
                <button onClick={() => remove(u.username)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
          {!data.length && !loading && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}