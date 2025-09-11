/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 igourd-form、igourd-modal、igourd-drawer 等组件使用,
 */

import type { Component } from 'vue';

import {
  ApiComponent,
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  Editable,
  ArrayTabs,
  Cascader,
  Checkbox,
  DatePicker,
  ElButton,
  ElNotification,
  Form,
  FormButtonGroup,
  FormCollapse,
  FormDialog,
  FormDrawer,
  FormGrid,
  FormItem,
  FormLayout,
  FormStep,
  FormTab,
  globalShareState,
  Input,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  setupIgourdForm,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
  Upload,
} from '@igourd/common-ui';

import '@igourd/common-ui/style';

async function initComponentAdapter() {
  const components: Partial<Record<string, Component>> = {
    ArrayCards,
    ArrayCollapse,
    ArrayItems,
    ArrayTable,
    ArrayTabs,
    Cascader,
    Editable,
    Checkbox,
    DatePicker,
    Form,
    FormButtonGroup,
    FormCollapse,
    FormDialog,
    FormDrawer,
    FormGrid,
    FormItem,
    FormLayout,
    FormStep,
    FormTab,
    Input,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Space,
    Submit,
    Switch,
    TimePicker,
    Transfer,
    Upload,
    ApiComponent,
    Button: ElButton,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      ElNotification({
        title,
        message: content,
        position: 'bottom-right',
        duration: 0,
        type: 'success',
      });
    },
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setupIgourdForm({ components });
}

export { initComponentAdapter };
