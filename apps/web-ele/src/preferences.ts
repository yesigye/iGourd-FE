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
    contentPadding: 4,
    contentPaddingLeft: 0,
  },
  logo: {
    fit: 'fill',
    source: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  breadcrumb: {
    enable: false,
  },
  sidebar: {
    autoActivateChild: false,
    collapsedButton: false,
    collapsed: false,
    extraCollapse: false,
    expandOnHover: true,
    collapsedShowTitle: false,
    fixedButton: false,
    width: 120,
    icon: false,
    filter: true,
    popover: true,
  },
  tabbar: {
    postion: 'breadcrumb',
    showMaximize: false,
    showMore: false,
    showIcon: false,
  },
  header: {
    height: 40,
  },
  theme: {
    mode: 'light',
    builtinType: 'default',
    colorPrimary: 'hsl(205 100% 53%)',
    colorSuccess: 'hsl(100 54% 39%)',
    colorDestructive: 'hsl(0 48% 55%)',
    colorWarning: 'hsl(36 59% 45%)',
    radius: '0.25',
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
