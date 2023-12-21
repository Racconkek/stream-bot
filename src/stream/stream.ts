import { Browser, BrowserContext, chromium, Page } from 'playwright';
import { RoomPage } from '../pages/room-page';
import { adminAuth } from '../actions/auth';
import { createStreamEvent } from '../actions/create-stream-event';
import { getGuid } from '../actions/guid';
import { DefaultTabToShareParams, ITabToShareParams, IStreamStartParams } from './types';

const browserType = chromium;

export class Stream {
  public id: string;
  public userId: string;
  public userName: string;
  public status: 'created' | 'started' | 'stopped';
  public url?: string;
  private browser?: Browser;
  private roomPage?: RoomPage;

  constructor(userId: string, userName: string) {
    this.id = getGuid();
    this.status = 'created';
    this.userId = userId;
    this.userName = userName;
  }

  public async enterRandomRoom(streamStandUrl: string) {
    const page = await this.createBrowser();
    const homePage = await adminAuth(page, streamStandUrl);
    const roomPage = await homePage.gotoRandomRoom(streamStandUrl);
    // await roomPage.disableCamera();
    // await roomPage.disableMicrophone();
    // await roomPage.startScreenShare();
  }

  public async startStream(streamStartParams: IStreamStartParams) {
    const page = await this.createBrowser({
      url: streamStartParams.tabToShareUrl,
      name: streamStartParams.tabToShareName,
    });
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
    // await roomPage.disableCamera();
    const success = await roomPage.startScreenShare();
    if (!success) {
      throw new Error('Can not start screen share');
    }

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

  private async createBrowser(tabToShareParams?: ITabToShareParams): Promise<Page> {
    // NOTE: таким образом можно подложить фейковый видос вместо видео с вебки, но на линухе не работает)))
    // const absoluteFilePath = path.resolve(__dirname, 'test.y4m');
    // `--use-file-for-fake-video-capture=${absoluteFilePath}`,
    // '--use-fake-ui-for-media-stream',

    //NOTE: да, формировать отдельно, иначе не работает, капризный хром
    const autoCaptureTabParam = `--auto-select-desktop-capture-source=${
      tabToShareParams?.name ?? DefaultTabToShareParams.name
    }`;

    const browser = await browserType.launch({
      headless: false,
      args: ['--use-fake-device-for-media-stream', autoCaptureTabParam],
    });
    this.browser = browser;

    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    await context.grantPermissions(['camera', 'microphone']);
    await this.prepareTabToShare(context, tabToShareParams);

    return await context.newPage();
  }

  private async prepareTabToShare(context: BrowserContext, tabToShareParams?: ITabToShareParams) {
    try {
      const pageToShare = await context.newPage();
      await pageToShare.goto(tabToShareParams?.url ?? DefaultTabToShareParams.url);
      await pageToShare.waitForLoadState('load');
      await pageToShare.keyboard.press('Space');
    } catch (e) {
      throw new Error('Can not prepare tab to share');
    }
  }

  public async closeBrowser() {
    await this.browser?.close();
  }
}
