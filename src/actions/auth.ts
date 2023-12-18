import {Page} from "playwright";
import {PassportLoginPage} from "../pages/passport-login-page";
import {config} from "dotenv";
import path from "path";
import {HomePage} from "../pages/home-page";

config({ path:  path.join(__dirname, '..', '..', '.env') });

const adminLogin = process.env.ADMIN_LOGIN!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const userLogin = process.env.USER_LOGIN!;
const userPassword = process.env.USER_PASSWORD!;

export async function adminAuth(page: Page, streamStandUrl: string): Promise<HomePage> {
    const loginPage = new PassportLoginPage(page);
    await loginPage.goto(streamStandUrl);
    await loginPage.authorize(adminLogin, adminPassword);
    await page.waitForURL(streamStandUrl);
    await page.waitForLoadState('networkidle');

    return new HomePage(page);
}

export async function userAuth(page: Page, streamStandUrl: string):Promise<HomePage> {
    const loginPage = new PassportLoginPage(page);
    await loginPage.goto(streamStandUrl);
    await loginPage.authorize(userLogin, userPassword);
    await page.waitForURL(streamStandUrl);
    await page.waitForLoadState('networkidle');

    return new HomePage(page);
}