/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AxiosRequestConfig } from 'axios';

// @ts-ignore
import * as jsrsasign from 'jsrsasign/lib/jsrsasign.js';
// @ts-ignore
import md5 from 'md5';
import qs from 'qs';

interface SignOptions {
  PRIVATE_KEY: string;
}

const getSignatureBase = (message: string, PRIVATE_KEY: string) => {
  try {
    const NEW_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----${PRIVATE_KEY}-----END PRIVATE KEY-----`;
    const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
    sig.init(NEW_PRIVATE_KEY);
    sig.updateString(message);
    const s = sig.sign();
    const sign = jsrsasign.hextob64(s);
    return sign;
  } catch (error) {
    console.error(error);
    return '';
  }
};
function isDef(val: any) {
  return (
    val !== undefined && val !== null && val !== 'null' && val !== 'undefined'
  );
}
function getUrlParams(url: string, key?: string) {
  const aElement = document.createElement('a');
  aElement.setAttribute('href', url);
  if (key) {
    // @ts-ignore
    return aElement[key];
  }
  return [
    'hash',
    'host',
    'hostname',
    'href',
    'origin',
    'pathname',
    'port',
    'protocol',
    'search',
  ].reduce((origin, key) => {
    // @ts-ignore
    origin[key] = aElement[key];
    return origin;
  }, {});
}

const requestGET = (params: any) => {
  return qs.stringify(params);
};
const requestPOST = (data: any): any => {
  if (isDef(data)) {
    return typeof data === 'object' ? JSON.stringify(data) : data.toString();
  }
  return '';
};
export function getSignatureSummary(
  httpConfig: AxiosRequestConfig,
  options: SignOptions,
) {
  const headers = httpConfig.headers;
  if (!headers) {
    return '';
  }
  const hostParams = getUrlParams(`${httpConfig.baseURL}${httpConfig.url}`);
  // ========================================= //
  const HTTPMethod = httpConfig.method?.toLocaleUpperCase();
  const sendParams =
    HTTPMethod === 'POST'
      ? requestPOST(httpConfig.data)
      : requestGET(httpConfig.params);
  // ========================================= //
  const URL = hostParams.pathname;
  const XRequestDateClient = headers['X-request_date_client'];
  const XTimeZoneClient = headers['X-time_zone_client'];
  const XAppKey = headers['X-app_key'];
  const ContentMd5 = sendParams.length > 0 ? `${md5(sendParams)}_` : ''; // 参数为空时，不参与签名
  const ContentType = headers['Content-Type'];
  const secretKey = md5(options.PRIVATE_KEY);

  const summaryString = `${URL}_${XRequestDateClient}_${XTimeZoneClient}_${XAppKey}_${HTTPMethod}_${ContentMd5}${ContentType}_${secretKey}`; // _${secretKey}
  // console.log(`=========>summaryString`, summaryString);
  const signature = getSignatureBase(summaryString, options.PRIVATE_KEY);
  // console.log(`=========>signature`, signature)
  // console.log(`=========>verify signature`, verifySignature(summaryString, signature));

  return signature;
}
