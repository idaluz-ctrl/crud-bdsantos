import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre FROM tipo_usuario ORDER BY id');
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

export default router;