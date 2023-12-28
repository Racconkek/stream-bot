import { Page } from 'playwright';
import { Logger } from '../helpers';

export class PassportLoginPage {
  readonly loginInput = this.page.locator('[data-tid="i-login"]');
  readonly passwordInput = this.page.locator('[data-tid="i-password"]');

  constructor(private readonly page: Page) {}

  async goto(streamStandUrl: string) {
    await this.page.goto(streamStandUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async authorize(login: string, password: string) {
    try {
      await this.loginInput.pressSequentially(login);
      await this.passwordInput.click();
      await this.passwordInput.pressSequentially(password);
      await this.page.keyboard.press('Enter');
    } catch (e) {
      Logger.error(e as Error);
      throw new Error('Cannot login on PassportLoginPage - fill creds')
    }
  }
}
