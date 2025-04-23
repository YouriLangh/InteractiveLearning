import express from 'express';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
app.use(express.json({limit: '10mb'}));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

export default app;
