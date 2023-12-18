import { StreamStartParams } from '../stream';
import { dateToString } from '../helpers';

export const defaultStreamStartParams: StreamStartParams = {
  streamStandUrl: 'https://talk-master.kube.testkontur.ru/',
  name: 'Test stream from Telegram Stream bot',
  date: dateToString(new Date()),
  startTime: undefined,
  endTime: undefined,
};

export const parseStreamParams = (text: string): StreamStartParams => {
  const lines = text
    .trim()
    .split('\n')
    .map((line) => line.trim());
  const params: StreamStartParams = defaultStreamStartParams;

  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    const key = line.substring(0, separatorIndex).trim();
    const value = line.substring(separatorIndex + 1).trim();
    if (key === 'streamStandUrl') {
      params.streamStandUrl = value;
    } else if (key === 'name') {
      params.name = value;
    } else if (key === 'date') {
      params.date = value;
    } else if (key === 'startTime') {
      params.startTime = value;
    } else if (key === 'endTime') {
      params.endTime = value;
    }
  }

  return params;
};

export const parseStreamParamsToString = (params: StreamStartParams): string => {
  return `streamStandUrl: ${params.streamStandUrl}\nname: ${params.name}\ndate: ${params.date}\nstartTime: ${params.startTime}\nendTime: ${params.endTime}`;
};

export const parseStreamStopParams = (text: string): string => {
  const lines = text
    .trim()
    .split('\n')
    .map((line) => line.trim());
  let id = undefined;

  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    const key = line.substring(0, separatorIndex).trim();
    const value = line.substring(separatorIndex + 1).trim();
    if (key === 'streamId') {
      id = value;
    }
  }

  if (!id) {
    throw new Error('Нет streamId');
  }

  return id;
};
