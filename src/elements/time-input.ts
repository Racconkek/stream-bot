import { Locator } from 'playwright-core';
import { BaseControl } from './base-control';

/**
 * Класс для работы с элементом TimeInput
 * @extends BaseControl
 * @property inputSelector Локатор инпута input
 */
export class TimeInput extends BaseControl {
  private readonly inputSelector = 'input';

  /**
   * Заполнение времени в инпуте
   * @param value Время в формате "12:00"
   */
  async fill(value: string): Promise<void> {
    await this.context.click();
    await this.context.press('ArrowLeft');
    await this.input.pressSequentially(value);
  }

  /**
   * Получение локатора инпута
   */
  get input(): Locator {
    return this.context.locator(this.inputSelector).nth(0);
  }

  /**
   * Снятие фокуса с инпута
   */
  async blur(): Promise<void> {
    await this.input.blur();
  }
}
