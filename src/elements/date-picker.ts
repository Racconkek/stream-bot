import { Locator } from 'playwright-core';
import { BaseControl } from './base-control';

/**
 * Класс для работы с элементом DatePicker
 * @extends BaseControl
 * @property input Локатор инпута [data-tid="InputLikeText__nativeInput"]
 * @property inputWrapper Локатор обертки инпута [inputmode="numeric"]
 */
export class DatePicker extends BaseControl {
  private readonly inputSelector = '[data-tid="InputLikeText__nativeInput"]';
  private readonly borderSelector = '[inputmode="numeric"]';

  /**
   * Заполнение даты в инпуте
   * @param value Дата в формате "01.07.2023"
   */
  async fill(value: string): Promise<void> {
    await this.context.click();
    await this.input.pressSequentially(value);
  }

  /**
   * Снятие фокуса с инпута
   */
  async blur(): Promise<void> {
    await this.getBodyLocator().click();
  }

  /**
   * Получение локтора инпута
   */
  get input(): Locator {
    return this.context.locator(this.inputSelector);
  }

  /**
   * Получение локатора обертки инпута
   */
  get inputWrapper(): Locator {
    return this.context.locator(this.borderSelector);
  }
}
