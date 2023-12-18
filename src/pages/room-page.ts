import { Page } from 'playwright';

export class RoomPage {
  readonly microphoneButton = this.page
    .locator('conference-device-button[id="toggle-mic-btn"]')
    .locator('n-action-button')
    .nth(0);
  readonly cameraButton = this.page
    .locator('conference-device-button[id="toggle-camera-btn"]')
    .locator('n-action-button');

  readonly streamButton = this.page
    .locator('conference-device-button[id="toggle-stream-btn"]')
    .locator('n-action-button')
    .locator('button');

  readonly screenShareButton = this.page
    .locator('conference-toolbar-button[id="share-screen-btn"]')
    .locator('n-action-button');

  readonly leaveButton = this.page
    .locator('conference-toolbar-button[id="hangup-btn"]')
    .locator('n-action-button')
    .locator('button');
  constructor(private readonly page: Page) {}

  async disableMicrophone() {
    const isEnabled = await this.microphoneButton.getAttribute('ng-reflect-theme');
    if (isEnabled !== 'negative') {
      await this.microphoneButton.focus();
      await this.microphoneButton.click();
    }
  }

  async disableCamera() {
    const isEnabled = await this.cameraButton.getAttribute('ng-reflect-theme');
    if (isEnabled !== 'negative') {
      await this.cameraButton.click();
    }
  }

  async startScreenShare() {
    const isEnabled = await this.screenShareButton.getAttribute('ng-reflect-theme');
    if (isEnabled !== 'negative') {
      await this.screenShareButton.click();
    }
  }

  async leaveRoom() {
    await this.leaveButton.click();
  }

  async startStream() {
    const label = await this.streamButton.getAttribute('aria-label');
    console.info('startStream', label);
    if (label === 'Начать трансляцию' || label === 'Start live stream') {
      await this.streamButton.click();
    }
    return this.page.url();
  }

  async stopStream() {
    const label = await this.streamButton.getAttribute('aria-label');
    if (label === 'Остановить трансляцию' || label === 'Stop live stream') {
      await this.streamButton.click();
    }
  }
}
