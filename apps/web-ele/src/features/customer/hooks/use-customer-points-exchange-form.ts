import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { customerApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface CustomerPointsExchangeFormData {
  customer_id: string;
  customer_name: string;
  customer_points: number;
  deduction_points: number;
  residual_points: number;
  point_gifts: Array<{
    product_id: string;
    product_name: string;
    product_code: string;
    product_barcode: string;
    product_quantity: number;
    points: number;
    cost_price: number;
  }>;
  merchant_id: string;
}

export function useCustomerPointsExchangeForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的积分兑换产品表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 客户信息部分
      customerInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.customerInfo')}}",
          defaultOpen: true,
        },
        properties: {
          customer_name: {
            type: 'string',
            title: "{{t('customers.name')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
            'x-reactions': [
              {
                dependencies: ['customer_id'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]}}',
                  },
                },
              },
            ],
          },
          customer_points: {
            type: 'number',
            title: "{{t('customers.points')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          deduction_points: {
            type: 'number',
            title: "{{t('customers.deductionPoints')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff4d4f' },
            },
          },
          residual_points: {
            type: 'number',
            title: "{{t('customers.residualPoints')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#52c41a' },
            },
          },
        },
      },

      // 产品搜索部分
      productSearch: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.productSearch')}}",
          defaultOpen: true,
        },
        properties: {
          keywords: {
            type: 'string',
            title: "{{t('customers.searchKeywords')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.enterPointsSearch')}}",
              clearable: true,
              style: { width: '300px' },
            },
          },
        },
      },

      // 产品列表部分
      productList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.productList')}}",
          defaultOpen: true,
        },
        properties: {
          point_gifts: {
            type: 'array',
            title: "{{t('customers.selectedProducts')}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
              selection: true,
            },
            items: {
              type: 'object',
              properties: {
                product_name: {
                  type: 'string',
                  title: "{{t('customers.productName')}}",
                  'x-component': 'PreviewText',
                },
                product_code: {
                  type: 'string',
                  title: "{{t('customers.productCode')}}",
                  'x-component': 'PreviewText',
                },
                product_barcode: {
                  type: 'string',
                  title: "{{t('customers.productBarcode')}}",
                  'x-component': 'PreviewText',
                },
                product_unit_name: {
                  type: 'string',
                  title: "{{t('customers.productUnit')}}",
                  'x-component': 'PreviewText',
                },
                points: {
                  type: 'number',
                  title: "{{t('customers.points')}}",
                  'x-component': 'PreviewText',
                },
                cost_price: {
                  type: 'number',
                  title: "{{t('customers.price')}}",
                  'x-component': 'PreviewText',
                },
                product_quantity: {
                  type: 'number',
                  title: "{{t('sales.QTY')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    step: 1,
                    precision: 0,
                  },
                },
              },
            },
          },
        },
      },

      // 积分统计部分
      pointsSummary: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.pointsSummary')}}",
          defaultOpen: true,
        },
        properties: {
          total_deduction_points: {
            type: 'number',
            title: "{{t('customers.totalDeductionPoints')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff4d4f', fontSize: '16px', fontWeight: 'bold' },
            },
          },
          remaining_points: {
            type: 'number',
            title: "{{t('customers.remainingPoints')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#52c41a', fontSize: '16px', fontWeight: 'bold' },
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    initialValues: {
      customer_id: '',
      customer_name: '',
      customer_points: 0,
      deduction_points: 0,
      residual_points: 0,
      point_gifts: [],
      merchant_id: '',
    },
    scope: {},
  });

  // 表单提交处理
  const handleSubmit = async (values: CustomerPointsExchangeFormData) => {
    try {
      // 调用 API
      const response = await customerApi.exchangePoints(values);
      return response;
    } catch (error) {
      console.error('Customer points exchange form submission error:', error);
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
  const setFormValues = (values: Partial<CustomerPointsExchangeFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取积分产品列表
  const getPointsProductList = async (params: any) => {
    try {
      const response = await customerApi.getList(params);
      return response;
    } catch (error) {
      console.error('Get points product list error:', error);
      throw error;
    }
  };

  // 设置客户信息
  const setCustomerInfo = (customerInfo: any) => {
    formAPI.setValues({
      customer_id: customerInfo.id,
      customer_name: customerInfo.name,
      customer_points: customerInfo.points || 0,
      residual_points: customerInfo.points || 0
    });
  };

  // 更新产品列表
  const updateProductList = (productList: any[]) => {
    const formattedProducts = productList.map(item => ({
      product_id: item.id,
      product_name: item.major_name,
      product_code: item.product_code,
      product_barcode: item.sku_barcode,
      product_unit_name: item.product_unit_name,
      points: item.points,
      cost_price: item.cost_price,
      product_quantity: 0,
    }));
    formAPI.setValues({ point_gifts: formattedProducts });
  };

  // 计算总积分
  const calculateTotalPoints = (productList: any[]) => {
    return productList.reduce((total, item) => {
      return total + (item.points || 0) * (item.product_quantity || 0);
    }, 0);
  };

  // 更新积分统计
  const updatePointsSummary = () => {
    const currentProducts = (formAPI.values as any).point_gifts || [];
    const totalPoints = calculateTotalPoints(currentProducts);
    const customerPoints = (formAPI.values as any).customer_points || 0;

    formAPI.setValues({
      deduction_points: totalPoints,
      residual_points: customerPoints - totalPoints
    });
  };

  // 处理产品数量变化
  const handleProductQuantityChange = (productId: string, quantity: number) => {
    const currentProducts = (formAPI.values as any).point_gifts || [];
    const updatedProducts = currentProducts.map((item: any) => {
      if (item.product_id === productId) {
        return { ...item, product_quantity: quantity };
      }
      return item;
    });

    formAPI.setValues({ point_gifts: updatedProducts });
    updatePointsSummary();
  };

  // 处理产品选择变化
  const handleProductSelectionChange = (selectedProducts: any[]) => {
    const currentProducts = (formAPI.values as any).point_gifts || [];
    const updatedProducts = currentProducts.map((item: any) => {
      const isSelected = selectedProducts.some(selected => selected.id === item.product_id);
      return {
        ...item,
        product_quantity: isSelected ? Math.max(item.product_quantity, 1) : 0,
      };
    });

    formAPI.setValues({ point_gifts: updatedProducts });
    updatePointsSummary();
  };

  // 检查是否超过可用积分
  const checkPointsLimit = (productId: string, quantity: number) => {
    const currentProducts = (formAPI.values as any).point_gifts || [];
    const customerPoints = (formAPI.values as any).customer_points || 0;
    const currentTotal = calculateTotalPoints(currentProducts);
    const product = currentProducts.find((item: any) => item.product_id === productId);

    if (product) {
      const newTotal = currentTotal - (product.points * product.product_quantity) + (product.points * quantity);
      return newTotal <= customerPoints;
    }

    return true;
  };

  // 获取最大可兑换数量
  const getMaxQuantity = (productId: string) => {
    const currentProducts = (formAPI.values as any).point_gifts || [];
    const customerPoints = (formAPI.values as any).customer_points || 0;
    const currentTotal = calculateTotalPoints(currentProducts);
    const product = currentProducts.find((item: any) => item.product_id === productId);

    if (product) {
      const availablePoints = customerPoints - currentTotal + (product.points * product.product_quantity);
      return Math.floor(availablePoints / product.points);
    }

    return 0;
  };

  // 验证兑换条件
  const validateExchange = () => {
    const currentProducts = (formAPI.values as any).point_gifts || [];
    const hasSelectedProducts = currentProducts.some((item: any) => item.product_quantity > 0);

    if (!hasSelectedProducts) {
      return t('customers.selectAtLeastOne');
    }

    const totalPoints = calculateTotalPoints(currentProducts);
    const customerPoints = (formAPI.values as any).customer_points || 0;

    if (totalPoints > customerPoints) {
      return t('customers.exceedAvailablePoints');
    }

    return true;
  };

  // 重置积分统计
  const resetPointsSummary = () => {
    formAPI.setValues({
      deduction_points: 0,
      residual_points: (formAPI.values as any).customer_points || 0
    });
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
    getPointsProductList,
    setCustomerInfo,
    updateProductList,
    calculateTotalPoints,
    updatePointsSummary,
    handleProductQuantityChange,
    handleProductSelectionChange,
    checkPointsLimit,
    getMaxQuantity,
    validateExchange,
    resetPointsSummary,
  };
}
