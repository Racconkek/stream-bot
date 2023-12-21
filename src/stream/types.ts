import { dateToString } from '../helpers';

/**
 * Параметры вкладки для шаринга экрана
 * @interface ITabToShareParams
 * @param url ссылка на то, что шарим, если не указано, используется дефолтная ссылка
 * @param name Название вкладки, чтобы указать параметры запуска браузера,
 * автоматически при шаринге экрана выберется вкладка с этим названием, возможные параметры:
 * Entire screen - пошарит весь экран
 * document.title - пошарит вкладку с названием, которое указано в этом параметре
 */
export interface ITabToShareParams {
  url?: string;
  name?: string;
}

export const DefaultTabToShareParams = {
  url: 'https://www.youtube.com/watch?v=_DYAnU3H7RI&ab_channel=EpidemicChillBeats',
  name: '10 Hours Lofi Hip-Hop Marathon | Beats to Study/Relax to - YouTube',
};

export interface IStreamStartParams {
  streamStandUrl: string;
  name: string;
  date: string;
  startTime?: string;
  endTime?: string;
  tabToShareUrl?: string;
  tabToShareName?: string;
}

export const defaultStreamStartParams: IStreamStartParams = {
  streamStandUrl: 'https://talk-master.kube.testkontur.ru/',
  name: 'Test stream from Telegram Stream bot',
  date: dateToString(new Date()),
  startTime: undefined,
  endTime: undefined,
  tabToShareUrl: DefaultTabToShareParams.url,
  tabToShareName: DefaultTabToShareParams.name,
};
