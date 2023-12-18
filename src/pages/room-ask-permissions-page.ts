import { Page } from 'playwright';
import { RoomConnectPage } from './room-connect-page';

export class RoomAskPermissionsPage {
  readonly continueButton = this.page.locator('main-action-button');
  constructor(private readonly page: Page) {}

  async continue(): Promise<RoomConnectPage> {
    await this.continueButton.click();
    await this.page.waitForLoadState('networkidle');

    return new RoomConnectPage(this.page);
  }
}
