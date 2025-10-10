import type { CSSProperties } from 'vue';

import type { PropType, Recordable } from '#/common/typeing';
// import {  } from "@igourd/locales"

export const footerProps = {
  class: { type: String },
  confirmLoading: { type: Boolean },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: {
    type: String,
    default: 'messages.elementPlus.cancelText',
  },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: true },
  okButtonProps: Object as PropType<Recordable>,
  okText: { type: String, default: 'messages.elementPlus.okText' },
  okType: { type: String as any, default: 'primary' },
  showFooter: { type: Boolean },
  footerHeight: {
    type: [String, Number] as PropType<number | string>,
    default: 88,
  },
};
export const basicProps = {
  appendToBody: { type: Boolean, default: true },
  isDetail: { type: Boolean },
  helpMessage: { type: String, default: '' },
  showClose: { type: Boolean, default: false },
  title: { type: String, default: '' },
  loadingText: { type: String },
  showDetailBack: { type: Boolean, default: true },
  open: { type: Boolean },
  loading: { type: Boolean },
  maskClosable: { type: Boolean, default: true },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  destroyOnClose: { type: Boolean, default: true },
  scrollViewStyle: {
    type: [Object, String] as PropType<CSSProperties | string>,
  },
  ...footerProps,
};
