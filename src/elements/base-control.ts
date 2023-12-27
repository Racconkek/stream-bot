import { Page, Locator } from 'playwright-core';

/**
 * Базовый класс для элементов страницы
 * @property page Инстанс страницы, на которой расположен элемент
 * @property context Локатор элемента
 */
export abstract class BaseControl {
  protected readonly page: Page;
  protected readonly context: Locator;

  /**
   * @param context Локатор элемента
   * @param selector Селектор элемента
   */
  constructor(context: Locator, selector?: string) {
    this.context = selector ? context.locator(selector) : context;
    this.page = context.page();
  }

  /**
   * Получение ссылки на body страницы
   * @returns Локатор body страницы
   */
  protected getBodyLocator = (): Locator => this.page.locator('body');
}
