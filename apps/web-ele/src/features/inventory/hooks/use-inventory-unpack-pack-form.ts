import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface UnpackPackFormData {
  exchange_type: string;
  source_product_id: string;
  source_warehouse_id: string;
  source_quantity: number;
  destination_product_id: string;
  destination_warehouse_id: string;
  destination_quantity: number;
  unit_rate: number;
  merchant_id: string;
}

export function useInventoryUnpackPackForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的拆包/打包表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 操作类型选择
      operationType: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.operationType')}}",
          defaultOpen: true,
        },
        properties: {
          exchange_type: {
            type: 'string',
            title: "{{t('inventory.selectType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectType')}}",
              clearable: true,
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectType')}}",
              },
            ],
          },
        },
      },

      // 产品选择部分
      productSelection: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.productSelection')}}",
          defaultOpen: true,
        },
        properties: {
          // 源产品信息
          sourceProduct: {
            type: 'void',
            title: "{{t('inventory.sourceProduct')}}",
            'x-component': 'FormGrid',
            'x-component-props': {
              columns: 2,
            },
            properties: {
              source_product_id: {
                type: 'string',
                title: "{{t('inventory.selectProduct')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseSelectProduct')}}",
                  clearable: true,
                  showSearch: true,
                  filterable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('inventory.pleaseSelectProduct')}}",
                  },
                ],
              },
              source_warehouse_id: {
                type: 'string',
                title: "{{t('inventory.warehouse')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseSelectWarehouse')}}",
                  clearable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('inventory.pleaseSelectWarehouse')}}",
                  },
                ],
              },
              source_quantity: {
                type: 'number',
                title: "{{t('inventory.quantity')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseEnterQuantity')}}",
                  min: 0,
                  precision: 8,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('inventory.pleaseEnterQuantity')}}",
                  },
                  {
                    validator: (value) => {
                      if (value <= 0) {
                        return t('inventory.quantityZero');
                      }
                      return true;
                    },
                  },
                ],
              },
            },
          },

          // 单位换算比例
          unitRate: {
            type: 'void',
            title: "{{t('inventory.unitRate')}}",
            'x-component': 'FormGrid',
            'x-component-props': {
              columns: 1,
            },
            properties: {
              unit_rate: {
                type: 'number',
                title: "{{t('inventory.unitRate')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 1',
                },
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseEnterUnitRate')}}",
                  min: 0,
                  precision: 8,
                  style: { width: '200px' },
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('inventory.pleaseEnterUnitRate')}}",
                  },
                  {
                    validator: (value) => {
                      if (value <= 0) {
                        return t('inventory.unitRateZero');
                      }
                      return true;
                    },
                  },
                ],
              },
            },
          },

          // 目标产品信息
          targetProduct: {
            type: 'void',
            title: "{{t('inventory.targetProduct')}}",
            'x-component': 'FormGrid',
            'x-component-props': {
              columns: 2,
            },
            properties: {
              destination_product_id: {
                type: 'string',
                title: "{{t('inventory.selectProduct')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseSelectProduct')}}",
                  clearable: true,
                  showSearch: true,
                  filterable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('inventory.pleaseSelectProduct')}}",
                  },
                ],
              },
              destination_warehouse_id: {
                type: 'string',
                title: "{{t('inventory.warehouse')}}",
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseSelectWarehouse')}}",
                  clearable: true,
                },
              },
              destination_quantity: {
                type: 'number',
                title: "{{t('inventory.quantity')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 'span 2',
                },
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: "{{t('inventory.pleaseEnterQuantity')}}",
                  min: 0,
                  precision: 8,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('inventory.pleaseEnterQuantity')}}",
                  },
                  {
                    validator: (value) => {
                      if (value <= 0) {
                        return t('inventory.quantityZero');
                      }
                      return true;
                    },
                  },
                ],
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
      exchange_type: 'STOCK_UNPACK',
      source_product_id: '',
      source_warehouse_id: '',
      source_quantity: 0,
      destination_product_id: '',
      destination_warehouse_id: '',
      destination_quantity: 0,
      unit_rate: 1,
      merchant_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: UnpackPackFormData) => {
    try {
      // 调用 API
      const response = await inventoryApi.productStockPackageChange(values);
      return response;
    } catch (error) {
      console.error('Unpack pack form submission error:', error);
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
  const setFormValues = (values: Partial<UnpackPackFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取仓库库存列表
  const getWarehouseStockList = async (productId: string) => {
    try {
      const response = await inventoryApi.getWarehouseStockList(productId);
      return response;
    } catch (error) {
      console.error('Get warehouse stock list error:', error);
      throw error;
    }
  };

  // 计算目标数量
  const calculateTargetQuantity = (sourceQuantity: number, unitRate: number, exchangeType: string) => {
    if (exchangeType === 'STOCK_UNPACK') {
      return sourceQuantity * unitRate;
    } else {
      return sourceQuantity / unitRate;
    }
  };

  // 计算源数量
  const calculateSourceQuantity = (targetQuantity: number, unitRate: number, exchangeType: string) => {
    if (exchangeType === 'STOCK_UNPACK') {
      return targetQuantity / unitRate;
    } else {
      return targetQuantity * unitRate;
    }
  };

  // 获取操作类型选项
  const getOperationTypeOptions = () => {
    return [
      {
        label: "{{t('inventory.packText')}}",
        value: 'STOCK_PACK',
        type: 'success',
        slot: 'suffix',
      },
      {
        label: "{{t('inventory.unpackText')}}",
        value: 'STOCK_UNPACK',
        type: 'danger',
        slot: 'prefix',
      },
    ];
  };

  // 验证源数量
  const validateSourceQuantity = (value: number, productHouseQuantity: number | null) => {
    if (value <= 0) {
      return t('inventory.quantityZero');
    }
    if (productHouseQuantity !== null && value > productHouseQuantity) {
      return t('inventory.unpackQuantityError', { t: productHouseQuantity });
    }
    return true;
  };

  // 验证目标数量
  const validateTargetQuantity = (value: number) => {
    if (value <= 0) {
      return t('inventory.quantityZero');
    }
    return true;
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
    getWarehouseStockList,
    calculateTargetQuantity,
    calculateSourceQuantity,
    getOperationTypeOptions,
    validateSourceQuantity,
    validateTargetQuantity,
  };
}
