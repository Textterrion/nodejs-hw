import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

const app = express();
const PORT = process.env.PORT || 3000;

const dummyNotes = [
  { id: '1', title: 'Перша замітка', content: 'Ознайомитися з Express.js' },
  { id: '2', title: 'Друга замітка', content: 'Налаштувати деплой на Render' },
];

app.use(pinoHttp());

app.use(cors());

app.use(express.json());

app.get('/notes', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: dummyNotes,
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  const note = dummyNotes.find((item) => item.id === noteId);

  if (!note) {
    return res.status(404).json({
      status: 'fail',
      message: `Замітку з ID ${noteId} не знайдено`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: note,
  });
});

app.get('/test-error', (req, res, next) => {
  const err = new Error('Тестова помилка сервера!');
  err.status = 500;
  next(err);
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Ресурс не знайдено (404)',
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  req.log.error(err);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Внутрішня помилка сервера',
  });
});

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});

export default app;
