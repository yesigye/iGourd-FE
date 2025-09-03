/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = import.meta.env.VITE_APP_LOGIN_PATH;

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'fr' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: 'Français',
    value: 'fr',
  },
];

/**
 * 应用配置常量
 */
export const APP_CONFIG = {
  /** 应用类型 */
  APP_KEYS: {
    BOSS_MANAGE_WEB_PC: 'BOSS_MANAGE_WEB_PC',
    CUSTOMER_APP: 'CUSTOMER_APP',
    CUSTOMER_WEB_PC: 'CUSTOMER_WEB_PC',
    MERCHANT_MANAGE_APP: 'MERCHANT_MANAGE_APP',
    MERCHANT_MANAGE_WEB_PC: 'MERCHANT_MANAGE_WEB_PC',
    MERCHANT_POS_PC: 'MERCHANT_POS_PC',
  } as const,

  /** 用户账号类型 */
  ACCOUNT_TYPES: {
    EMAIL: 'EMAIL',
    LOGIN_ID: 'LOGIN_ID',
    PHONE_NUMBER: 'PHONE_NUMBER',
    WECHAT_OPENID: 'WECHAT_OPENID',
    WHATS_APP_OPENID: 'WHATS_APP_OPENID',
  } as const,

  /** 平台身份类型 */
  OWNER_TYPES: {
    BOSS: 'BOSS',
    CUSTOMER: 'CUSTOMER',
    MERCHANT: 'MERCHANT',
    PARTNER: 'PARTNER',
  } as const,

  /** 默认应用配置 */
  DEFAULT_APP: {
    app_key: 'MERCHANT_MANAGE_WEB_PC',
    type: 'LOGIN_ID' as const,
  },
} as const;

export type AppKey =
  (typeof APP_CONFIG.APP_KEYS)[keyof typeof APP_CONFIG.APP_KEYS];
export type AccountType =
  (typeof APP_CONFIG.ACCOUNT_TYPES)[keyof typeof APP_CONFIG.ACCOUNT_TYPES];
export type OwnerType =
  (typeof APP_CONFIG.OWNER_TYPES)[keyof typeof APP_CONFIG.OWNER_TYPES];
