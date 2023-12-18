import { Page } from 'playwright';
import { DatePicker } from '../elements/date-picker';
import {TimeInput} from "../elements/time-input";
import {EventSettingsPage} from "./event-settings-page";

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
    await this.datePicker.fill(date);
    await this.datePicker.blur();
  }

  /**
   * @param time "12"
   * */
  async setFromTime(time: string) {
    await this.timeFromPicker.fill(time);
    await this.timeFromPicker.blur();
  }

  /**
   * @param time "12"
   * */
  async setToTime(time: string) {
    await this.timeToPicker.fill(time);
    await this.datePicker.blur();
  }

  async setName(name: string) {
    await this.nameInput.fill(name);
  }

  async createEvent() {
    await this.createBtn.click();
  }

  async cancelCreation() {
    await this.cancelBtn.click();
  }

  async gotoEventSettings(): Promise<EventSettingsPage> {
    await this.eventSettingsBtn.click();
    return new EventSettingsPage(this.page);
  }
}
