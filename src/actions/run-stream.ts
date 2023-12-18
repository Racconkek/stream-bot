import { Stream } from '../stream';
import { streams } from '../index';

export async function runStream(
  streamStandUrl: string,
  name: string,
  date: string,
  startTime?: string,
  endTime?: string
) {
  const stream = new Stream();
  streams.set(stream.id, stream);

  await stream.startStream(streamStandUrl, name, date, startTime, endTime);

  // await page.screenshot({ path: 'home_page.png' });
  // await page.waitForTimeout(10000);
  // await browser.close();
}
