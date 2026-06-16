/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import router from './routes';
import globalErrorHandler from './errors/globalErrorhandler';
import { notFound } from './errors/notFound';
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('uploads'));

app.get('/', (req: Request, res: Response) => {
  res.send(`server is running on port ${config.PORT} 🏃‍♂️‍➡️`);
});

// use Routes
app.use('/api', router);

// global error handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
