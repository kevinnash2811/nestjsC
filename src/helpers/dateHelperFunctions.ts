import moment from "moment";

const HOURS_DIFFERENCE = 4;

export const date_formater = (
  dateToFormat: Date = new Date(),
  hoursDifference: number = HOURS_DIFFERENCE,
) => {
  dateToFormat.setHours(dateToFormat.getHours() + hoursDifference);
  return `${dateToFormat.toLocaleDateString('en-CA')} ${dateToFormat
    .toLocaleTimeString('en-CA', { hour12: false })
    .slice(0, 8)}`;
};

/**
 * Quita 4 horas a la fecha enviada
 * @param date fecha en tipo date o string
 * @param format formato (momentjs) de la fecha a retornar
 * @returns la fecha en formato enviado, si no envia nada por defecto es YYYY-MM-DDTHH:mm:ss
 */
export const toUTC4 = (date: Date | string, format: string = 'YYYY-MM-DDTHH:mm:ss'): string => {
  if (!date) return '';

  return moment(date)
    .utcOffset(-4)
    .format(format);
};
