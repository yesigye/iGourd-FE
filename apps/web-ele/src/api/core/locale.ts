import { requestClient } from '#/api/request';

type typeKey = 'en' | 'fr' | 'zh_CN';

export async function getLocaleApi(data: Record<string, any>) {
  return requestClient
    .post<
      Record<typeKey, { MERCHANT_MANAGE_WEB_PC: Record<string, string> }>
    >('/v1/passport/menu/language/list', data)
    .then((res) => {
      // eslint-disable-next-line unicorn/no-array-reduce
      return Object.keys(res).reduce(
        (acc, key: string) => {
          acc[key] = res[key as typeKey].MERCHANT_MANAGE_WEB_PC;
          return acc;
        },
        {} as Record<string, any>,
      );
    });
}
