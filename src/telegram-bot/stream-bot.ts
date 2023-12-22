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
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    this.streams = new Map<string, Stream>();

    this.telegramBot = new TelegramBot(botToken, {
      polling: {
        interval: 300,
        autoStart: false,
      },
    });

    this.telegramBot.on('message', this.onMessage.bind(this));
  }

  public async start() {
    this.startTime = parseInt(Date.now().toString().substring(0, 10));
    await this.telegramBot.setMyCommands(telegramBotCommands);
    await this.telegramBot.startPolling();
    console.info(`TelegramBot startPolling`);
  }

  private async onMessage(msg: TelegramBot.Message) {
    if (!msg.text || !msg.from || !msg.from?.id || msg.from.is_bot) {
      await this.telegramBot.sendMessage(msg.chat.id, 'Вы какой-то странный, не буду ничего делать');
      return;
    }

    if (this.startTime && msg.date < this.startTime) {
      console.log(`Old message, skip: ${msg.from?.username} - ${msg.text}, ${msg.date} < ${this.startTime}`);
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
    await this.telegramBot.sendMessage(msg.chat.id, startMessage, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  private async onHelp(msg: TelegramBot.Message) {
    await this.telegramBot.sendMessage(msg.chat.id, helpMessage, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }
  private async onTemplate(msg: TelegramBot.Message) {
    await this.telegramBot.sendMessage(msg.chat.id, streamStartTemplate, { parse_mode: 'HTML' });
  }

  private async onShowMyActiveStreams(msg: TelegramBot.Message) {
    const userActiveStreams = Array.from(this.streams.values()).filter(
      (s) => s.userId === msg.from?.id.toString() && s.status === 'started'
    );
    if (userActiveStreams.length === 0) {
      await this.telegramBot.sendMessage(msg.chat.id, 'У вас нет запущенных стримов');
      return;
    }
    await this.telegramBot.sendMessage(msg.chat.id, getUserActiveStreamsMessage(userActiveStreams), {
      parse_mode: 'HTML',
    });
  }

  private async onStreamStart(msg: TelegramBot.Message) {
    await this.telegramBot.sendMessage(msg.chat.id, 'Запускаю стрим, подождите немного...');

    const parsedParams = await this.parseStartStreamParams(msg);
    if (!parsedParams) {
      return;
    }

    const stream = new Stream(msg.from!.id.toString(), msg.from!.username ?? 'unknown_user');
    this.streams.set(stream.id, stream);

    try {
      const roomUrl = await stream.startStream(parsedParams);
      console.info('Start stream', stream?.id, ' from User', stream?.userName, ' url: ', stream?.roomUrl);
      await this.telegramBot.sendMessage(msg.chat.id, getAfterStartStreamMessage(parsedParams, roomUrl, stream.id), {
        parse_mode: 'HTML',
      });

      //NOTE: Останавливаем стрим автоматически через N минут
      // NOTE: 8h = 28800000ms
      // NOTE: 10min = 600000ms
      setTimeout(async () => {
        await this.stopStreamInner(stream.id, msg.chat.id);
      }, 28800000);
    } catch (e) {
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
    let streamId = undefined;
    try {
      streamId = parseStreamStopParams(msg.text!);
    } catch (e) {
      await this.telegramBot.sendMessage(
        msg.chat.id,
        'Произошла ошибка при парсинге параметров: ' + (e as Error).message
      );
      return;
    }
    await this.stopStreamInner(streamId, msg.chat.id);
  }

  private async stopStreamInner(streamId: string, chatId: number) {
    const savedStream = this.streams.get(streamId);
    if (savedStream) {
      await savedStream.stopStream();
      console.info('Stop stream', savedStream?.id, ' from User', savedStream?.userId, ' url: ', savedStream?.roomUrl);
    }
    await this.telegramBot.sendMessage(chatId, `Стрим ${streamId} остановлен`);
  }

  private async onUnknown(msg: TelegramBot.Message) {
    await this.telegramBot.sendMessage(msg.chat.id, 'Я не знаю такую команду, попробуйте /help');
  }

  private async parseStartStreamParams(msg: TelegramBot.Message) {
    let parsedParams = undefined;
    try {
      parsedParams = parseStreamParams(msg.text!);
      if (!parsedParams) {
        await this.telegramBot.sendMessage(msg.chat.id, 'Какие-то странные параметры, не буду ничего делать');
        return;
      }
    } catch (e) {
      await this.telegramBot.sendMessage(
        msg.chat.id,
        'Произошла ошибка при парсинге параметров: ' + (e as Error).message
      );
      return;
    }

    return parsedParams;
  }
}
