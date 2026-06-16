/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './config';
import app from './app';
import { seedDefaultAdmin } from './DB';
import http from 'http';

async function main() {
  try {
    await mongoose.connect(config.DB_URL as string);
    console.log('database connect success 🚀');

    const server = http.createServer(app);

    server.listen(config.PORT, () => {
      console.log(`server is running on port ${config.PORT} 🏃‍♂️‍➡️`);
    });
    seedDefaultAdmin();
  } catch (error) {
    console.log(error);
  }
}

main();
