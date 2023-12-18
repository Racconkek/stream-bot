import { Locator } from 'playwright-core';
import { BaseControl } from './base-control';

export class DatePicker extends BaseControl {
  private readonly inputSelector = '[data-tid="InputLikeText__nativeInput"]';
  private readonly borderSelector = '[inputmode="numeric"]';

  async fill(value: string): Promise<void> {
    await this.context.click();
    await this.input.pressSequentially(value);
  }

  async blur(): Promise<void> {
    await this.getBodyLocator().click();
  }

  get input(): Locator {
    return this.context.locator(this.inputSelector);
  }

  get inputWrapper(): Locator {
    return this.context.locator(this.borderSelector);
  }
}
