import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CatalogosAPI, UsuariosAPI } from '../api';

const schema = yup.object({
  username: yup.string().required('Requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').optional(),
  nombre: yup.string().required('Requerido'),
  edad: yup.number().typeError('Debe ser número').integer('Debe ser entero').min(1, 'Mínimo 1').required('Requerido'),
  id_estado: yup.number().required('Requerido'),
  id_tipo_usuario: yup.number().required('Requerido')
});

export default function UserForm({ selected, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '', nombre: '', edad: '', id_estado: 1, id_tipo_usuario: 2 }
  });

  const [estados, setEstados] = useState([]);
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    (async () => {
      setEstados(await CatalogosAPI.estados());
      setTipos(await CatalogosAPI.tipos());
    })();
  }, []);

  useEffect(() => {
    if (selected) {
      reset({ ...selected, password: '' });
    } else {
      reset({ username: '', password: '', nombre: '', edad: '', id_estado: 1, id_tipo_usuario: 2 });
    }
  }, [selected, reset]);

  const onSubmit = async (values) => {
    try {
      if (selected) {
        const payload = { ...values, edad: Number(values.edad), id_estado: Number(values.id_estado), id_tipo_usuario: Number(values.id_tipo_usuario) };
        if (!payload.password) delete payload.password;
        await UsuariosAPI.update(selected.username, payload);
      } else {
        await UsuariosAPI.create({ ...values, edad: Number(values.edad), id_estado: Number(values.id_estado), id_tipo_usuario: Number(values.id_tipo_usuario) });
      }
      onSuccess?.();
      reset();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '8px', maxWidth: '520px', background: '#f4f6f9', padding: '20px', borderRadius: '8px' }}>
      <h3>{selected ? 'Editar usuario' : 'Crear usuario'}</h3>
      
      <label>Username
        <input disabled={!!selected} {...register('username')} style={{ width: '100%', padding: '8px' }} />
        <p style={{ color: 'crimson', margin: 0 }}>{errors.username?.message}</p>
      </label>

      <label>Password {selected && <small>(dejar vacío para no cambiar)</small>}
        <input type="password" {...register('password')} style={{ width: '100%', padding: '8px' }} />
        <p style={{ color: 'crimson', margin: 0 }}>{errors.password?.message}</p>
      </label>

      <label>Nombre
        <input {...register('nombre')} style={{ width: '100%', padding: '8px' }} />
        <p style={{ color: 'crimson', margin: 0 }}>{errors.nombre?.message}</p>
      </label>

      <label>Edad
        <input type="number" {...register('edad')} style={{ width: '100%', padding: '8px' }} />
        <p style={{ color: 'crimson', margin: 0 }}>{errors.edad?.message}</p>
      </label>

      <label>Estado
        <select {...register('id_estado')} style={{ width: '100%', padding: '8px' }}>
          {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </label>

      <label>Tipo de usuario
        <select {...register('id_tipo_usuario')} style={{ width: '100%', padding: '8px' }}>
          {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </label>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>{selected ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={() => reset()} style={{ padding: '10px', cursor: 'pointer' }}>Limpiar</button>
      </div>
    </form>
  );
}