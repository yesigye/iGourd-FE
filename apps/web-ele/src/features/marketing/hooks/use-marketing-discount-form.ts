import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { marketingApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface MarketingDiscountFormData {
  type: string;
  channel: string;
  name: string;
  apply_vip: number;
  minimum_amount: number | null;
  reduce_amount: number | null;
  status: string;
  discount_percentage: number | null;
  rounding_off: string;
  rounding_amount: number | null;
  effective_time: string;
  expiration_time: string;
  cycle_type: string;
  active_day_hours: number[];
  active_month_days: number[];
  active_week_days: number[];
  exclude_dates: string[];
  relation_type: string;
  relation_product_group_id_list: string[];
  relation_product_id_list: string[];
  relation_product_label_id_list: string[];
  remark: string;
  merchant_id: string;
}

export function useMarketingDiscountForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的营销折扣表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('marketing.basicInformation')}}",
          defaultOpen: true,
        },
        properties: {
          type: {
            type: 'string',
            title: "{{t('marketing.promotiontype')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('marketing.discount'), value: 'DISCOUNT' },
                { label: "{{t('marketing.reduction'), value: 'REDUCTION' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('marketing.pleaseSelectType')}}",
              },
            ],
          },
          channel: {
            type: 'string',
            title: "{{t('marketing.scopeofapplication')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('marketing.store'), value: 'STORE' },
                { label: "{{t('marketing.onlineshop'), value: 'ONLINE_SHOP' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('marketing.pleaseSelectChannel')}}",
              },
            ],
          },
          name: {
            type: 'string',
            title: "{{t('marketing.promotionalname')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('marketing.pleaseInputPromotionalName')}}",
              maxlength: 40,
              clearable: true,
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('marketing.pleaseEnterName')}}",
              },
            ],
          },
          apply_vip: {
            type: 'number',
            title: "{{t('marketing.membersfoldove')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              activeValue: 1,
              inactiveValue: 0,
            },
          },
        },
      },

      // 折扣配置部分
      discountConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('marketing.discountConfig')}}",
          defaultOpen: true,
        },
        properties: {
          // 满减配置（当 type 为 REDUCTION 时显示）
          reductionConfig: {
            type: 'void',
            'x-component': 'FormCollapse',
            'x-component-props': {
              title: "{{t('marketing.reductionConfig')}}",
              defaultOpen: true,
            },
            'x-reactions': {
              dependencies: ['type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0] === "REDUCTION"}}',
                },
              },
            },
            properties: {
              minimum_amount: {
                type: 'number',
                title: "{{t('marketing.sumofconsumption')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: "{{t('marketing.pleaseInputMinimumAmount')}}",
                  min: 0,
                  style: { width: '500px' },
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('marketing.pleaseEnterMinimumAmount')}}",
                  },
                ],
              },
              reduce_amount: {
                type: 'number',
                title: "{{t('marketing.fulldeduction')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: "{{t('marketing.pleaseInputFullDeduction')}}",
                  min: 0,
                  style: { width: '500px' },
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('marketing.pleaseEnterReduceAmount')}}",
                  },
                ],
              },
              status: {
                type: 'string',
                title: "{{t('marketing.enable')}}",
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Switch',
                'x-component-props': {
                  activeValue: 'OPEN',
                  inactiveValue: 'CLOSE',
                },
              },
            },
          },

          // 折扣配置（当 type 为 DISCOUNT 时显示）
          discountPercentageConfig: {
            type: 'void',
            'x-component': 'FormCollapse',
            'x-component-props': {
              title: "{{t('marketing.discountPercentageConfig')}}",
              defaultOpen: true,
            },
            'x-reactions': {
              dependencies: ['type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0] === "DISCOUNT"}}',
                },
              },
            },
            properties: {
              discount_percentage: {
                type: 'number',
                title: "{{t('marketing.specialdiscount')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: "{{t('marketing.pleaseInputSpecialDiscount')}}",
                  min: 0,
                  max: 100,
                  style: { width: '500px' },
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('marketing.pleaseEnterDiscountPercentage')}}",
                  },
                ],
              },
              rounding_off: {
                type: 'string',
                title: "{{t('marketing.roundingOff')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('marketing.pleaseSelectRoundingOff')}}",
                  style: { width: '500px' },
                  options: [
                    { label: "{{t('marketing.roundhigh'), value: 'HIGH' },
                    { label: "{{t('marketing.roundmiddle'), value: 'MIDDLE' },
                    { label: "{{t('marketing.roundlow'), value: 'LOW' },
                  ],
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('marketing.pleaseSelectRoundingOff')}}",
                  },
                ],
              },
              rounding_amount: {
                type: 'number',
                title: "{{t('marketing.roundingAmount')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('marketing.pleaseSelectRoundingAmount')}}",
                  style: { width: '500px' },
                  options: [
                    { label: '0.001', value: 0.001 },
                    { label: '0.01', value: 0.01 },
                    { label: '0.1', value: 0.1 },
                    { label: '1', value: 1 },
                    { label: '10', value: 10 },
                    { label: '100', value: 100 },
                    { label: '1000', value: 1000 },
                  ],
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('marketing.pleaseEnterRoundingAmount')}}",
                  },
                ],
              },
            },
          },
        },
      },

      // 时间配置部分
      timeConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('marketing.timeConfig')}}",
          defaultOpen: true,
        },
        properties: {
          effective_time: {
            type: 'string',
            title: "{{t('marketing.effectiveTime')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('marketing.pleaseSelectEffectiveTime')}}",
              type: 'date',
              valueFormat: 'YYYY-MM-DD',
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('marketing.pleaseEnterEffectiveTime')}}",
              },
            ],
          },
          expiration_time: {
            type: 'string',
            title: "{{t('marketing.expirationTime')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('marketing.pleaseSelectExpirationTime')}}",
              type: 'date',
              valueFormat: 'YYYY-MM-DD',
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('marketing.pleaseEnterExpirationTime')}}",
              },
            ],
          },
        },
      },

      // 产品关联配置部分
      productRelationConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('marketing.productRelationConfig')}}",
          defaultOpen: true,
        },
        properties: {
          relation_type: {
            type: 'string',
            title: "{{t('marketing.selectormode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('marketing.allproduct'), value: 'ALL' },
                { label: "{{t('marketing.productgroup'), value: 'PRODUCT_GROUP' },
                { label: "{{t('marketing.productlabel'), value: 'PRODUCT_LABEL' },
                { label: "{{t('marketing.productName'), value: 'PRODUCT' },
              ],
            },
          },
        },
      },

      // 备注部分
      remarkConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('marketing.remark')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('marketing.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('marketing.pleaseInputRemark')}}",
              rows: 2,
              style: { width: '692px' },
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
      type: 'DISCOUNT',
      channel: 'STORE',
      name: '',
      apply_vip: 0,
      minimum_amount: null,
      reduce_amount: null,
      status: 'OPEN',
      discount_percentage: null,
      rounding_off: '',
      rounding_amount: null,
      effective_time: '',
      expiration_time: '',
      cycle_type: '',
      active_day_hours: [],
      active_month_days: [],
      active_week_days: [],
      exclude_dates: [],
      relation_type: 'ALL',
      relation_product_group_id_list: [],
      relation_product_id_list: [],
      relation_product_label_id_list: [],
      remark: '',
      merchant_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: MarketingDiscountFormData) => {
    try {
      // 处理时间格式
      const formattedValues = {
        ...values,
        effective_time: `${values.effective_time} 00:00:00`,
        expiration_time: `${values.expiration_time} 23:59:59`,
      };

      // 调用 API
      const response = await marketingApi.createOrUpdateDiscount(formattedValues);
      return response;
    } catch (error) {
      console.error('Marketing discount form submission error:', error);
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
  const setFormValues = (values: Partial<MarketingDiscountFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取产品数据
  const getProductData = async (params: any) => {
    try {
      const response = await marketingApi.getProductData(params);
      return response;
    } catch (error) {
      console.error('Get product data error:', error);
      throw error;
    }
  };

  // 获取产品组数据
  const getProductGroupData = async (params: any) => {
    try {
      const response = await marketingApi.getProductGroupData(params);
      return response;
    } catch (error) {
      console.error('Get product group data error:', error);
      throw error;
    }
  };

  // 获取产品标签数据
  const getProductLabelData = async (params: any) => {
    try {
      const response = await marketingApi.getProductLabelData(params);
      return response;
    } catch (error) {
      console.error('Get product label data error:', error);
      throw error;
    }
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
    getProductData,
    getProductGroupData,
    getProductLabelData,
  };
}
