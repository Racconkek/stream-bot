import { parseStreamParamsToString } from './heplers';
import { getAuditoriumUrlFromStreamUrl } from '../helpers';
import { IStreamStartParams } from '../stream/types';
import { Stream } from '../stream/stream';

export enum Commands {
  Start = 'start',
  Help = 'help',
  Template = 'template',
  StartStream = 'start_stream',
  StopStream = 'stop_stream',
  ShowMyActiveStreams = 'my_active_streams',
}

export const streamStartTemplate = `<code>/${Commands.StartStream}
  streamStandUrl: 
  name: 
  date: 
  tabToShareUrl:
  tabToShareName:
</code>`;

export const streamStopTemplate = `<code>/${Commands.StopStream} {streamId}</code>`;

export const commandsDescriptions = {
  [Commands.Start]: {
    short: 'Запуск бота',
    long: 'Этой командой вы можете запустить бота и почитать приветствие и справку',
  },
  [Commands.Help]: {
    short: 'Раздел помощи',
    long: 'Этой командой вы можете посмотреть подробные инструкции по использованию',
  },
  [Commands.Template]: {
    short: 'Шаблоны сообщений с параметрами для запуска/остановки стрима',
    long: 'Этой командой вы можете получить шаблон сообщения с параметрами запуска/остановки стрима',
  },
  [Commands.StartStream]: {
    short: 'Запуск стрима',
    long:
      `Этой командой вы можете запустить стрим с доступными параметрами:\n\n` +
      `<b>streamStandUrl</b>: стенд, на котором запустится стрим\n` +
      `<b>name</b>: Название мероприятия\n` +
      `<b>date</b>: дата начала мероприятия\n` +
      `<b>tabToShareUrl</b>: вкладка, которая будет шариться(youtobe лучше всего)\n` +
      `<b>tabToShareName</b>: название вкладки, которая будет шариться(названия на русском могут не сработать)\n\n` +
      `Все параметры необязательные, если не указаны, используются дефолтные значения:\n` +
      `streamStandUrl: <a href="https://talk-master.kube.testkontur.ru/">https://talk-master.kube.testkontur.ru/</a>\n` +
      `name: Test stream from Telegram Stream bot\n` +
      `date: сегодня\n` +
      `tabToShareUrl: <a href="https://www.youtube.com/watch?v=_DYAnU3H7RI&ab_channel=EpidemicChillBeats">https://www.youtube.com/watch?v=_DYAnU3H7RI&ab_channel=EpidemicChillBeats</a>\n` +
      `tabToShareName: 10 Hours Lofi Hip-Hop Marathon | Beats to Study/Relax to - YouTube`,
  },
  [Commands.StopStream]: {
    short: 'Остановка стрима',
    long: 'Этой командой вы можете остановить стрим по определенному id',
  },
  [Commands.ShowMyActiveStreams]: {
    short: 'Посмотреть список своих запущенных стримов',
    long: 'Этой командой вы можете посмотреть список своих запущенных стримов',
  },
};

export const telegramBotCommands = [
  { command: Commands.Start, description: commandsDescriptions[Commands.Start].short },
  { command: Commands.Help, description: commandsDescriptions[Commands.Help].short },
  { command: Commands.Template, description: commandsDescriptions[Commands.Template].short },
  { command: Commands.StartStream, description: commandsDescriptions[Commands.StartStream].short },
  { command: Commands.StopStream, description: commandsDescriptions[Commands.StopStream].short },
  { command: Commands.ShowMyActiveStreams, description: commandsDescriptions[Commands.ShowMyActiveStreams].short },
];

export const commandsDescription = `<b>Доступные команды</b>\n${telegramBotCommands
  .map((c) => `<i>/${c.command}</i> - ${commandsDescriptions[c.command].long}`)
  .join('\n\n')}`;

export const instructionMessage = `Для запуска стрима необходимо отправить сообщение вида:\n${streamStartTemplate}\nДля остановки стрима необходимо отправить сообщение вида:\n${streamStopTemplate}`;
export const startMessage = `Привет, я бот запускающий тестовые стримы\n\n${commandsDescription}\n\n${instructionMessage}`;
export const helpMessage = `${commandsDescription}\n\n${instructionMessage}`;

export const getAfterStartStreamMessage = (parsedParams: IStreamStartParams, roomUrl: string, streamId: string) =>
  `Параметры стрима: ${parseStreamParamsToString(
    parsedParams
  )}\n\n <b>Стрим запущен туть:</b> <a>${getAuditoriumUrlFromStreamUrl(
    roomUrl
  )}</a>\n\n <b>Стрим id:</b> <code>${streamId}</code>`;

export const getUserActiveStreamsMessage = (userActiveStreams: Stream[]) =>
  `Ваши запущенные стримы:\n\n${userActiveStreams
    .map((stream) => `<b>id</b>: <code>${stream.id}</code>\n<b>url</b>: <code>${stream.url}</code>\n`)
    .join('\n\n')}`;
