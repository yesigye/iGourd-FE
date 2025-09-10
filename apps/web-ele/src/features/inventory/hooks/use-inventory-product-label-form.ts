import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { inventoryApi } from '../apis';

export function useInventoryProductLabelForm() {
  const { t } = useI18n();
  
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('inventory.labelName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterLabelName')}}",
          maxlength: 50,
          showWordLimit: true,
        },
      },
      color: {
        type: 'string',
        title: "{{t('inventory.labelColor')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectColor')}}",
        },
      },
      description: {
        type: 'string',
        title: "{{t('inventory.labelDescription')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterLabelDescription')}}",
          rows: 3,
          maxlength: 200,
          showWordLimit: true,
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('./inventory-product-label-drawer.vue'),
  });

  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    onSubmit: async (values) => {
      try {
        if (values.id) {
          await inventoryApi.updateProductLabel(values);
        } else {
          await inventoryApi.createProductLabel(values);
        }
        drawerApi.close();
        // 刷新列表
        window.location.reload();
      } catch (error) {
        console.error('保存失败:', error);
      }
    },
  });

  return {
    Drawer,
    Form,
    formApi,
    drawerApi,
  };
}