import { Page } from 'playwright';

import { EventGeneralSettingsPage } from './event-general-settings-page';
import { EventHostsSettingsPage } from './event-hosts-settings-page';
import { EventViewersSettingsPage } from './event-viewers-settings-page';
import {Logger} from "../helpers";

export class EventSettingsPage {
  readonly title = this.page.locator('h1');
  readonly generalSettingsBtn = this.page.getByTestId('EventsSettingsPage.GeneralSettings');
  readonly hostsSettingsBtn = this.page.getByTestId('EventsSettingsPage.HostsSettings');
  readonly viewersSettingsBtn = this.page.getByTestId('EventsSettingsPage.ViewersSettings');
  readonly generalSettings: EventGeneralSettingsPage;
  readonly hostsSettings: EventHostsSettingsPage;
  readonly viewersSettings: EventViewersSettingsPage;

  constructor(private readonly page: Page) {
    this.generalSettings = new EventGeneralSettingsPage(page);
    this.hostsSettings = new EventHostsSettingsPage(page);
    this.viewersSettings = new EventViewersSettingsPage(page);
  }

  public async gotoHostsSettings() {
    try {
      await this.hostsSettingsBtn.click();
      Logger.info(`EventSettingsPage: click on Hosts tab`)
      return this.hostsSettings;
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't go to hosts tab in settings`);
    }
  }
}
