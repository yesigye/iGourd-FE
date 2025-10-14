import { createIconifyIcon } from '@igourd-core/icons';

export * from './iconify';
export { default as EmptyIcon } from './icons/empty-icon.vue';
export * from './svg';

export const UploadOutlined = createIconifyIcon('ep:upload-filled');
export const Check = createIconifyIcon('ep:check');
export const Close = createIconifyIcon('ep:close');
export const ArrayDown = createIconifyIcon('ep:arrow-down');
export const ArrowRight = createIconifyIcon('ep:arrow-right');
export const ArrowLeft = createIconifyIcon('ep:arrow-left');

export const Filter = createIconifyIcon('ep:filter');
export const SquareMousePointer = createIconifyIcon(
  'lucide:square-mouse-pointer',
);
export const Tickets = createIconifyIcon('ep:tickets');
export const Warning = createIconifyIcon('ep:warning');

export const RefreshRight = createIconifyIcon('ep:refresh-right');

export const Import = createIconifyIcon('ix:import');

export const Export = createIconifyIcon('ix:export');

export const Print = createIconifyIcon('ix:print');
export const CirclePlus = createIconifyIcon('ep:circle-plus');
export const Edit = createIconifyIcon('ep:edit');
export const Delete = createIconifyIcon('ep:delete');
export const Document = createIconifyIcon('ep:document');
