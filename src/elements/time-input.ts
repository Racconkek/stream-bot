import { Locator } from 'playwright-core';
import { BaseControl } from './base-control';

export class TimeInput extends BaseControl {
  private readonly inputSelector = 'input';

  async fill(value: string): Promise<void> {
    await this.context.click();
    await this.context.press('ArrowLeft');
    await this.input.pressSequentially(value);
  }

  get input(): Locator {
    return this.context.locator(this.inputSelector).nth(0);
  }

  async blur(): Promise<void> {
    await this.input.blur();
  }
}
