import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import path from 'path';
import {
  Commands,
  getAfterStartStreamMessage,
  getUserActiveStreamsMessage,
  helpMessage,
  startMessage,
  streamStartTemplate,
  telegramBotCommands,
} from './constants';
import { Stream } from '../stream/stream';
import { parseStreamParams, parseStreamStopParams } from './heplers';
import { Logger } from '../helpers';

config({ path: path.join(__dirname, '..', '..', '.env') });
const botToken = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Класс бота, хранит в себе все запущенные стримы, инстанс TelegramBot и дату запуска бота
 */
export class StreamBot {
  private telegramBot: TelegramBot;
  private streams: Map<string, Stream>;
  private startTime?: number;

  constructor() {
    if (!botToken) {
      const error = new Error('TELEGRAM_BOT_TOKEN is not defined');
      Logger.error(error);
      throw error;
    }

    this.streams = new Map<string, Stream>();

    this.telegramBot = new TelegramBot(botToken, {
      polling: {
        interval: 300,
        autoStart: false,
      },
    });

    this.telegramBot.on('message', this.onMessage.bind(this));
    Logger.info('Create Stream Telegram bot');
  }

  public async start() {
    Logger.info('Starting StreamBot');
    this.startTime = parseInt(Date.now().toString().substring(0, 10));
    Logger.info(`Start time: ${this.startTime}`);
    await this.telegramBot.setMyCommands(telegramBotCommands);
    await this.telegramBot.startPolling();
    Logger.info(`StreamBot startPolling`);
  }

  private async onMessage(msg: TelegramBot.Message) {
    Logger.info(`Get message from ${msg.from?.username}: ${msg.text}`);
    if (!msg.text || !msg.from || !msg.from?.id || !msg.from?.username || msg.from.is_bot) {
      Logger.warn(`Incorrect message from: ${msg.from?.username} isBot=${msg.from?.is_bot ?? false}: ${msg.text}`);
      await this.telegramBot.sendMessage(msg.chat.id, 'Вы какой-то странный, не буду ничего делать');
      return;
    }

    if (this.startTime && msg.date < this.startTime) {
      Logger.info(`Old message from ${msg.from?.username}: ${msg.text}, ${msg.date} < ${this.startTime}, skipped`);
      return;
    }

    if (msg.text?.startsWith(`/${Commands.StartStream}`)) {
      await this.onStreamStart(msg);
      return;
    }

    if (msg.text?.startsWith(`/${Commands.StopStream}`)) {
      await this.onStreamStop(msg);
      return;
    }

    switch (msg.text) {
      case `/${Commands.Start}`:
        await this.onStart(msg);
        break;
      case `/${Commands.Help}`:
        await this.onHelp(msg);
        break;
      case `/${Commands.Template}`:
        await this.onTemplate(msg);
        break;
      case `/${Commands.ShowMyActiveStreams}`:
        await this.onShowMyActiveStreams(msg);
        break;
      default:
        await this.onUnknown(msg);
    }
  }

