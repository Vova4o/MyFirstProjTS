import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', routes);

export default app;