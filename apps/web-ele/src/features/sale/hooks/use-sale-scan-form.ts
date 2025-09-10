import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface SaleScanFormData {
  remark: string;
  customer_id: string | null;
  device_id: string | null;
  merchant_id: string | null;
  order_holding: Array<{
    guider_id: string | null;
    order_holding_item_list: Array<{
      product_code: string;
      quantity: number;
      product_id: string;
      product_name: string;
      product_unit_id: string;
      product_unit_name: string;
      product_profile_photo?: string;
      cost_price: number;
      selling_price: number;
    }>;
  }>;
  device_code: string | null;
  pos_user_id: string | null;
  total_amount: number | null;
  selected_tags: string[];
}

export function useSaleScanForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的销售扫描对话框表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 备注信息部分
      remarkInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.remark')}}",
          defaultOpen: true,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('sales.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('sales.pleaseEnterRemark')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 6,
              style: { width: '500px' },
            },
          },
        },
      },

      // 快速标签部分
      quickTags: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.quickTags')}}",
          defaultOpen: true,
        },
        properties: {
          selected_tags: {
            type: 'array',
            title: "{{t('sales.selectedTags')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Checkbox.Group',
            'x-component-props': {
              options: [],
              style: { width: '500px' },
            },
          },
        },
      },

      // 订单信息部分
      orderInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.orderInformation')}}",
          defaultOpen: false,
        },
        properties: {
          customer_id: {
            type: 'string',
            title: "{{t('sales.customer')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectCustomer')}}",
              clearable: true,
            },
          },
          device_id: {
            type: 'string',
            title: "{{t('sales.device')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectDevice')}}",
              clearable: true,
            },
          },
          pos_user_id: {
            type: 'string',
            title: "{{t('sales.posUser')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectPosUser')}}",
              clearable: true,
            },
          },
          total_amount: {
            type: 'number',
            title: "{{t('sales.totalAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterTotalAmount')}}",
              min: 0,
              precision: 2,
              disabled: true,
            },
          },
        },
      },

      // 商品列表部分
      productList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.productList')}}",
          defaultOpen: false,
        },
        properties: {
          order_holding: {
            type: 'array',
            title: "{{t('sales.orderHolding')}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            items: {
              type: 'object',
              properties: {
                guider_id: {
                  type: 'string',
                  title: "{{t('sales.guider')}}",
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: "{{t('sales.pleaseSelectGuider')}}",
                    clearable: true,
                  },
                },
                order_holding_item_list: {
                  type: 'array',
                  title: "{{t('sales.orderHoldingItems')}}",
                  'x-component': 'ArrayTable',
                  'x-component-props': {
                    pagination: false,
                  },
                  items: {
                    type: 'object',
                    properties: {
                      product_code: {
                        type: 'string',
                        title: "{{t('sales.productCode')}}",
                        'x-component': 'Input',
                        'x-component-props': {
                          disabled: true,
                        },
                      },
                      product_name: {
                        type: 'string',
                        title: "{{t('sales.productName')}}",
                        'x-component': 'Input',
                        'x-component-props': {
                          disabled: true,
                        },
                      },
                      quantity: {
                        type: 'number',
                        title: "{{t('sales.quantity')}}",
                        'x-component': 'InputNumber',
                        'x-component-props': {
                          min: 0,
                          precision: 2,
                        },
                      },
                      selling_price: {
                        type: 'number',
                        title: "{{t('sales.sellingPrice')}}",
                        'x-component': 'InputNumber',
                        'x-component-props': {
                          min: 0,
                          precision: 2,
                        },
                      },
                      product_unit_name: {
                        type: 'string',
                        title: "{{t('sales.productUnit')}}",
                        'x-component': 'Input',
                        'x-component-props': {
                          disabled: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      remark: '',
      customer_id: null,
      device_id: null,
      merchant_id: null,
      order_holding: [],
      device_code: null,
      pos_user_id: null,
      total_amount: null,
      selected_tags: [],
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: SaleScanFormData) => {
    try {
      // 调用 API
      const response = await saleApi.orderSuspend(values);
      return response;
    } catch (error) {
      console.error('Sale scan form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formApi.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formApi.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<SaleScanFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取快速标签列表
  const getQuickTagList = async () => {
    try {
      const response = await saleApi.getQuickTagList();
      return response;
    } catch (error) {
      console.error('Get quick tag list error:', error);
      throw error;
    }
  };

  // 处理标签点击
  const handleTagClick = (tagItem: any, isSelected: boolean) => {
    const currentTags = formApi.getValues().selected_tags || [];
    if (isSelected) {
      // 添加标签
      const newTags = [...currentTags, tagItem.id];
      formApi.setFieldValue('selected_tags', newTags);

      // 更新备注
      const currentRemark = formApi.getValues().remark || '';
      const tagText = `  ${tagItem.category_name}:${tagItem.order_holding_tag_value}`;
      formApi.setFieldValue('remark', currentRemark + tagText);
    } else {
      // 移除标签
      const newTags = currentTags.filter((id: string) => id !== tagItem.id);
      formApi.setFieldValue('selected_tags', newTags);

      // 更新备注
      const currentRemark = formApi.getValues().remark || '';
      const tagText = `  ${tagItem.category_name}:${tagItem.order_holding_tag_value}`;
      const newRemark = currentRemark.replace(tagText, '');
      formApi.setFieldValue('remark', newRemark);
    }
  };

  // 检查标签是否选中
  const isTagSelected = (tagId: string) => {
    const currentTags = formApi.getValues().selected_tags || [];
    return currentTags.includes(tagId);
  };

  // 计算总金额
  const calculateTotalAmount = (goodsList: any[]) => {
    return goodsList.reduce((acc, cur) => {
      return acc + (cur.selling_price || 0) * (cur.quantity || 0);
    }, 0);
  };

  // 更新商品列表
  const updateProductList = (goodsList: any[]) => {
    const orderHoldingItemList = goodsList.map(item => ({
      product_code: item.code || '',
      quantity: item.calcInfo?.quantity || 0,
      product_id: item.id || '',
      product_name: item.major_name || '',
      product_unit_id: item.product_unit_id || '',
      product_unit_name: item.product_unit_name || '',
      product_profile_photo: item.profile_photo || '',
      cost_price: item.cost_price || 0,
      selling_price: item.selling_price || 0,
    }));

    formApi.setFieldValue('order_holding', [{
      guider_id: null,
      order_holding_item_list: orderHoldingItemList,
    }]);

    // 更新总金额
    const totalAmount = calculateTotalAmount(goodsList);
    formApi.setFieldValue('total_amount', totalAmount);
  };

  // 设置客户信息
  const setCustomerInfo = (customerInfo: any) => {
    formApi.setFieldValue('customer_id', customerInfo?.id || null);
  };

  // 设置导购信息
  const setGuiderInfo = (guiderInfo: any) => {
    formApi.setFieldValue('pos_user_id', guiderInfo?.user_id || null);
  };

  return {
    // 组件
    Form,
    formApi,

    // 配置
    formSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    getQuickTagList,
    handleTagClick,
    isTagSelected,
    calculateTotalAmount,
    updateProductList,
    setCustomerInfo,
    setGuiderInfo,
  };
}
