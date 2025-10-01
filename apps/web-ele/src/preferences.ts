import { defineOverridesPreferences } from '@igourd/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    accessMode: 'backend',
    enablePreferences: false,
    defaultHomePath: '/home',
    persistence: false,
  },

  breadcrumb: {
    enable: false,
  },
  sidebar: {
    collapsed: true,
    expandOnHover: true,
    collapsedShowTitle: true,
    fixedButton: false,
  },
  tabbar: {
    postion: 'breadcrumb',
    showMaximize: false,
    showMore: true,
  },
  theme: {
    mode: 'auto',
    builtinType: 'default',
    colorPrimary: 'hsl(212 100% 45%)',
    radius: '0',
    semiDarkSidebar: true,
  },
  widget: {
    globalSearch: false,
    notification: false,
    sidebarToggle: false,
    themeToggle: false,
    languageToggle: false,
    fullscreen: false,
    lockScreen: false,
    refresh: false,
  },
  shortcutKeys: {
    enable: false,
    globalLogout: false,
    globalSearch: false,
  },
});
