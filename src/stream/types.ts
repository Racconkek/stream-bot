import { dateToString } from '../helpers';

/**
 * Параметры вкладки для шаринга экрана
 *
 * @property url Ссылка на то, что шарим, если не указано, используется дефолтная ссылка
 *
 * @property name Название вкладки, чтобы указать параметры запуска браузера,
 * автоматически при шаринге экрана выберется вкладка с этим названием, возможные параметры:
 *
 * Entire screen - пошарит весь экран
 *
 * Любая строка с названием(лучше английские буковки), взять можно из document.title на странице, которую будут шарить
 */
export interface ITabToShareParams {
  url?: string;
  name?: string;
}

/**
 * Параметры для запуска стрима по умолчанию
 */
export const DefaultTabToShareParams = {
  url: 'https://www.youtube.com/watch?v=_DYAnU3H7RI&ab_channel=EpidemicChillBeats',
  name: '10 Hours Lofi Hip-Hop Marathon | Beats to Study/Relax to - YouTube',
};


/**
 * Параметры для запуска стрима
 *
 * @property streamStandUrl Ссылка на стенд, на котором запустится стрим, если не указано, используется дефолтная ссылка https://talk-master.kube.testkontur.ru/
 * @property name Название мероприятия, если не указано, используется дефолтное название Test stream from Telegram Stream bot
 * @property date Дата начала мероприятия, если не указано, используется сегодняшняя дата
 * @property startTime Время начала мероприятия, если не указано, используется текущее время
 * @property endTime Время окончания мероприятия, если не указано, используется текущее время + 1 час
 * @property tabParams Параметры вкладки, которая будет шариться, если не указано, используются дефолтные параметры
 */
export interface IStreamStartParams {
  streamStandUrl: string;
  name: string;
  date: string;
  durationHours?: string;
  durationMinutes?: string;
  tabParams?: ITabToShareParams;
}

export const DefaultStreamStartParams: IStreamStartParams = {
  streamStandUrl: 'https://talk-master.kube.testkontur.ru/',
  name: 'Test stream from Telegram Stream bot',
  date: dateToString(new Date()),
  durationHours: undefined,
  durationMinutes: undefined,
  tabParams: DefaultTabToShareParams,
};
