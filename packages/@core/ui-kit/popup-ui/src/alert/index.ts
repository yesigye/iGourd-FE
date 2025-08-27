export type {
  AlertProps,
  BeforeCloseScope,
  IconType,
  PromptProps,
} from './alert';
export { useAlertContext } from './alert';
export { default as Alert } from './alert.vue';
export {
  igourdAlert as alert,
  clearAllAlerts,
  igourdConfirm as confirm,
  igourdPrompt as prompt,
} from './AlertBuilder';
