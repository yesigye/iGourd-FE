import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { InventoryService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useInventoryLastReviewDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 盘点信息
      reviewInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.reviewInfo')}}",
          defaultOpen: true,
        },
        properties: {
          reviewDate: {
            type: 'string',
            title: "{{t('inventory.reviewDate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          reviewType: {
            type: 'string',
            title: "{{t('inventory.reviewType')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          warehouse: {
            type: 'string',
            title: "{{t('inventory.warehouse')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          reviewer: {
            type: 'string',
            title: "{{t('inventory.reviewer')}}",
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

      // 盘点结果
      reviewResult: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.reviewResult')}}",
          defaultOpen: true,
        },
        properties: {
          totalProducts: {
            type: 'number',
            title: "{{t('inventory.totalProducts')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          checkedProducts: {
            type: 'number',
            title: "{{t('inventory.checkedProducts')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          discrepancyCount: {
            type: 'number',
            title: "{{t('inventory.discrepancyCount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff0000', fontWeight: 'bold' },
            },
          },
          discrepancyAmount: {
            type: 'number',
            title: "{{t('inventory.discrepancyAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff0000', fontWeight: 'bold' },
            },
          },
        },
      },

      // 处理意见
      handleOpinion: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.handleOpinion')}}",
          defaultOpen: true,
        },
        properties: {
          opinion: {
            type: 'string',
            title: "{{t('inventory.opinion')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('inventory.pleaseEnterOpinion')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 4,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterOpinion')}}",
              },
            ],
          },
          handleStatus: {
            type: 'string',
            title: "{{t('inventory.handleStatus')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectHandleStatus')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('inventory.approved')}}", value: 'APPROVED' },
              { label: "{{t('inventory.rejected')}}", value: 'REJECTED' },
              { label: "{{t('inventory.pending')}}", value: 'PENDING' },
            ],
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectHandleStatus')}}",
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
      reviewDate: '',
      reviewType: '',
      warehouse: '',
      reviewer: '',
      totalProducts: 0,
      checkedProducts: 0,
      discrepancyCount: 0,
      discrepancyAmount: 0,
      opinion: '',
      handleStatus: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('inventory.lastReview')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await InventoryService.handleReview(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('处理盘点失败:', error);
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
      // 加载盘点数据
      loadReviewData(data.currentId);
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const loadReviewData = async (reviewId: string) => {
    try {
      const res = await InventoryService.getReviewDetail(reviewId);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues(res.data);
      }
    } catch (error) {
      console.error('加载盘点数据失败:', error);
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
