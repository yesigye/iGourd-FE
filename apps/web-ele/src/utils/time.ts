import dayjs from 'dayjs';

// 快捷时间范围
export type QUICK_TIME_RANGE = {
  lastMonth: 'last-month';
  lastWeek: 'last-week';
  today: 'today';
  yesterday: 'yesterday';
};
// 时间处理方法
export const quickSwitchTime = (
  val: QUICK_TIME_RANGE[keyof QUICK_TIME_RANGE],
) => {
  switch (val) {
    case 'last-month': {
      return [
        dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
        dayjs().format('YYYY-MM-DD 23:59:59'),
      ];
      break;
    }
    case 'last-week': {
      return [
        dayjs().subtract(1, 'week').format('YYYY-MM-DD 00:00:00'),
        dayjs().format('YYYY-MM-DD 23:59:59'),
      ];
      break;
    }
    case 'today': {
      return [
        dayjs().format('YYYY-MM-DD 00:00:00'),
        dayjs().format('YYYY-MM-DD 23:59:59'),
      ];
      break;
    }
    case 'yesterday': {
      return [
        dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD 23:59:59'),
      ];
      break;
    }
  }
};
