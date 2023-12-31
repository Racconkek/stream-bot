import { Page } from 'playwright';
import { DatePicker } from '../elements/date-picker';
import { EventSettingsPage } from './event-settings-page';
import { Select } from '../elements/select';
import { Logger } from '../helpers';

export class CreateEventPage {
  private readonly dateTimePicker = this.page.getByTestId('CreateEventPage.DateTimePicker');
  readonly datePicker = new DatePicker(this.dateTimePicker.getByTestId('OneDateTimePicker.DatePicker'));
  readonly durationHoursSelect = new Select(this.dateTimePicker.getByTestId('OneDateTimePicker.DurationHours'));
  readonly durationMinutesSelect = new Select(this.dateTimePicker.getByTestId('OneDateTimePicker.DurationMinutes'));
  readonly nameInput = this.page.getByTestId('CreateEventPage.NameInput').locator('textarea');
  readonly createBtn = this.page.getByTestId('CreateEventPage.CreateButton');
  readonly cancelBtn = this.page.getByTestId('CreateEventPage.CancelButton');

  readonly eventSettingsBtn = this.page.getByTestId('StreamEventCreated.SettingsButton');

  constructor(private readonly page: Page) {}

  /**
   * @param date "01.07.2023"
   * */
  public async setDate(date: string) {
    try {
      await this.datePicker.fill(date);
      await this.datePicker.blur();
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't set date: ${date}`);
    }
  }

  /**
   * @param hours "1ч"
   * */
  async setDurationHours(hours: string) {
    try {
      await this.durationHoursSelect.selectItem(
        this.page
          .locator('[data-tid="Select__menu"]')
          .getByText(hours)
          .filter({ hasText: new RegExp(`^${hours}$`) })
      );
      Logger.info(`CreateEventPage: set duration hours ${hours}`)
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Cannot set duration hours: ${hours}`);
    }
  }

  /**
   * @param minutes "0м | 15м | 30м | 45м"
   * */
  async setDurationMinutes(minutes: string) {
    try {
      await this.durationMinutesSelect.selectItem(this.page.getByText(minutes));
      Logger.info(`CreateEventPage: set duration minutes ${minutes}`)
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Cannot set duration minutes: ${minutes}`);
    }
  }

  public async setName(name: string) {
    try {
      await this.nameInput.fill(name);
      Logger.info(`CreateEventPage: set duration name ${name}`)
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't set to name: ${name}`);
    }
  }

  public async createEvent() {
    try {
      await this.createBtn.click();
      Logger.info(`CreateEventPage: click on create button`)
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't click on create button`);
    }
  }

  public async cancelCreation() {
    await this.cancelBtn.click();
  }

  public async gotoEventSettings(): Promise<EventSettingsPage> {
    try {
      await this.eventSettingsBtn.click();
      Logger.info(`CreateEventPage: click on event settings page button after create`)
      return new EventSettingsPage(this.page);
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't go to stream event settings page after create`);
    }
  }

  public async createStreamEvent(name: string, date: string, durationHours?: string, durationMinutes?: string) {
    await this.setDate(date);
    if (durationHours) {
      await this.setDurationHours(durationHours);
    }
    if (durationMinutes) {
      await this.setDurationMinutes(durationMinutes);
    }
    await this.setName(name);

    await this.createEvent();
    return await this.gotoEventSettings();
  }
}
