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

  readonly eventsList = this.page.getByTestId('CreateEventPage.EventsList');
  readonly eventsListItems = this.page.getByTestId('StreamEventsDayBlock.Event');
  readonly eventsNames = this.page.getByTestId('StreamEventBlock.Name');

  readonly eventSettingsBtn = this.page.getByTestId('StreamEventCreated.SettingsButton');
  readonly toMainPageBtn = this.page.getByTestId('StreamEventCreated.ToMainPageButton');
  readonly createdEventText = this.page.getByTestId('StreamEventCreated.EventDateText');

  constructor(private readonly page: Page) {}

  /**
   * @param date "01.07.2023"
   * */
  async setDate(date: string) {
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
  async setFromTime(time: string) {
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
  async setToTime(time: string) {
    try {
      await this.timeToPicker.fill(time);
      await this.datePicker.blur();
    } catch (e) {
      throw new Error(`Can't set to time: ${time}`);
    }
  }

  async setName(name: string) {
    try {
      await this.nameInput.fill(name);
    } catch (e) {
      throw new Error(`Can't set to name: ${name}`);
    }
  }

  async createEvent() {
    try {
      await this.createBtn.click();
    } catch (e) {
      throw new Error(`Can't click on create button`);
    }
  }

  async cancelCreation() {
    await this.cancelBtn.click();
  }

  async gotoEventSettings(): Promise<EventSettingsPage> {
    try {
      await this.eventSettingsBtn.click();
      return new EventSettingsPage(this.page);
    } catch (e) {
      throw new Error(`Can't go to stream event settings page after create`);
    }
  }
}
