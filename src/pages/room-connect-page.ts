import { Page } from 'playwright';
import { RoomPage } from './room-page';

export class RoomConnectPage {
  readonly continueButton = this.page.locator('main-action-button');
  readonly microphoneButton = this.page
    // .locator('conference-toolbar-button[ng-reflect-icon-id="mic"]')
    .locator('n-action-button[ng-reflect-icon-id="mic"]');
  // .locator('button');
  readonly cameraButton = this.page
    // .locator('conference-toolbar-button[ng-reflect-icon-id="camera"]')
    .locator('n-action-button[ng-reflect-icon-id="camera"]');
  // .locator('button');

  constructor(private readonly page: Page) {}

  async disableAllAndContinue() {
    await this.disableMicrophone();
    await this.disableCamera();
    // await this.continue();
  }

  async continue(): Promise<RoomPage> {
    try {
      await this.continueButton.click();
      await this.page.waitForLoadState('networkidle');

      return new RoomPage(this.page);
    } catch (e) {
      throw new Error(`Can't click on continue button while connect to room`);
    }
  }

  async disableMicrophone() {
    const isEnabled = await this.microphoneButton.getAttribute('ng-reflect-theme');
    if (isEnabled !== 'negative') {
      await this.microphoneButton.focus();
      await this.microphoneButton.click();
    }
  }

  async disableCamera() {
    await this.cameraButton.click();
  }
}
