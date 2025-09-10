import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import type { ISchema } from '@igourd/common-ui';

export function useCheckBoxModalDrawer() {
  const { t } = useI18n();
  const selectedValues = ref<any[]>([]);
  const options = ref<Array<{ label: string; value: any }>>([]);
  const onConfirmCallback = ref<((values: any[]) => void) | null>(null);

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      selectedValues: {
        type: 'array',
        title: "{{t('inventory.selectItems')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Checkbox.Group',
        'x-component-props': {
          options: options.value,
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      selectedValues: [],
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('inventory.selectItems')}}",
    width: '400px',
    onConfirm: () => {
      const values = formApi.getValues().selectedValues || [];
      if (onConfirmCallback.value) {
        onConfirmCallback.value(values);
      }
      drawerApi.close();
      return true;
    },
    onCancel: () => {
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    title?: string;
    options?: Array<{ label: string; value: string | number }>;
    initialSelected?: Array<string | number>;
    disableItems?: Array<string | number>;
    currentSpec?: any;
  }) => {
    options.value = data.options || [];
    onConfirmCallback.value = data.onConfirm || null;
    
    formApi.setValues({
      selectedValues: data.initialSelected || [],
    });
    
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
  };
}