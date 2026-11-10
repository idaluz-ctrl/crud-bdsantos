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
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h3>{selected ? 'Editar usuario' : 'Crear usuario'}</h3>
      
      <div className="form-group">
        <label>Username</label>
        <input disabled={!!selected} {...register('username')} placeholder="Ej: laura123" />
        <p className="error-msg">{errors.username?.message}</p>
      </div>

      <div className="form-group">
        <label>Password {selected && <small>(dejar vacío para no cambiar)</small>}</label>
        <input type="password" {...register('password')} placeholder="Mínimo 6 caracteres" />
        <p className="error-msg">{errors.password?.message}</p>
      </div>

      <div className="form-group">
        <label>Nombre Completo</label>
        <input {...register('nombre')} placeholder="Ej: Laura Colon" />
        <p className="error-msg">{errors.nombre?.message}</p>
      </div>

      <div className="form-group">
        <label>Edad</label>
        <input type="number" {...register('edad')} placeholder="Ej: 20" />
        <p className="error-msg">{errors.edad?.message}</p>
      </div>

      <div className="form-group">
        <label>Estado</label>
        <select {...register('id_estado')}>
          {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Tipo de usuario</label>
        <select {...register('id_tipo_usuario')}>
          {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>

      <div className="btn-group">
        <button type="submit" className="btn-primary">
          {selected ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={() => reset()} className="btn-secondary">
          Limpiar
        </button>
      </div>
    </form>
  );
}