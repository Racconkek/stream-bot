import { StreamBot } from './telegram-bot';
import express from 'express';


const streamBot = new StreamBot();
const app = express();
const port = 3000;

app.listen(port, function listen() {
  console.info(`Server is listening at http://localhost:${port}`);
  streamBot.start();
});
