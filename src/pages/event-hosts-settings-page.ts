import { Page } from 'playwright';
import { RoomConnectPage } from './room-connect-page';
import {Logger} from "../helpers";

export class EventHostsSettingsPage {
  readonly anonymousSpeakers = this.page.getByTestId('HostsSettings.AnonymousSpeakers').locator('n-web-toggle');
  readonly roomLink = this.page.getByTestId('HostsSettings.RoomLink').locator('a');

  constructor(private readonly page: Page) {}

  public async openRoomLink(): Promise<RoomConnectPage> {
    try {
      await this.roomLink.click();
      Logger.info(`EventSettingsPage: click on room link`)
      return new RoomConnectPage(this.page);
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't go to room by click on link in stream event settings`);
    }
  }
}
