import {Page} from "playwright";


export class PassportLoginPage {
  readonly loginInput = this.page.locator('[data-tid="i-login"]');
  readonly passwordInput = this.page.locator('[data-tid="i-password"]');

  constructor(private readonly page: Page) {}

  async goto(streamStandUrl: string) {
    await this.page.goto(streamStandUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async authorize(login: string, password: string) {
    await this.loginInput.fill(login);
    await this.passwordInput.click();
    await this.passwordInput.pressSequentially(password);
    await this.page.keyboard.press('Enter');
  }
}
