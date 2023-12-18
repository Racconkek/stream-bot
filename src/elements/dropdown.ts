import { Locator } from 'playwright';
import { BaseControl } from './base-control';

export class Dropdown extends BaseControl {
  public async clickDropdownItem(dropdownItem: Locator) {
    await this.context.click();
    await dropdownItem.click();
  }
}
