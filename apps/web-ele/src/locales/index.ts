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
  i18n,
  loadLocalesMapFromDir,
} from '@igourd/locales';
import { preferences } from '@igourd/preferences';

// import { useAccessStore } from "@igourd/stores"

import dayjs from 'dayjs';
import enLocale from 'element-plus/es/locale/lang/en';
import defaultLocale from 'element-plus/es/locale/lang/zh-cn';
import { getLocaleApi } from '#/api';

const elementLocale = ref<Language>(defaultLocale);

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
  return appLocaleMessages?.default;
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
    "zh_CN": "zh-CN",
    "en": "en-US",
    "fr": "fr"
  }
  //@ts-ignore
  return map[key]
}
async function loadRemoteLocale(params: Record<string, any>) {
  const data = await getLocaleApi(params)
  console.log(i18n.global.locale.value)
  Object.entries(data).forEach(([key, value]: [string, Record<string, Record<string, any>>]) => {
    const messages = Object.values(value).reduce((pre, current) => {
      return Object.assign(pre, current)
    }, {} as Record<string, any>)

    i18n.global.mergeLocaleMessage(resolveRemoteLocaleKey(key), messages)
  })
  console.log(i18n.global.getLocaleMessage(i18n.global.locale.value))
  return data
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

export { $t, elementLocale, setupI18n, loadRemoteLocale };
