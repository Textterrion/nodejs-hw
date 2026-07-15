import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(pinoHttp());
app.use(cors());
app.use(express.json());

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    status: 'fail',
    code: statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});

export default app;
