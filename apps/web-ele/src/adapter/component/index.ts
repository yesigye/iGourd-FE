/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 igourd-form、igourd-modal、igourd-drawer 等组件使用,
 */

import type { Component, FunctionalComponent } from 'vue';

import {
  ApiComponent,
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  ArrayTabs,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  Editable,
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
  // ScanCodeEntry,
  Select,
  setupIgourdForm,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
} from '@igourd/common-ui';
import '@igourd/common-ui/style';

import { ProductSelect, ProductTable } from '#/components';

import Upload from './upload';

async function initComponentAdapter() {
  const components: Partial<Record<string, Component | FunctionalComponent>> = {
    Card,
    ArrayCards,
    ArrayCollapse,
    ArrayItems,
    ArrayTable,
    ArrayTabs,
    Cascader,
    // ScanCodeEntry,
    ProductSelect,
    ProductTable,
    Editable,
    Checkbox,
    Upload,
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
