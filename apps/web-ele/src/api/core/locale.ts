
import { requestClient } from '#/api/request';

export async function getLocaleApi(data: Record<string, any>) {
  return requestClient.post<Record<string, any>>('/v1/passport/menu/language/list',data);
}
