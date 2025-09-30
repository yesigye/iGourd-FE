import { createIconifyIcon } from '@igourd-core/icons';

export * from './iconify';
export { default as EmptyIcon } from './icons/empty-icon.vue';
export * from './svg';

export const UploadOutlined = createIconifyIcon('ep:upload-filled');
export const Check = createIconifyIcon('ep:check');
export const Close = createIconifyIcon('ep:close');
export const EpArrayDown = createIconifyIcon('ep:arrow-down');
export const ArrowRight = createIconifyIcon('ep:arrow-right');
export const Filter = createIconifyIcon('ep:filter');
export const SquareMousePointer = createIconifyIcon(
  'lucide:square-mouse-pointer',
);
export const Tickets = createIconifyIcon('ep:tickets');
export const Warning = createIconifyIcon('ep:warning');
