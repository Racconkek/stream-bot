import { Page, Locator } from 'playwright-core';

export abstract class BaseControl {
  protected readonly page: Page;
  protected readonly context: Locator;

  constructor(context: Locator, selector?: string) {
    this.context = selector ? context.locator(selector) : context;
    this.page = context.page();
  }

  protected getBodyLocator = (): Locator => this.page.locator('body');

  isVisible = async (): Promise<boolean> => {
    return this.context.isVisible();
  };

  getContext = (): Locator => {
    return this.context;
  };
}
