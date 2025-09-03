/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable unicorn/no-array-reduce */
import type { Language } from 'element-plus/es/locale';

import type { App } from 'vue';

import type {
  LocaleSetupOptions,
  SupportedLanguagesType,
} from '@igourd/locales';

import { ref } from 'vue';

import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@igourd/locales';
import { preferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

// import { useAccessStore } from "@igourd/stores"
import dayjs from 'dayjs';
import enLocale from 'element-plus/es/locale/lang/en';
import defaultLocale from 'element-plus/es/locale/lang/zh-cn';

import { getLocaleApi } from '#/api';

const elementLocale = ref<Language>(defaultLocale);

// @ts-ignore
const modules = import.meta.glob('./langs/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);
/**
 * 加载应用特有的语言包
 * 这里也可以改造为从服务端获取翻译数据
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const [appLocaleMessages] = await Promise.all([
    localesMap[lang]?.(),
    loadThirdPartyMessage(lang),
  ]);
  const message = await loadRemoteLocale(lang);
  return Object.assign(appLocaleMessages?.default || {}, message);
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadElementLocale(lang), loadDayjsLocale(lang)]);
}
function resolveRemoteLocaleKey(key: string) {
  const map = {
    'zh-CN': 'zh_CN',
    'en-US': 'en',
    fr: 'fr',
  };
  // @ts-ignore
  return map[key];
}
async function loadRemoteLocale(lang: SupportedLanguagesType) {
  const { currentLoginUserApp } = useUserStore();
  const params = {
    user_id: currentLoginUserApp.user_id,
    owner_id: currentLoginUserApp.owner_id,
    owner_type: currentLoginUserApp.owner_type,
    app_key: import.meta.env.VITE_APP_APP_KEY,
  };
  const data = await getLocaleApi(params);
  const key = resolveRemoteLocaleKey(lang);
  const value = data[key] as Record<string, Record<string, string>>;
  const messages = Object.values(value).reduce(
    (pre, current) => {
      return Object.assign(pre, current);
    },
    {} as Record<string, any>,
  );
  return messages;
}
/**
 * 加载dayjs的语言包
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale;
  switch (lang) {
    case 'en-US': {
      locale = await import('dayjs/locale/en');
      break;
    }
    case 'zh-CN': {
      locale = await import('dayjs/locale/zh-cn');
      break;
    }
    // 默认使用英语
    default: {
      locale = await import('dayjs/locale/en');
    }
  }
  if (locale) {
    dayjs.locale(locale);
  } else {
    console.error(`Failed to load dayjs locale for ${lang}`);
  }
}

/**
 * 加载element-plus的语言包
 * @param lang
 */
async function loadElementLocale(lang: SupportedLanguagesType) {
  switch (lang) {
    case 'en-US': {
      elementLocale.value = enLocale;
      break;
    }
    case 'zh-CN': {
      elementLocale.value = defaultLocale;
      break;
    }
  }
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  });
}

export { $t, elementLocale, loadRemoteLocale, setupI18n };
