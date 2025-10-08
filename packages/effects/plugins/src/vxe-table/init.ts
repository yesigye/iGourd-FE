import type { SetupVxeTable } from './types';

import { defineComponent, watch } from 'vue';

import { usePreferences } from '@igourd/preferences';

import {
  VxeButton,
  VxeCheckbox,
  VxeIcon,
  VxeInput,
  VxeLoading,
  VxeModal,
  VxeNumberInput,
  VxePager,
  VxePrint,
  VxeRadioGroup,
  VxeSelect,
  VxeTooltip,
  VxeUI,
  VxeUpload,
  // VxeSwitch,
  // VxeTextarea,
} from 'vxe-pc-ui';
import enUS from 'vxe-pc-ui/es/language/en-US';
import frFR from 'vxe-pc-ui/es/language/fr-FR';
// 导入默认的语言
import zhCN from 'vxe-pc-ui/es/language/zh-CN';
import {
  VxeColgroup,
  VxeColumn,
  VxeGrid,
  VxeTable,
  VxeToolbar,
} from 'vxe-table';

import { extendsDefaultFormatter } from './extends';

// 是否加载过
let isInit = false;

// 部分组件，如果没注册，vxe-table 会报错，这里实际没用组件，只是为了不报错，同时可以减少打包体积
const createVirtualComponent = (name = '') => {
  return defineComponent({
    name,
  });
};

export function initVxeTable() {
  if (isInit) {
    return;
  }
  // 后续需要替换成为自己的
  VxeUI.component(VxeTable);
  VxeUI.component(VxeColumn);
  VxeUI.component(VxeColgroup);
  VxeUI.component(VxeGrid);
  VxeUI.component(VxeToolbar);
  VxeUI.component(VxeButton);
  VxeUI.component(VxeCheckbox);
  VxeUI.component(VxePrint);
  VxeUI.component(createVirtualComponent('VxeForm'));
  VxeUI.component(VxeIcon);
  VxeUI.component(VxeInput);
  VxeUI.component(VxeLoading);
  VxeUI.component(VxeModal);
  VxeUI.component(VxeNumberInput);
  VxeUI.component(VxePager);
  VxeUI.component(VxeRadioGroup);
  VxeUI.component(VxeSelect);
  VxeUI.component(VxeTooltip);
  VxeUI.component(VxeUpload);

  isInit = true;
}

export function setupIgourdVxeTable(setupOptions: SetupVxeTable) {
  const { configVxeTable } = setupOptions;

  initVxeTable();
  // useTableForm = useIgourdForm;

  const { isDark, locale } = usePreferences();

  const localMap = {
    'zh-CN': zhCN,
    'en-US': enUS,
    'fr-FR': frFR,
  };

  watch(
    [() => isDark.value, () => locale.value],
    ([isDarkValue, localeValue]) => {
      VxeUI.setTheme(isDarkValue ? 'dark' : 'light');
      VxeUI.setI18n(localeValue, localMap[localeValue]);
      VxeUI.setLanguage(localeValue);
    },
    {
      immediate: true,
    },
  );

  extendsDefaultFormatter(VxeUI);

  configVxeTable(VxeUI);
}
