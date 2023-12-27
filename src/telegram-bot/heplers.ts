import { DefaultStreamStartParams, IStreamStartParams, ITabToShareParams } from '../stream/types';
import { dateToString } from '../helpers';

export const parseStreamParams = (text: string): IStreamStartParams => {
  const lines = text
    .trim()
    .split('\n')
    .map((line) => line.trim());
  const params: IStreamStartParams = DefaultStreamStartParams;
  params.date = dateToString(new Date());
  let hasTabToShareUrl = false;
  let hasTabToShareName = false;

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
    } else if (key === 'durationHours') {
      params.durationHours = value;
    } else if (key === 'durationMinutes') {
      params.durationMinutes = value;
    } else if (key === 'tabToShareUrl') {
      hasTabToShareUrl = true;
    } else if (key === 'tabToShareName') {
      hasTabToShareName = true;
    }
  }

  if (hasTabToShareUrl && hasTabToShareName) {
    params.tabParams = {} as ITabToShareParams;
    params.tabParams.url = lines
      .find((line) => line.trim().startsWith('tabToShareUrl'))
      ?.split('tabToShareUrl:')[1]
      .trim();
    params.tabParams.name = lines
      .find((line) => line.trim().startsWith('tabToShareName'))
      ?.split('tabToShareName:')[1]
      .trim();
  }

  return params;
};

export const parseStreamParamsToString = (params: IStreamStartParams): string => {
  return `streamStandUrl: ${params.streamStandUrl}\nname: ${params.name}\ndate: ${params.date}\ndurationHours: ${params.durationHours}\ndurationMinutes: ${params.durationMinutes}`;
};

export const parseStreamStopParams = (text: string): string => {
  const parts = text
    .trim()
    .split(' ')
    .map((part) => part.trim());

  const id = parts[1];

  if (!id) {
    throw new Error('Нет streamId');
  }

  return id;
};
