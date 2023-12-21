import { defaultStreamStartParams, IStreamStartParams } from '../stream/types';

export const parseStreamParams = (text: string): IStreamStartParams => {
  const lines = text
    .trim()
    .split('\n')
    .map((line) => line.trim());
  const params: IStreamStartParams = defaultStreamStartParams;
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
    } else if (key === 'startTime') {
      params.startTime = value;
    } else if (key === 'endTime') {
      params.endTime = value;
    } else if (key === 'tabToShareUrl') {
      hasTabToShareUrl = true;
    } else if (key === 'tabToShareName') {
      hasTabToShareName = true;
    }
  }

  if (hasTabToShareUrl && hasTabToShareName) {
    params.tabToShareUrl = lines
      .find((line) => line.trim().startsWith('tabToShareUrl'))
      ?.split('tabToShareUrl:')[1]
      .trim();
    params.tabToShareName = lines
      .find((line) => line.trim().startsWith('tabToShareName'))
      ?.split('tabToShareName:')[1]
      .trim();
  }

  console.log(params)

  return params;
};

export const parseStreamParamsToString = (params: IStreamStartParams): string => {
  return `streamStandUrl: ${params.streamStandUrl}\nname: ${params.name}\ndate: ${params.date}\nstartTime: ${params.startTime}\nendTime: ${params.endTime}`;
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
