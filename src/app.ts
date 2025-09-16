import express from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import notFound from './app/middleware/notFound';
import router from './app/routes';

const app = express();
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(notFound);

export default app;