  private async onStart(msg: TelegramBot.Message) {
    Logger.info(`onStart: From user ${msg.from?.username} - ${msg.text}`);
    await this.telegramBot.sendMessage(msg.chat.id, startMessage, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  private async onHelp(msg: TelegramBot.Message) {
    Logger.info(`onHelp: From user ${msg.from?.username} - ${msg.text}`);
    await this.telegramBot.sendMessage(msg.chat.id, helpMessage, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }
  private async onTemplate(msg: TelegramBot.Message) {
    Logger.info(`onTemplate: From user ${msg.from?.username} - ${msg.text}`);
    await this.telegramBot.sendMessage(msg.chat.id, streamStartTemplate, { parse_mode: 'HTML' });
  }

  private async onShowMyActiveStreams(msg: TelegramBot.Message) {
    Logger.info(`onShowMyActiveStreams: From user ${msg.from?.username} - ${msg.text}`);
    const userActiveStreams = Array.from(this.streams.values()).filter(
      (s) => s.userId === msg.from?.id.toString() && s.status === 'started'
    );
    if (userActiveStreams.length === 0) {
      Logger.info(`onShowMyActiveStreams: No active streams for user ${msg.from?.username}`);
      await this.telegramBot.sendMessage(msg.chat.id, 'У вас нет запущенных стримов');
      return;
    }
    const message = getUserActiveStreamsMessage(userActiveStreams);
    Logger.info(`onShowMyActiveStreams: Active streams for user ${msg.from?.username} - ${message}`);
    await this.telegramBot.sendMessage(msg.chat.id, message, {
      parse_mode: 'HTML',
    });
  }

  private async onStreamStart(msg: TelegramBot.Message) {
    Logger.info(`onStreamStart: Begin`);
    await this.telegramBot.sendMessage(msg.chat.id, 'Запускаю стрим, подождите немного...');

    const parsedParams = await this.parseStartStreamParams(msg);
    if (!parsedParams) {
      return;
    }

    const stream = new Stream(msg.from!.id.toString(), msg.from!.username ?? 'unknown_user');
    this.streams.set(stream.id, stream);
    Logger.info(`onStreamStart: Create Stream with id=${stream.id}`);

    try {
      const roomUrl = await stream.startStream(parsedParams);
      Logger.info(
        `onStreamStart: Start stream with id: ${stream?.id}\nfrom User: ${stream?.userName}\nroomUrl: ${stream?.roomUrl}`
      );
      await this.telegramBot.sendMessage(msg.chat.id, getAfterStartStreamMessage(parsedParams, roomUrl, stream.id), {
        parse_mode: 'HTML',
      });

      //NOTE: Останавливаем стрим автоматически через N минут
      // NOTE: 8h = 28800000ms
      // NOTE: 10min = 600000ms
      setTimeout(async () => {
        await this.stopStreamInner(stream.id, msg.chat.id, true);
      }, 28800000);
    } catch (e) {
      Logger.error(e as Error);
      let message = 'Неизвестная ошибка';
      if (e instanceof Error) {
        message = e.message;
      }
      await stream.closeBrowser();
      await this.telegramBot.sendMessage(
        msg.chat.id,
        `Не удалось запустить стрим с заданными параметрами:\n\n${message}`,
        {
          parse_mode: 'HTML',
        }
      );
    }
  }

  private async onStreamStop(msg: TelegramBot.Message) {
    Logger.info(`onStreamStop: Begin`);
    let streamId = undefined;
    try {
      streamId = parseStreamStopParams(msg.text!);
    } catch (e) {
      Logger.error(e as Error);
      await this.telegramBot.sendMessage(
        msg.chat.id,
        'Произошла ошибка при парсинге параметров: ' + (e as Error).message
      );
      return;
    }
    await this.stopStreamInner(streamId, msg.chat.id);
  }

  private async stopStreamInner(streamId: string, chatId: number, auto?: boolean) {
    const stream = this.streams.get(streamId);
    if (!stream) {
      await this.telegramBot.sendMessage(chatId, `Стрима с id=${streamId} не существует`);
      Logger.info(`stopStreamInner: Stream dont exist - id=${streamId}`);
      return;
    }
    if (stream.status === 'started') {
      await stream.stopStream();
      Logger.info(
        `stopStreamInner: Stop stream - id=${stream?.id}\nfrom User: ${stream?.userName}\nroomUrl:${stream?.roomUrl}`
      );
      await this.telegramBot.sendMessage(chatId, `Стрим ${streamId} остановлен`);
      return;
    }
    await this.telegramBot.sendMessage(chatId, `Стрим уже ${streamId} остановлен`);
    Logger.info(
      `stopStreamInner: Stream already stopped - id=${stream?.id}\nfrom User: ${stream?.userName}\nroomUrl:${stream?.roomUrl}`
    );
  }

  private async onUnknown(msg: TelegramBot.Message) {
    Logger.info(`onUnknown: unknown command from User ${msg.from?.username} - ${msg.text}`);
    await this.telegramBot.sendMessage(msg.chat.id, 'Я не знаю такую команду, попробуйте /help');
  }

  private async parseStartStreamParams(msg: TelegramBot.Message) {
    let parsedParams = undefined;
    try {
      parsedParams = parseStreamParams(msg.text!);
      if (!parsedParams) {
        Logger.warn(`onStreamStart: Incorrect startStreamParams - ${msg.text}`);
        await this.telegramBot.sendMessage(msg.chat.id, 'Какие-то странные параметры, не буду ничего делать');
        return;
      }
    } catch (e) {
      Logger.error(e as Error);
      await this.telegramBot.sendMessage(
        msg.chat.id,
        'Произошла ошибка при парсинге параметров: ' + (e as Error).message
      );
      return;
    }

    return parsedParams;
  }
}
