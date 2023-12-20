import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import path from 'path';
import { Commands, helpMessage, startMessage, streamStartTemplate, telegramBotCommands } from './constants';
import { Stream } from '../stream';
import { parseStreamParams, parseStreamParamsToString, parseStreamStopParams } from './heplers';

config({ path: path.join(__dirname, '..', '..', '.env') });
const botToken = process.env.TELEGRAM_BOT_TOKEN;

export class StreamBot {
  private telegramBot: TelegramBot;
  private streams: Map<string, Stream>;

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
    await this.telegramBot.setMyCommands(telegramBotCommands);
    await this.telegramBot.startPolling();
    console.info(`TelegramBot startPolling`);
  }

  private async onMessage(msg: TelegramBot.Message) {
    if (!msg.text || !msg.from || !msg.from?.id || msg.from.is_bot) {
      await this.telegramBot.sendMessage(msg.chat.id, 'Вы какой-то странный, не буду ничего делать');
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
    await this.telegramBot.sendMessage(msg.chat.id, startMessage, { parse_mode: 'HTML' });
  }

  private async onHelp(msg: TelegramBot.Message) {
    await this.telegramBot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'HTML' });
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
    await this.telegramBot.sendMessage(
      msg.chat.id,
      `Ваши запущенные стримы:\n\n${userActiveStreams
        .map((stream) => `<b>id</b>: <code>${stream.id}</code>\n<b>url</b>: <code>${stream.url}</code>\n`)
        .join('\n\n')}`,
      {
        parse_mode: 'HTML',
      }
    );
  }

  private async onStreamStart(msg: TelegramBot.Message) {
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

    const stream = new Stream(msg.from!.id.toString());
    this.streams.set(stream.id, stream);

    try {
      const url = await stream.startStream(parsedParams);
      console.info('Start stream', stream?.id, ' from User', stream?.userId, ' url: ', stream?.url);
      await this.telegramBot.sendMessage(
        msg.chat.id,
        `Параметры стрима: ${parseStreamParamsToString(
          parsedParams
        )}\n\n <b>Стрим запущен туть:</b> <code><a>${url}</a></code>\n\n <b>Стрим id:</b> <code>${stream.id}</code>`,
        {
          parse_mode: 'HTML',
        }
      );
    } catch (e) {
      let message = 'Неизвестная ошибка';
      if (e instanceof Error) {
        message = e.message;
      }
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
    const savedStream = this.streams.get(streamId);
    if (savedStream) {
      await savedStream.stopStream();
      console.info('Stop stream', savedStream?.id, ' from User', savedStream?.userId, ' url: ', savedStream?.url);
    }
    await this.telegramBot.sendMessage(msg.chat.id, `Стрим ${streamId} остановлен`);
  }

  private async onUnknown(msg: TelegramBot.Message) {
    await this.telegramBot.sendMessage(msg.chat.id, 'Я не знаю такую команду, попробуйте /help');
  }
}
