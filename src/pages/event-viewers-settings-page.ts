import { Page } from 'playwright';


export class EventViewersSettingsPage {
  readonly auditoriumAccess = this.page.getByTestId('ViewersSettings.AnonymousViewers').locator('button');

  constructor(private readonly page: Page) {}
}
