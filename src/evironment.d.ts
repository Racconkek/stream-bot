declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_LOGIN: string;
      ADMIN_PASSWORD: string;
      USER_LOGIN: string;
      USER_PASSWORD: string;
      TELEGRAM_BOT_TOKEN: string;
    }
  }
}