import { Browser, BrowserContext, chromium, Page } from 'playwright';
import { RoomPage } from '../pages/room-page';
import { adminAuth } from '../actions/auth';
import { DefaultTabToShareParams, ITabToShareParams, IStreamStartParams } from './types';
import { getGuid, Logger } from '../helpers';

const browserType = chromium;

/**
 * Класс стрима
 * @property id Уникальный идентификатор
 * @property userId Уникальный идентификатор пользователя, который запустил стрим
 * @property userName Телеграм-логин пользователя, который запустил стрим
 * @property status Статус стрима
 * @property roomUrl Ссылка на комнату, где запущен стрим
 * @property browser Инстанс браузера, в котором запущен стрим
 * @property roomPage Инстанс страницы комнаты, где запущен стрим
 */
export class Stream {
  public id: string;
  public userId: string;
  public userName: string;
  public status: 'created' | 'started' | 'stopped';
  public roomUrl?: string;
  private browser?: Browser;
  private roomPage?: RoomPage;

  /**
   * Конструктор стрима
   *
   * @param userId Уникальный идентификатор пользователя, который запустил стрим
   * @param userName Телеграм-логин пользователя, который запустил стрим
   */
  constructor(userId: string, userName: string) {
    this.id = getGuid();
    this.status = 'created';
    this.userId = userId;
    this.userName = userName;
    Logger.info(`Stream: create with params: userId=${userId}, userName=${userName}`);
  }

  /**
   * Вход в рандомную комнату
   * @param streamStandUrl Ссылка на стенд, на котором должна открыться рандомная комната
   */
  public async enterRandomRoom(streamStandUrl: string) {
    const page = await this.createBrowser();
    const homePage = await adminAuth(page, streamStandUrl);
    const roomPage = await homePage.gotoRandomRoom(streamStandUrl);
    // await roomPage.disableCamera();
    // await roomPage.disableMicrophone();
    // await roomPage.startScreenShare();
  }

  /**
   * Запуск стрима
   * @param streamStartParams Параметры запуска стрима
   * @returns Ссылка на комнату, где запущен стрим
   */
  public async startStream(streamStartParams: IStreamStartParams) {
    Logger.info(`Stream.startStream: Begin`);
    const page = await this.createBrowser(streamStartParams.tabParams);
    const homePage = await adminAuth(page, streamStartParams.streamStandUrl);
    const createEventPage = await homePage.gotoStreamEventCreation();
    const eventSettingsPage = await createEventPage.createStreamEvent(
      streamStartParams.name,
      streamStartParams.date,
      streamStartParams.durationHours,
      streamStartParams.durationMinutes
    );
    const hostsSettingsPage = await eventSettingsPage.gotoHostsSettings();
    const roomConnectPage = await hostsSettingsPage.openRoomLink();
    const roomPage = await roomConnectPage.continue();
    this.roomPage = roomPage;

    await roomPage.disableMicrophone();
    // await roomPage.disableCamera();
    const success = await roomPage.startScreenShare();
    if (!success) {
      const error = new Error('Can not start screen share');
      Logger.error(error);
      throw error;
    }

    const url = await roomPage.startStream();
    this.roomUrl = url;

    this.status = 'started';

    return url;
  }

  /**
   * Остановка стрима
   */
  public async stopStream() {
    if (this.status !== 'started') {
      return;
    }
    await this.roomPage?.stopStream();
    await this.browser?.close();
    this.status = 'stopped';
  }

  /**
   * Выход из рандомной комнаты
   */
  public async leaveRoom() {
    this.roomPage?.leaveRoom();
    this.status = 'stopped';
  }

  /**
   * Запуск браузера
   * @param tabToShareParams Параметры для вкладки, которую шарим
   * @returns Новая страница, рядом с вкладкой которую будем шарить
   */
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
    Logger.info(
      `Stream.createBrowser: create ${browserType.name()} version=${browser.version()}, autoCaptureTabParam=${autoCaptureTabParam}`
    );

    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    await context.grantPermissions(['camera', 'microphone']);
    await this.prepareTabToShare(context, tabToShareParams);

    return await context.newPage();
  }

  /**
   * Подготовка вкладки для шаринга
   * @param context Контекст запущенного браузера
   * @param tabToShareParams Параметры для вкладки, которую шарим
   */
  private async prepareTabToShare(context: BrowserContext, tabToShareParams?: ITabToShareParams) {
    const tabToShareUrl = tabToShareParams?.url ?? DefaultTabToShareParams.url;
    Logger.info(`Stream.prepareTabToShare: Begin tabToShareUrl=${tabToShareUrl}`);

    try {
      const pageToShare = await context.newPage();
      await pageToShare.goto(tabToShareUrl);
      await pageToShare.waitForLoadState('load');
      await pageToShare.keyboard.press('Space');
    } catch (e) {
      Logger.error(e as Error);
      throw new Error('Can not prepare tab to share');
    }
    Logger.info(`Stream.prepareTabToShare: success share`);
  }

  /**
   * Закрытие браузера
   */
  public async closeBrowser() {
    await this.browser?.close();
  }
}
