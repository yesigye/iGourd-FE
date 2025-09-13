import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { InventoryService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useInventoryTransferAuditDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 调拨信息
      transferInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.transferInfo')}}",
          defaultOpen: true,
        },
        properties: {
          transferNo: {
            type: 'string',
            title: "{{t('inventory.transferNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          fromWarehouse: {
            type: 'string',
            title: "{{t('inventory.fromWarehouse')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          toWarehouse: {
            type: 'string',
            title: "{{t('inventory.toWarehouse')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          transferDate: {
            type: 'string',
            title: "{{t('inventory.transferDate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
        },
      },

      // 审核信息
      auditInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.auditInfo')}}",
          defaultOpen: true,
        },
        properties: {
          auditOpinion: {
            type: 'string',
            title: "{{t('inventory.auditOpinion')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('inventory.pleaseEnterAuditOpinion')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 4,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterAuditOpinion')}}",
              },
            ],
          },
          auditStatus: {
            type: 'string',
            title: "{{t('inventory.auditStatus')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectAuditStatus')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('inventory.approved'), value: 'APPROVED' },
              { label: "{{t('inventory.rejected'), value: 'REJECTED' },
              { label: "{{t('inventory.pending'), value: 'PENDING' },
            ],
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectAuditStatus')}}",
              },
            ],
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      transferNo: '',
      fromWarehouse: '',
      toWarehouse: '',
      transferDate: '',
      auditOpinion: '',
      auditStatus: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('inventory.transferAudit')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await InventoryService.auditTransfer(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('审核调拨失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    title?: string;
    disabled?: boolean;
    currentId?: string;
    handleMerchantId?: string;
    handleMerchantType?: string;
    handleTransferType?: string;
    handleMerchantStatus?: string;
  }) => {
    if (data.currentId) {
      // 加载调拨数据
      loadTransferData(data.currentId);
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const loadTransferData = async (transferId: string) => {
    try {
      const res = await InventoryService.getTransferDetail(transferId);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues(res.data);
      }
    } catch (error) {
      console.error('加载调拨数据失败:', error);
    }
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
