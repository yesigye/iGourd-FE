import dayjs from 'dayjs';

export { dayjs };

export function now() {
  return dayjs(Date.now()).format('MM/DD/YY HH:mm:ss');
}
