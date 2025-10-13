import { requestClient } from '#/api/request';

export function upload(data: any) {
  return requestClient.post(`/v1/resource/file-upload/upload`, data, {
    baseURL: import.meta.env.VITE_APP_API_UPLOAD_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300_000,
  });
}
