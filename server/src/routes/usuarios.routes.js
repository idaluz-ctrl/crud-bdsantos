import { Router } from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Listar todos los usuarios (con JOIN para mostrar nombres de estado y tipo)
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.username,
        u.nombre,
        u.edad,
        e.nombre AS estado,
        t.nombre AS tipo,
        u.id_estado,
        u.id_tipo_usuario
      FROM usuario u
      JOIN estado e ON e.id = u.id_estado
      JOIN tipo_usuario t ON t.id = u.id_tipo_usuario
      ORDER BY u.username
    `);
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Obtener un usuario por username
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const [rows] = await pool.query(
      'SELECT username, nombre, edad, id_estado, id_tipo_usuario FROM usuario WHERE username = ?',
      [username]
    );
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Crear usuario
router.post('/', async (req, res, next) => {
  try {
    const { username, password, nombre, edad, id_estado, id_tipo_usuario } = req.body;

    if (!username || !password || !nombre || edad === undefined || edad === null ||
        edad === '' || !id_estado || !id_tipo_usuario) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO usuario (username, password, nombre, edad, id_estado, id_tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashed, nombre, edad, id_estado, id_tipo_usuario]
    );
    res.status(201).json({ message: 'Creado' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Usuario ya existe' });
    if (e.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Estado o tipo de usuario no válido' });
    next(e);
  }
});

// Actualizar usuario (solo los campos enviados)
router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { password, nombre, edad, id_estado, id_tipo_usuario } = req.body;

    const fields = [];
    const values = [];

    if (password) {
      fields.push('password = ?');
      values.push(await bcrypt.hash(password, 10));
    }
    if (nombre) {
      fields.push('nombre = ?');
      values.push(nombre);
    }
    if (edad !== undefined && edad !== null && edad !== '') {
      fields.push('edad = ?');
      values.push(edad);
    }
    if (id_estado) {
      fields.push('id_estado = ?');
      values.push(id_estado);
    }
    if (id_tipo_usuario) {
      fields.push('id_tipo_usuario = ?');
      values.push(id_tipo_usuario);
    }

    if (!fields.length) return res.status(400).json({ error: 'Nada que actualizar' });

    values.push(username);
    const [result] = await pool.query(
      `UPDATE usuario SET ${fields.join(', ')} WHERE username = ?`,
      values
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Actualizado' });
  } catch (e) {
    if (e.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Estado o tipo de usuario no válido' });
    next(e);
  }
});

// Eliminar usuario
router.delete('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const [result] = await pool.query('DELETE FROM usuario WHERE username = ?', [username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (e) {
    next(e);
  }
});

export default router;