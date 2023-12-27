import { Locator } from 'playwright';
import { BaseControl } from './base-control';

/**
 * Класс для работы с элементом Dropdown
 * @extends BaseControl
 */
export class Dropdown extends BaseControl {

  /**
   * Клик по элементу в выпадающем списке
   * @param dropdownItem Локатор элемента в выпадающем списке
   */
  public async clickDropdownItem(dropdownItem: Locator) {
    await this.context.click();
    await dropdownItem.click();
  }
}
