import { Page } from 'playwright';
import { RoomConnectPage } from './room-connect-page';

export class EventHostsSettingsPage {
  readonly anonymousSpeakers = this.page.getByTestId('HostsSettings.AnonymousSpeakers').locator('n-web-toggle');
  readonly roomLink = this.page.getByTestId('HostsSettings.RoomLink').locator('a');

  constructor(private readonly page: Page) {}

  public async openRoomLink(): Promise<RoomConnectPage> {
    try {
      await this.roomLink.click();
      return new RoomConnectPage(this.page);
    } catch (e) {
      throw new Error(`Can't go to room by click on link in stream event settings`);
    }
  }
}
