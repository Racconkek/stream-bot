import { Page } from 'playwright';

export class EventGeneralSettingsPage {
  readonly eventName = this.page.getByTestId('GeneralSettings.Name').locator('textarea');
  readonly eventDescription = this.page.getByTestId('GeneralSettings.Description').locator('textarea');
  readonly autoRecording = this.page.getByTestId('GeneralSettings.AutoRecording').locator('n-web-toggle');

  readonly dateTimePicker = this.page.getByTestId('GeneralSettings.DateTime');
  readonly dateTimePickerError = this.page.getByTestId('OneDateTimePicker.Error');
  readonly datePicker = this.dateTimePicker.getByTestId('OneDateTimePicker.DatePicker');
  readonly datePickerInput = this.datePicker.locator('input');

  readonly timeFromPicker = this.dateTimePicker.getByTestId('OneDateTimePicker.TimeFromPicker');
  readonly timeFromPickerInput = this.timeFromPicker.locator('input').nth(0);
  readonly timeToPicker = this.dateTimePicker.getByTestId('OneDateTimePicker.TimeToPicker');
  readonly timeToPickerInput = this.timeToPicker.locator('input').nth(0);

  constructor(private readonly page: Page) {}
}
