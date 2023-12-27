import { Locator } from 'playwright';
import { BaseControl } from './base-control';

export class Select extends BaseControl {
  value() {
    return this.context;
  }

  public async selectItem(item: Locator) {
    await this.context.click();
    await item.click();
  }

  public async selectByText(text: string) {
    await this.context.click();
    await this.context
      .page()
      .locator('[data-tid="Select__menu"]')
      .getByText(text)
      .filter({ hasText: new RegExp(`^${text}$`) })
      .click();
  }
}
