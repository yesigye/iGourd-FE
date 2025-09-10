import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface PurchaseNewOrderFormData {
  order_no: string;
  vendor_id: string;
  vendor_name: string;
  order_date: string;
  expected_delivery_date: string;
  total_amount: number;
  currency_code: string;
  exchange_rate: number;
  status: string;
  remark: string;
  merchant_id: string;
  creator_id: string;
  creator_name: string;
  create_time: string;
  update_time: string;
  order_items: Array<{
    product_id: string;
    product_name: string;
    product_code: string;
    product_barcode: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    unit_id: string;
    unit_name: string;
  }>;
}

export function usePurchaseNewOrderForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的采购新订单表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 订单基础信息
      orderBasicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.orderBasicInfo')}}",
          defaultOpen: true,
        },
        properties: {
          order_no: {
            type: 'string',
            title: "{{t('purchase.orderNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterOrderNo')}}",
              clearable: true,
              disabled: true,
            },
          },
          vendor_id: {
            type: 'string',
            title: "{{t('purchase.vendor')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectVendor')}}",
              clearable: true,
              filterable: true,
              showSearch: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectVendor')}}",
              },
            ],
          },
          vendor_name: {
            type: 'string',
            title: "{{t('purchase.vendorName')}}",
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

      // 订单日期信息
      orderDateInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.orderDateInfo')}}",
          defaultOpen: true,
        },
        properties: {
          order_date: {
            type: 'string',
            title: "{{t('purchase.orderDate')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectOrderDate')}}",
              clearable: true,
              style: { width: '100%' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectOrderDate')}}",
              },
            ],
          },
          expected_delivery_date: {
            type: 'string',
            title: "{{t('purchase.expectedDeliveryDate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectExpectedDeliveryDate')}}",
              clearable: true,
              style: { width: '100%' },
            },
          },
        },
      },

      // 金额信息
      amountInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.amountInfo')}}",
          defaultOpen: true,
        },
        properties: {
          total_amount: {
            type: 'number',
            title: "{{t('purchase.totalAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterTotalAmount')}}",
              min: 0,
              precision: 2,
              disabled: true,
            },
          },
          currency_code: {
            type: 'string',
            title: "{{t('purchase.currency')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectCurrency')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectCurrency')}}",
              },
            ],
          },
          exchange_rate: {
            type: 'number',
            title: "{{t('purchase.exchangeRate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterExchangeRate')}}",
              min: 0,
              precision: 4,
            },
          },
        },
      },

      // 订单状态
      orderStatus: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.orderStatus')}}",
          defaultOpen: true,
        },
        properties: {
          status: {
            type: 'string',
            title: "{{t('purchase.status')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectStatus')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectStatus')}}",
              },
            ],
          },
        },
      },

      // 订单商品列表
      orderItems: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.orderItems')}}",
          defaultOpen: true,
        },
        properties: {
          order_items: {
            type: 'array',
            title: "{{t('purchase.orderItems')}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            items: {
              type: 'object',
              properties: {
                product_name: {
                  type: 'string',
                  title: "{{t('purchase.productName')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('purchase.pleaseEnterProductName')}}",
                    clearable: true,
                  },
                },
                product_code: {
                  type: 'string',
                  title: "{{t('purchase.productCode')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('purchase.pleaseEnterProductCode')}}",
                    clearable: true,
                  },
                },
                product_barcode: {
                  type: 'string',
                  title: "{{t('purchase.productBarcode')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('purchase.pleaseEnterProductBarcode')}}",
                    clearable: true,
                  },
                },
                quantity: {
                  type: 'number',
                  title: "{{t('purchase.quantity')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                unit_price: {
                  type: 'number',
                  title: "{{t('purchase.unitPrice')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                total_price: {
                  type: 'number',
                  title: "{{t('purchase.totalPrice')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                    disabled: true,
                  },
                },
                unit_name: {
                  type: 'string',
                  title: "{{t('purchase.unit')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('purchase.pleaseEnterUnit')}}",
                    clearable: true,
                  },
                },
              },
            },
          },
        },
      },

      // 备注信息
      remarkInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.remarkInfo')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('purchase.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('purchase.pleaseEnterRemark')}}",
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
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      order_no: '',
      vendor_id: '',
      vendor_name: '',
      order_date: '',
      expected_delivery_date: '',
      total_amount: 0,
      currency_code: '',
      exchange_rate: 1,
      status: '',
      remark: '',
      merchant_id: '',
      creator_id: '',
      creator_name: '',
      create_time: '',
      update_time: '',
      order_items: [],
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: PurchaseNewOrderFormData) => {
    try {
      // 调用 API
      const response = await purchaseApi.createOrUpdateOrder(values);
      return response;
    } catch (error) {
      console.error('Purchase new order form submission error:', error);
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
  const setFormValues = (values: Partial<PurchaseNewOrderFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取供应商列表
  const getVendorList = async () => {
    try {
      const response = await purchaseApi.getVendorList();
      return response;
    } catch (error) {
      console.error('Get vendor list error:', error);
      throw error;
    }
  };

  // 获取货币列表
  const getCurrencyList = async () => {
    try {
      const response = await purchaseApi.getCurrencyList();
      return response;
    } catch (error) {
      console.error('Get currency list error:', error);
      throw error;
    }
  };

  // 获取产品列表
  const getProductList = async (params: any) => {
    try {
      const response = await purchaseApi.getProductList(params);
      return response;
    } catch (error) {
      console.error('Get product list error:', error);
      throw error;
    }
  };

  // 设置供应商信息
  const setVendorInfo = (vendorInfo: any) => {
    formApi.setFieldValue('vendor_id', vendorInfo.id);
    formApi.setFieldValue('vendor_name', vendorInfo.name);
  };

  // 设置创建者信息
  const setCreatorInfo = (creatorInfo: any) => {
    formApi.setFieldValue('creator_id', creatorInfo.id);
    formApi.setFieldValue('creator_name', creatorInfo.name);
  };

  // 生成订单号
  const generateOrderNo = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO${timestamp}${random}`;
  };

  // 计算总金额
  const calculateTotalAmount = (orderItems: any[]) => {
    return orderItems.reduce((total, item) => {
      return total + (item.quantity || 0) * (item.unit_price || 0);
    }, 0);
  };

  // 更新总金额
  const updateTotalAmount = () => {
    const orderItems = formApi.getValues().order_items || [];
    const totalAmount = calculateTotalAmount(orderItems);
    formApi.setFieldValue('total_amount', totalAmount);
  };

  // 添加订单商品
  const addOrderItem = (product: any) => {
    const currentItems = formApi.getValues().order_items || [];
    const newItem = {
      product_id: product.id,
      product_name: product.name,
      product_code: product.code,
      product_barcode: product.barcode,
      quantity: 1,
      unit_price: product.price || 0,
      total_price: product.price || 0,
      unit_id: product.unit_id,
      unit_name: product.unit_name,
    };

    formApi.setFieldValue('order_items', [...currentItems, newItem]);
    updateTotalAmount();
  };

  // 移除订单商品
  const removeOrderItem = (index: number) => {
    const currentItems = formApi.getValues().order_items || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    formApi.setFieldValue('order_items', newItems);
    updateTotalAmount();
  };

  // 更新订单商品数量
  const updateOrderItemQuantity = (index: number, quantity: number) => {
    const currentItems = formApi.getValues().order_items || [];
    const updatedItems = currentItems.map((item, i) => {
      if (i === index) {
        const totalPrice = (item.unit_price || 0) * quantity;
        return { ...item, quantity, total_price: totalPrice };
      }
      return item;
    });

    formApi.setFieldValue('order_items', updatedItems);
    updateTotalAmount();
  };

  // 更新订单商品单价
  const updateOrderItemUnitPrice = (index: number, unitPrice: number) => {
    const currentItems = formApi.getValues().order_items || [];
    const updatedItems = currentItems.map((item, i) => {
      if (i === index) {
        const totalPrice = unitPrice * (item.quantity || 0);
        return { ...item, unit_price: unitPrice, total_price: totalPrice };
      }
      return item;
    });

    formApi.setFieldValue('order_items', updatedItems);
    updateTotalAmount();
  };

  // 获取订单状态选项
  const getOrderStatusOptions = () => {
    return [
      {
        label: "{{t('purchase.draft')}}",
        value: 'DRAFT',
      },
      {
        label: "{{t('purchase.pending')}}",
        value: 'PENDING',
      },
      {
        label: "{{t('purchase.approved')}}",
        value: 'APPROVED',
      },
      {
        label: "{{t('purchase.rejected')}}",
        value: 'REJECTED',
      },
      {
        label: "{{t('purchase.completed')}}",
        value: 'COMPLETED',
      },
    ];
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
    getVendorList,
    getCurrencyList,
    getProductList,
    setVendorInfo,
    setCreatorInfo,
    generateOrderNo,
    calculateTotalAmount,
    updateTotalAmount,
    addOrderItem,
    removeOrderItem,
    updateOrderItemQuantity,
    updateOrderItemUnitPrice,
    getOrderStatusOptions,
  };
}
