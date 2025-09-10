import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { inventoryApi } from '../apis';

export function useInventoryProductGroupForm() {
  const { t } = useI18n();
  
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      add_type: {
        type: 'number',
        title: "{{t('inventory.addType')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('inventory.parentGroup')}}", value: 0 },
            { label: "{{t('inventory.productGroup')}}", value: 1 },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'parent_id.visible': '{{$self.value === 1}}',
              },
            },
          },
        ],
      },
      parent_id: {
        type: 'string',
        title: "{{t('inventory.parentGroup')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectParentGroup')}}",
          filterable: true,
          clearable: true,
        },
      },
      major_name: {
        type: 'string',
        title: "{{t('inventory.majorGroup')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterMajorGroup')}}",
          maxlength: 50,
          showWordLimit: true,
        },
      },
      minor_name: {
        type: 'string',
        title: "{{t('inventory.minorGroup')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterMinorGroup')}}",
          maxlength: 50,
          showWordLimit: true,
        },
      },
      remark: {
        type: 'string',
        title: "{{t('common.remark')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterRemark')}}",
          rows: 3,
          maxlength: 500,
          showWordLimit: true,
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('./inventory-product-group-drawer.vue'),
  });

  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    onSubmit: async (values) => {
      try {
        if (values.id) {
          await inventoryApi.updateProductGroup(values);
        } else {
          await inventoryApi.createProductGroup(values);
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