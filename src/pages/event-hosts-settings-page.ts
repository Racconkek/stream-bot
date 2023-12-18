import { Page } from 'playwright';
import {RoomAskPermissionsPage} from "./room-ask-permissions-page";
import {RoomConnectPage} from "./room-connect-page";


export class EventHostsSettingsPage {
  readonly anonymousSpeakers = this.page.getByTestId('HostsSettings.AnonymousSpeakers').locator('n-web-toggle');
  readonly roomLink = this.page.getByTestId('HostsSettings.RoomLink').locator('a');

  constructor(private readonly page: Page) {}

  public async openRoomLink(): Promise<RoomConnectPage> {
    await this.roomLink.click();

    return new RoomConnectPage(this.page);
  }
}
