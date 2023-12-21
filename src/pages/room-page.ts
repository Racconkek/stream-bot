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
    try {
      const isEnabled = await this.microphoneButton.getAttribute('ng-reflect-theme');
      if (isEnabled !== 'negative') {
        await this.microphoneButton.focus();
        await this.microphoneButton.click();
      }
    } catch (e) {
      console.info(`Can't disable microphone`, e);
    }
  }

  async disableCamera() {
    const isEnabled = await this.cameraButton.getAttribute('ng-reflect-theme');
    if (isEnabled !== 'negative') {
      await this.cameraButton.click();
    }
  }

  async startScreenShare(): Promise<boolean> {
    const label = await this.screenShareButton.locator('button').getAttribute('aria-label');
    if (label === 'Показать экран' || label === 'Start screen sharing') {
      await this.screenShareButton.click();
    }

    const isSharing = await this.page
      .locator('conference-toolbar-button[id="share-screen-btn"]')
      .locator('n-action-button')
      .locator('button')
      .getAttribute('aria-label');
    // @ts-ignore
    return !isSharing || isSharing !== 'Stop screen sharing' || isSharing !== 'Отключить показ экрана';
  }
  async leaveRoom() {
    await this.leaveButton.click();
  }

  async startStream() {
    try {
      const label = await this.streamButton.getAttribute('aria-label');
      if (label === 'Начать трансляцию' || label === 'Start live stream') {
        await this.streamButton.click();
      } else {
        throw new Error('Stream already started');
      }

      return this.page.url();
    } catch (e) {
      throw new Error(`Can't start stream: ${(e as Error).message}`);
    }
  }

  async stopStream() {
    const label = await this.streamButton.getAttribute('aria-label');
    if (label === 'Остановить трансляцию' || label === 'Stop live stream') {
      await this.streamButton.click();
    }
  }
}
