/* eslint-disable @typescript-eslint/ban-ts-comment */

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
  loadLocaleMessages,
  loadLocalesMapFromDir,
  mergeLocaleMessage,
} from '@igourd/locales';
import { preferences, updatePreferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

// import { useAccessStore } from "@igourd/stores"
import dayjs from 'dayjs';
import enLocale from 'element-plus/es/locale/lang/en';
import frLocal from 'element-plus/es/locale/lang/fr';
import defaultLocale from 'element-plus/es/locale/lang/zh-cn';

import { getLocaleApi } from '#/api';

let isLocaleLoaded = false;

const elementLocale = ref<Language>(defaultLocale);

// @ts-ignore
const modules = import.meta.glob('./langs/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);

// 加载 features 目录下的多语言文件
// @ts-ignore
const featureModules = import.meta.glob('../features/*/locales/**/*.json');

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
  // 合并核心语言文件、features 语言文件和远程语言文件
  return appLocaleMessages?.default;
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadElementLocale(lang), loadDayjsLocale(lang)]);
}

async function loadRemoteLocale() {
  if (isLocaleLoaded) return;
  const { currentLoginUserApp } = useUserStore();
  if (!currentLoginUserApp) return {};
  const params = {
    user_id: currentLoginUserApp.user_id,
    owner_id: currentLoginUserApp.owner_id,
    owner_type: currentLoginUserApp.owner_type,
    app_key: import.meta.env.VITE_APP_APP_KEY,
  };
  const data = await getLocaleApi(params);

  (Object.keys(data) as SupportedLanguagesType[]).forEach((key) => {
    mergeLocaleMessage(key, data[key]);
  });
  isLocaleLoaded = true;
  // return messages;
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
    case 'fr-FR': {
      locale = await import('dayjs/locale/fr');
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
    case 'fr-FR': {
      elementLocale.value = frLocal;
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

async function loadFeatureLocal(moduleName: string) {
  if (!moduleName) return;
  const regexp = new RegExp(`${moduleName}/locales/([^/]+)/(.*).json$`);
  const featureLocalesMap = loadLocalesMapFromDir(regexp, featureModules);
  Object.keys(featureLocalesMap).map(async (key) => {
    const message = await featureLocalesMap[key]?.();
    mergeLocaleMessage(key as SupportedLanguagesType, message?.default);
  });
}

async function updateLocale(value: string | undefined) {
  if (!value) return;
  const map = { fr: 'fr-FR', en: 'es-US', zh_CN: 'zh-CN' };
  let locale = 'en-US' as SupportedLanguagesType;
  if (Object.keys(map).includes(value)) {
    locale = map[value as keyof typeof map] as SupportedLanguagesType;
  } else if (['en-US', 'fr-FR', 'zh-CN'].includes(value)) {
    locale = value as SupportedLanguagesType;
  }
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}

export {
  $t,
  elementLocale,
  loadFeatureLocal,
  loadRemoteLocale,
  setupI18n,
  updateLocale,
};
