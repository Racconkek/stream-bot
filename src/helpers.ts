import guid from 'uuid-random';
import chalk from 'chalk';

export class Logger {
  public static info(message: string) {
    console.info(chalk.blue(message));
  }

  public static warn(message: string) {
    console.log(chalk.yellow(message));
  }

  public static error(error: Error) {
    console.error(chalk.red(error.message), error.stack);
  }
}

export function dateToString(date: Date): string {
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
}

export function getAuditoriumUrlFromStreamUrl(streamUrl: string): string {
  const url = new URL(streamUrl);
  url.pathname = url.pathname.replace('/', '/app/stream/auditoriums/');
  return url.toString();
}

export function getGuid() {
  return guid();
}
