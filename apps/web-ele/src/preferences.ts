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
    accessMode: 'mixed',
    enablePreferences: true,

  },

  breadcrumb: {
    showHome: true,
  },
  sidebar: {
    collapsed: true,
    expandOnHover: false,
  },
  theme: {
    builtinType: 'deep-green',
    colorPrimary: 'hsl(181 84% 32%)',
    mode: 'auto',
  },
  widget: {
    globalSearch: false,
    notification: false,
    sidebarToggle: false,
    themeToggle: true,
  },
});
