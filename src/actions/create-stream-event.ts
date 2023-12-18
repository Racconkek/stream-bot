import { HomePage } from '../pages/home-page';
import { CreateEventPage } from '../pages/create-event-page';
import { dateToString, timeToString } from '../helpers';

export async function createStreamEvent(
  page: CreateEventPage,
  name: string,
  date: string,
  startTime?: string,
  endTime?: string
) {
  await page.setDate(date);
  if (startTime) {
    await page.setFromTime(startTime);
  }
  if (endTime) {
    await page.setToTime(endTime);
  }
  await page.setName(name);

  await page.createEvent();
  return await page.gotoEventSettings();
}