import type { FormItemRule, FormRules } from 'element-plus';

import { useI18n } from '@igourd/locales';

export const useVaidateHooks = () => {
  const { t } = useI18n();

  const specialChars = /[！~#^`<>+=|?/]/g;

  const replaceSymbol = (str: string, reg?: RegExp) => {
    return str.replace(reg || specialChars, '');
  };

  // // 特殊字符校验
  // const validateSymbolRules: FormItemRule[] = [
  //   { pattern: specialChars, message: t('common.validateSymbol'), trigger: 'blur' }
  // ];

  const validateSymbolCallback = (
    _: FormRules,
    value: string,
    callback: (errorMessage?: string) => void,
  ) => {
    if (specialChars.test(value)) return callback(t('common.validateSymbol'));
    return callback();
  };

  const validateSymbolRules: FormItemRule[] = [
    { validator: validateSymbolCallback, trigger: 'blur' },
  ];

  return {
    replaceSymbol,
    validateSymbolRules,
  };
};
