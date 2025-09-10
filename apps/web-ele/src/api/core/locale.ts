import { requestClient } from '#/api/request';
import type { SupportedLanguagesType } from '@igourd/locales';
type typeKey = 'zh_CN' | 'en' | 'fr';

const supportLanguageMap: Record<typeKey, SupportedLanguagesType> = {
  zh_CN: 'zh-CN',
  en: 'en-US',
  fr: 'fr-FR',
};

export async function getLocaleApi(data: Record<string, any>) {
  return requestClient
    .post<
      Record<typeKey, { MERCHANT_MANAGE_WEB_PC: Record<string, string> }>
    >('/v1/passport/menu/language/list', data)
    .then((res) => {
      return Object.keys(res).reduce(
        (acc, key) => {
          const mappedKey = supportLanguageMap[key as typeKey];
          acc[mappedKey as SupportedLanguagesType] =
            res[key as typeKey].MERCHANT_MANAGE_WEB_PC;
          return acc;
        },
        {} as Record<SupportedLanguagesType, any>,
      );
    });
}
