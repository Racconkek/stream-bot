import { HomePage } from '../pages/home-page';

export async function startScreenShare(page: HomePage, streamStandUrl: string) {
  const roomPage = await page.gotoRandomRoom(streamStandUrl);
  await roomPage.disableCamera();
  await roomPage.disableMicrophone();
  await roomPage.startScreenShare();
}
