export type Locale = 'en-US' | 'fr-FR' | 'zh-CN';

export const messages: Record<Locale, Record<string, string>> = {
  'en-US': {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    prompt: 'Prompt',
    reset: 'Reset',
    submit: 'Submit',
    search: 'Search',
  },
  'zh-CN': {
    cancel: '取消',
    collapse: '收起',
    confirm: '确认',
    expand: '展开',
    prompt: '提示',
    reset: '重置',
    submit: '提交',
    search: '搜索',
  },
  'fr-FR': {
    cancel: 'Annuler',
    collapse: 'Réduire',
    confirm: 'Confirmer',
    expand: 'Développer',
    prompt: 'Alerte',
    reset: 'Réinitialiser',
    submit: 'Soumettre',
    search: 'Recherche',
  },
};

export const getMessages = (locale: Locale) => messages[locale];
