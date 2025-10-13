import dayjs, { type OpUnitType } from 'dayjs';
import { default as between } from 'dayjs/plugin/isBetween';
dayjs.extend(between);

export { dayjs };

export function now() {
  return dayjs(Date.now()).format('MM/DD/YY HH:mm:ss');
}

export function isBetween(
  time: Date,
  range: [string, string],
  unit: OpUnitType = 'day',
) {
  const [start, end] = range;
  return dayjs(time).isBetween(start, end, unit, '[]');
}
