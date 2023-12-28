import { Dropdown } from '../elements/dropdown';
import { Page } from 'playwright';
import { CreateEventPage } from './create-event-page';
import { RoomPage } from './room-page';
import { RoomConnectPage } from './room-connect-page';
import { Logger } from '../helpers';

export class HomePage {
  readonly homePageRoot = this.page.locator('home-page');
  readonly newBtn = this.page.locator('.new-button');
  readonly createDropdown = new Dropdown(this.newBtn);
  readonly newRoomBtn = this.page.getByTitle('Комната');
  readonly newMeetingBtn = this.page.getByTitle('Встреча в календаре');
  readonly newEventBtn = this.page.getByTestId('HomePage.CreateEvent');

  constructor(private readonly page: Page) {}

  async gotoRandomRoom(baseUrl: string): Promise<RoomPage> {
    await this.page.goto(`${baseUrl}/${Math.random().toString(36).substring(7)}`);
    await this.page.waitForLoadState('networkidle');
    const roomConnectPage = new RoomConnectPage(this.page);

    return roomConnectPage.continue();
  }

  async gotoStreamEventCreation(): Promise<CreateEventPage> {
    try {
      await this.createDropdown.clickDropdownItem(this.newEventBtn);
      await this.page.waitForLoadState('networkidle');
      Logger.info(`HomePage.gotoStreamEventCreation: Success`);

      return new CreateEventPage(this.page);
    } catch (e) {
      Logger.error(e as Error);
      throw new Error(`Can't go to CreateEventPage`);
    }
  }
}
