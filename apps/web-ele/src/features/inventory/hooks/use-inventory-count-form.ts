import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import { inventoryApi } from '../apis/inventory';
import { ElMessage } from 'element-plus';
import InventoryCountDrawer from '../components/inventory-count-drawer.vue';

export function useInventoryCountForm() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 表单数据
  const formData = ref({});

  // 表单Schema
  const formSchema = {
    type: 'object',
    properties: {
      warehouse_id: {
        type: 'string',
        title: "{{t('inventory.warehouseName')}}",
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectWarehouse')}}",
          options: [],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
      },
      count_type: {
        type: 'string',
        title: "{{t('inventory.countType')}}",
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectCountType')}}",
          options: [
            { label: "{{t('inventory.fullCount'), value: 'FULL' },
            { label: "{{t('inventory.partialCount'), value: 'PARTIAL' },
          ],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
      },
      remark: {
        type: 'string',
        title: "{{t('inventory.remark')}}",
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseInputRemark')}}",
          rows: 3,
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
      },
    },
  };

  // 使用抽屉
  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: InventoryCountDrawer,
    title: "{{t('inventory.addCount')}}",
    width: '60%',
    formSchema,
    formData,
    onSubmit: async (data) => {
      try {
        const params = {
          ...data,
          merchant_id: merchantId,
        };
        if (data.id) {
          await inventoryApi.updateCount(data.id, params);
          ElMessage.success(t('inventory.countUpdatedSuccessfully'));
        } else {
          await inventoryApi.createCount(params);
          ElMessage.success(t('inventory.countCreatedSuccessfully'));
        }
        drawerApi.value?.close();
        return true;
      } catch (error) {
        ElMessage.error(t('inventory.countCreateFailed'));
        return false;
      }
    },
  });

  return {
    Drawer,
    drawerApi,
    formSchema,
    formData,
  };
}