import { Browser, chromium, Page } from 'playwright';
import { RoomPage } from './pages/room-page';
import { adminAuth } from './actions/auth';
import { createStreamEvent } from './actions/create-stream-event';
import { getGuid } from './actions/guid';
import path from 'path';

const browserType = chromium;

export interface StreamStartParams {
  streamStandUrl: string;
  name: string;
  date: string;
  startTime?: string;
  endTime?: string;
}

export class Stream {
  public id: string;
  public userId: string;
  public status: 'created' | 'started' | 'stopped';
  public url?: string;
  private browser?: Browser;
  private roomPage?: RoomPage;

  constructor(userId: string) {
    this.id = getGuid();
    this.status = 'created';
    this.userId = userId;
  }

  public async enterRandomRoom(streamStandUrl: string) {
    const page = await this.createBrowser();
    const homePage = await adminAuth(page, streamStandUrl);
    const roomPage = await homePage.gotoRandomRoom(streamStandUrl);
    // await roomPage.disableCamera();
    // await roomPage.disableMicrophone();
    // await roomPage.startScreenShare();
  }

  public async startStream(streamStartParams: StreamStartParams) {
    const page = await this.createBrowser();
    const homePage = await adminAuth(page, streamStartParams.streamStandUrl);
    const createEventPage = await homePage.gotoStreamEventCreation();
    const eventSettingsPage = await createStreamEvent(
      createEventPage,
      streamStartParams.name,
      streamStartParams.date,
      streamStartParams.startTime,
      streamStartParams.endTime
    );
    const hostsSettingsPage = await eventSettingsPage.gotoHostsSettings();
    const roomConnectPage = await hostsSettingsPage.openRoomLink();
    const roomPage = await roomConnectPage.continue();
    this.roomPage = roomPage;

    await roomPage.disableMicrophone();
    const url = await roomPage.startStream();
    this.url = url;

    this.status = 'started';

    return url;
  }

  public async stopStream() {
    if (this.status !== 'started') {
      return;
    }
    await this.roomPage?.stopStream();
    await this.browser?.close();
    this.status = 'stopped';
  }

  public async leaveRoom() {
    this.roomPage?.leaveRoom();
    this.status = 'stopped';
  }

  private async createBrowser(): Promise<Page> {
    const absoluteFilePath = path.resolve(__dirname, 'test.y4m');
    const browser = await browserType.launch({
      headless: false,
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        `--use-file-for-fake-video-capture=${absoluteFilePath}`,
      ],
    });
    this.browser = browser;

    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    await context.grantPermissions(['camera', 'microphone']);
    return await context.newPage();
  }

  public async closeBrowser() {
    await this.browser?.close();
  }
}
