import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import usuariosRouter from './routes/usuarios.routes.js';
import estadosRouter from './routes/estados.routes.js';
import tiposRouter from './routes/tipos.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/estados', estadosRouter);
app.use('/api/tipos', tiposRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));