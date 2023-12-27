import { Page } from 'playwright';
import { DatePicker } from '../elements/date-picker';
import { TimeInput } from '../elements/time-input';
import { EventSettingsPage } from './event-settings-page';

export class CreateEventPage {
  private readonly dateTimePicker = this.page.getByTestId('CreateEventPage.DateTimePicker');
  readonly datePicker = new DatePicker(this.dateTimePicker.getByTestId('OneDateTimePicker.DatePicker'));
  readonly timeFromPicker = new TimeInput(this.dateTimePicker.getByTestId('OneDateTimePicker.TimeFromPicker'));
  readonly timeToPicker = this.dateTimePicker.getByTestId('OneDateTimePicker.TimeToPicker').locator('input').nth(0);
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
      throw new Error(`Can't set date: ${date}`);
    }
  }

  /**
   * @param time "12"
   * */
  public async setFromTime(time: string) {
    try {
      await this.timeFromPicker.fill(time);
      await this.timeFromPicker.blur();
    } catch (e) {
      throw new Error(`Can't set from time: ${time}`);
    }
  }

  /**
   * @param time "12"
   * */
  public async setToTime(time: string) {
    try {
      await this.timeToPicker.fill(time);
      await this.datePicker.blur();
    } catch (e) {
      throw new Error(`Can't set to time: ${time}`);
    }
  }

  public async setName(name: string) {
    try {
      await this.nameInput.fill(name);
    } catch (e) {
      throw new Error(`Can't set to name: ${name}`);
    }
  }

  public async createEvent() {
    try {
      await this.createBtn.click();
    } catch (e) {
      throw new Error(`Can't click on create button`);
    }
  }

  public async cancelCreation() {
    await this.cancelBtn.click();
  }

  public async gotoEventSettings(): Promise<EventSettingsPage> {
    try {
      await this.eventSettingsBtn.click();
      return new EventSettingsPage(this.page);
    } catch (e) {
      throw new Error(`Can't go to stream event settings page after create`);
    }
  }

  public async createStreamEvent(
    name: string,
    date: string,
    startTime?: string,
    endTime?: string
  ) {
    await this.setDate(date);
    if (startTime) {
      await this.setFromTime(startTime);
    }
    if (endTime) {
      await this.setToTime(endTime);
    }
    await this.setName(name);

    await this.createEvent();
    return await this.gotoEventSettings();
  }
}
