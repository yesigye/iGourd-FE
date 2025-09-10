import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface AccountCollectionVoucherFormData {
  customer_id: string;
  payer_name: string;
  remark: string;
  receipt_time: string;
  attachment_url: Array<{
    name: string;
    url: string;
  }>;
  formilySelectSourceOrder: Record<
    string,
    {
      data: {
        id: string;
        order_no: string;
        total_paid_amount: string;
        repaid_amount: string;
        remaining_amount: string;
        order_create_time: string;
        business_type: string;
        collect_amount: string;
      };
      paySchema: Array<{
        collected_account: string;
        collected_amount: string;
        collected_method: string;
      }>;
    }
  >;
  receivable_balance: string;
  last_debt: string;
  business_type: string;
  merchant_id: string;
}

export function useAccountCollectionVoucherForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的收款凭证表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.basicInformation')}}",
          defaultOpen: true,
        },
        properties: {
          customer_id: {
            type: 'string',
            title: "{{t('account.customer')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectCustomer')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectCustomer')}}",
              },
            ],
          },
          payer_name: {
            type: 'string',
            title: "{{t('account.payerName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterPayerName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterPayerName')}}",
              },
            ],
          },
          receipt_time: {
            type: 'string',
            title: "{{t('account.receiptTime')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectReceiptTime')}}",
              type: 'datetime',
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectReceiptTime')}}",
              },
            ],
          },
        },
      },

      // 订单选择部分
      orderSelection: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.orderSelection')}}",
          defaultOpen: true,
        },
        properties: {
          formilySelectSourceOrder: {
            type: 'object',
            title: "{{t('account.selectSourceOrder')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'FormilySelectSourceOrderForm',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectSourceOrder')}}",
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectSourceOrder')}}",
              },
            ],
          },
        },
      },

      // 金额统计部分
      amountSummary: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.amountSummary')}}",
          defaultOpen: true,
        },
        properties: {
          receivable_balance: {
            type: 'string',
            title: "{{t('account.receivableBalance')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666', fontWeight: 'bold' },
            },
          },
          last_debt: {
            type: 'string',
            title: "{{t('account.lastDebt')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666', fontWeight: 'bold' },
            },
          },
        },
      },

      // 附件部分
      attachmentConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.attachment')}}",
          defaultOpen: false,
        },
        properties: {
          attachment_url: {
            type: 'array',
            title: "{{t('account.attachment')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'FormilyUpload',
            'x-component-props': {
              multiple: true,
              accept: '*',
            },
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: "{{t('account.fileName')}}",
                },
                url: {
                  type: 'string',
                  title: "{{t('account.fileUrl')}}",
                },
              },
            },
          },
        },
      },

      // 备注部分
      remarkConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.remark')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('account.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('account.pleaseEnterRemark')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    scope: {},
    schema: formSchema,
    initialValues: {
      customer_id: '',
      payer_name: '',
      remark: '',
      receipt_time: '',
      attachment_url: [],
      formilySelectSourceOrder: {},
      receivable_balance: '0',
      last_debt: '0',
      business_type: '',
      merchant_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: AccountCollectionVoucherFormData) => {
    try {
      // 处理订单数据
      const receiptOrderItemList: any[] = [];
      let totalAmount = 0;

      Object.values(values.formilySelectSourceOrder).forEach((item: any) => {
        totalAmount += parseFloat(item.data?.collect_amount || '0');
        item.paySchema.forEach((pay: any) => {
          receiptOrderItemList.push({
            account_id: pay.collected_account,
            amount: pay.collected_amount,
            business_id: item.data?.id,
            business_type: item.data?.business_type,
            payment_method_mark: pay.collected_method,
            remark: item.data?.remark || '',
          });
        });
      });

      const payload = {
        ...values,
        total_amount: totalAmount.toString(),
        received_amount: totalAmount.toString(),
        receipt_order_item_list: receiptOrderItemList,
        attachment_url:
          values.attachment_url?.map((item) => item.url).join(',') || '',
      };

      // 调用 API
      const response =
        await accountApi.createCollectionVoucher(payload);
      return response;
    } catch (error) {
      console.error('Account collection voucher form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formAPI.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<AccountCollectionVoucherFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values;
  };

  // 获取客户列表
  const getCustomerList = async () => {
    try {
      const response = await accountApi.getCustomerList({});
      return response;
    } catch (error) {
      console.error('Get customer list error:', error);
      throw error;
    }
  };

  // 获取收款凭证详情
  const getCollectionVoucherDetail = async (voucherId: string) => {
    try {
      const response = await accountApi.getCollectionVoucherDetail(voucherId);
      return response;
    } catch (error) {
      console.error('Get collection voucher detail error:', error);
      throw error;
    }
  };

  // 计算金额统计
  const calculateAmountSummary = (orders: Record<string, any>) => {
    let totalAmount = 0;
    let repaidAmount = 0;

    Object.values(orders).forEach((order) => {
      if (order?.data) {
        totalAmount += parseFloat(order.data.total_paid_amount || '0');
        repaidAmount += parseFloat(order.data.repaid_amount || '0');
      }
    });

    return {
      receivable_balance: totalAmount.toString(),
      last_debt: (totalAmount - repaidAmount).toString(),
    };
  };

  return {
    // 组件
    Form,
    formAPI,

    // 配置
    formSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    getCustomerList,
    getCollectionVoucherDetail,
    calculateAmountSummary,
  };
}
