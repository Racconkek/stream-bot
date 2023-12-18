import { Stream } from './stream';
import { config } from 'dotenv';
import path from 'path';
import { StreamBot } from './telegram-bot';
import express from 'express';


// async function main() {
// const streamStandUrl = 'https://localhost:44306';
// const name = 'Test stream';
// const date = '16.12.2023';
// // const startTimeHours = '22';
//
// const stream = new Stream();
// streams.set(stream.id, stream);
//
// // await stream.enterRandomRoom(streamStandUrl);
// await stream.startStream(streamStandUrl, name, date);
//
// setTimeout(async () => {
//   const savedStream = streams.get(stream.id);
//   console.log('savedStream', savedStream?.id ?? 'no stream');
//   if (savedStream) {
//     // await savedStream.leaveRoom();
//     await savedStream.stopStream();
//     console.log('stop status', savedStream?.status ?? 'no stream');
//   }
// }, 30000);

// }

// main();

const streamBot = new StreamBot();
const app = express();
const port = 3000;

app.listen(port, function listen() {
  console.info(`Server is listening at http://localhost:${port}`);
  streamBot.start();
});
