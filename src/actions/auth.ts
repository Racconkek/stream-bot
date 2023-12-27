import { Page } from 'playwright';
import { PassportLoginPage } from '../pages/passport-login-page';
import { config } from 'dotenv';
import path from 'path';
import { HomePage } from '../pages/home-page';

config({ path: path.join(__dirname, '..', '..', '.env') });

const adminLogin = process.env.ADMIN_LOGIN!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const userLogin = process.env.USER_LOGIN!;
const userPassword = process.env.USER_PASSWORD!;

/**
 * Авторизация админа
 * @param page Страница, на которой происходит авторизация
 * @param streamStandUrl Ссылка на стенд, на котором происходит авторизация
 */
export async function adminAuth(page: Page, streamStandUrl: string): Promise<HomePage> {
  const loginPage = new PassportLoginPage(page);
  try {
    await loginPage.goto(streamStandUrl);
    await loginPage.authorize(adminLogin, adminPassword);
    await page.waitForURL(streamStandUrl);
    await page.waitForLoadState('networkidle');

    return new HomePage(page);
  } catch (e) {
    throw new Error(`Cannot login on url ${streamStandUrl}`);
  }
}

/**
 * Авторизация обычного юзера
 * @param page Страница, на которой происходит авторизация
 * @param streamStandUrl Ссылка на стенд, на котором происходит авторизация
 */
export async function userAuth(page: Page, streamStandUrl: string): Promise<HomePage> {
  const loginPage = new PassportLoginPage(page);
  await loginPage.goto(streamStandUrl);
  await loginPage.authorize(userLogin, userPassword);
  await page.waitForURL(streamStandUrl);
  await page.waitForLoadState('networkidle');

  return new HomePage(page);
}
