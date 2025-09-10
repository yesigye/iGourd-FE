import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface InventoryProductAddFormData {
  id: string;
  name: string;
  code: string;
  barcode: string;
  category_id: string;
  category_name: string;
  brand_id: string;
  brand_name: string;
  description: string;
  status: string;
  is_sale: boolean;
  is_purchase: boolean;
  is_inventory: boolean;
  unit_id: string;
  unit_name: string;
  weight: number;
  volume: number;
  length: number;
  width: number;
  height: number;
  cost_price: number;
  sale_price: number;
  retail_price: number;
  wholesale_price: number;
  min_stock: number;
  max_stock: number;
  reorder_point: number;
  tax_rate: number;
  tax_inclusive: boolean;
  images: string[];
  tags: string[];
  features: Array<{
    feature_id: string;
    feature_name: string;
    feature_value: string;
  }>;
  skus: Array<{
    sku_id: string;
    sku_code: string;
    sku_barcode: string;
    sku_name: string;
    cost_price: number;
    sale_price: number;
    retail_price: number;
    wholesale_price: number;
    weight: number;
    volume: number;
    length: number;
    width: number;
    height: number;
    min_stock: number;
    max_stock: number;
    reorder_point: number;
    status: string;
    images: string[];
    features: Array<{
      feature_id: string;
      feature_name: string;
      feature_value: string;
    }>;
  }>;
  merchant_id: string;
  creator_id: string;
  creator_name: string;
  create_time: string;
  update_time: string;
}

export function useInventoryProductAddForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的产品添加表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.basicInfo')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('inventory.productName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterProductName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterProductName')}}",
              },
            ],
          },
          code: {
            type: 'string',
            title: "{{t('inventory.productCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterProductCode')}}",
              clearable: true,
            },
          },
          barcode: {
            type: 'string',
            title: "{{t('inventory.productBarcode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterProductBarcode')}}",
              clearable: true,
            },
          },
          category_id: {
            type: 'string',
            title: "{{t('inventory.productCategory')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectProductCategory')}}",
              clearable: true,
              filterable: true,
              showSearch: true,
            },
            'x-reactions': [
              {
                dependencies: ['.'],
                fulfill: {
                  state: {
                    'brand_id.value': '{{$self.value ? "" : $self.value}}',
                  },
                },
              },
            ],
          },
          brand_id: {
            type: 'string',
            title: "{{t('inventory.productBrand')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectProductBrand')}}",
              clearable: true,
              filterable: true,
              showSearch: true,
            },
            'x-reactions': [
              {
                dependencies: ['category_id'],
                fulfill: {
                  state: {
                    'x-component-props.options': '{{$deps[0] ? [] : []}}',
                    'x-component-props.disabled': '{{!$deps[0]}}',
                  },
                },
              },
            ],
          },
          description: {
            type: 'string',
            title: "{{t('inventory.productDescription')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('inventory.pleaseEnterProductDescription')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
          },
        },
      },

      // 状态信息
      statusInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.statusInfo')}}",
          defaultOpen: true,
        },
        properties: {
          status: {
            type: 'string',
            title: "{{t('inventory.status')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectStatus')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectStatus')}}",
              },
            ],
          },
          is_sale: {
            type: 'boolean',
            title: "{{t('inventory.isSale')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              checkedChildren: t('inventory.yes'),
              unCheckedChildren: t('inventory.no'),
            },
            'x-reactions': [
              {
                dependencies: ['.'],
                fulfill: {
                  state: {
                    'priceInfo.visible': '{{$self.value}}',
                  },
                },
              },
            ],
          },
          is_purchase: {
            type: 'boolean',
            title: "{{t('inventory.isPurchase')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              checkedChildren: t('inventory.yes'),
              unCheckedChildren: t('inventory.no'),
            },
          },
          is_inventory: {
            type: 'boolean',
            title: "{{t('inventory.isInventory')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              checkedChildren: t('inventory.yes'),
              unCheckedChildren: t('inventory.no'),
            },
            'x-reactions': [
              {
                dependencies: ['.'],
                fulfill: {
                  state: {
                    'stockInfo.visible': '{{$self.value}}',
                    'skuInfo.visible': '{{$self.value}}',
                  },
                },
              },
            ],
          },
        },
      },

      // 单位信息
      unitInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.unitInfo')}}",
          defaultOpen: true,
        },
        properties: {
          unit_id: {
            type: 'string',
            title: "{{t('inventory.unit')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectUnit')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectUnit')}}",
              },
            ],
          },
          weight: {
            type: 'number',
            title: "{{t('inventory.weight')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterWeight')}}",
              min: 0,
              precision: 2,
            },
          },
          volume: {
            type: 'number',
            title: "{{t('inventory.volume')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterVolume')}}",
              min: 0,
              precision: 2,
            },
          },
          length: {
            type: 'number',
            title: "{{t('inventory.length')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterLength')}}",
              min: 0,
              precision: 2,
            },
          },
          width: {
            type: 'number',
            title: "{{t('inventory.width')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterWidth')}}",
              min: 0,
              precision: 2,
            },
          },
          height: {
            type: 'number',
            title: "{{t('inventory.height')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterHeight')}}",
              min: 0,
              precision: 2,
            },
          },
        },
      },

      // 价格信息
      priceInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.priceInfo')}}",
          defaultOpen: true,
        },
        'x-reactions': [
          {
            dependencies: ['is_sale'],
            fulfill: {
              state: {
                visible: '{{$deps[0]}}',
              },
            },
          },
        ],
        properties: {
          cost_price: {
            type: 'number',
            title: "{{t('inventory.costPrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterCostPrice')}}",
              min: 0,
              precision: 2,
            },
          },
          sale_price: {
            type: 'number',
            title: "{{t('inventory.salePrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSalePrice')}}",
              min: 0,
              precision: 2,
            },
          },
          retail_price: {
            type: 'number',
            title: "{{t('inventory.retailPrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterRetailPrice')}}",
              min: 0,
              precision: 2,
            },
          },
          wholesale_price: {
            type: 'number',
            title: "{{t('inventory.wholesalePrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterWholesalePrice')}}",
              min: 0,
              precision: 2,
            },
          },
          tax_rate: {
            type: 'number',
            title: "{{t('inventory.taxRate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterTaxRate')}}",
              min: 0,
              max: 100,
              precision: 2,
            },
          },
          tax_inclusive: {
            type: 'boolean',
            title: "{{t('inventory.taxInclusive')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              checkedChildren: t('inventory.yes'),
              unCheckedChildren: t('inventory.no'),
            },
          },
        },
      },

      // 库存信息
      stockInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.stockInfo')}}",
          defaultOpen: true,
        },
        'x-reactions': [
          {
            dependencies: ['is_inventory'],
            fulfill: {
              state: {
                visible: '{{$deps[0]}}',
              },
            },
          },
        ],
        properties: {
          min_stock: {
            type: 'number',
            title: "{{t('inventory.minStock')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterMinStock')}}",
              min: 0,
              precision: 0,
            },
          },
          max_stock: {
            type: 'number',
            title: "{{t('inventory.maxStock')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterMaxStock')}}",
              min: 0,
              precision: 0,
            },
          },
          reorder_point: {
            type: 'number',
            title: "{{t('inventory.reorderPoint')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterReorderPoint')}}",
              min: 0,
              precision: 0,
            },
          },
        },
      },

      // 图片信息
      imageInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.imageInfo')}}",
          defaultOpen: true,
        },
        properties: {
          images: {
            type: 'array',
            title: "{{t('inventory.productImages')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Upload',
            'x-component-props': {
              accept: 'image/*',
              maxSize: 5 * 1024 * 1024, // 5MB
              maxCount: 10,
              multiple: true,
              showFileList: true,
            },
          },
        },
      },

      // 标签信息
      tagInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.tagInfo')}}",
          defaultOpen: false,
        },
        properties: {
          tags: {
            type: 'array',
            title: "{{t('inventory.productTags')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              mode: 'tags',
              placeholder: "{{t('inventory.pleaseSelectProductTags')}}",
              clearable: true,
              multiple: true,
            },
          },
        },
      },

      // 特性信息
      featureInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.featureInfo')}}",
          defaultOpen: false,
        },
        properties: {
          features: {
            type: 'array',
            title: "{{t('inventory.productFeatures')}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            items: {
              type: 'object',
              properties: {
                feature_name: {
                  type: 'string',
                  title: "{{t('inventory.featureName')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('inventory.pleaseEnterFeatureName')}}",
                    clearable: true,
                  },
                },
                feature_value: {
                  type: 'string',
                  title: "{{t('inventory.featureValue')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('inventory.pleaseEnterFeatureValue')}}",
                    clearable: true,
                  },
                },
              },
            },
          },
        },
      },

      // SKU信息
      skuInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.skuInfo')}}",
          defaultOpen: false,
        },
        'x-reactions': [
          {
            dependencies: ['is_inventory'],
            fulfill: {
              state: {
                visible: '{{$deps[0]}}',
              },
            },
          },
        ],
        properties: {
          skus: {
            type: 'array',
            title: "{{t('inventory.productSKUs')}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            items: {
              type: 'object',
              properties: {
                sku_code: {
                  type: 'string',
                  title: "{{t('inventory.skuCode')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('inventory.pleaseEnterSkuCode')}}",
                    clearable: true,
                  },
                  'x-reactions': [
                    {
                      dependencies: ['.'],
                      fulfill: {
                        state: {
                          'sku_barcode.value':
                            '{{$self.value ? $self.value + "_barcode" : ""}}',
                        },
                      },
                    },
                  ],
                },
                sku_barcode: {
                  type: 'string',
                  title: "{{t('inventory.skuBarcode')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('inventory.pleaseEnterSkuBarcode')}}",
                    clearable: true,
                  },
                },
                sku_name: {
                  type: 'string',
                  title: "{{t('inventory.skuName')}}",
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('inventory.pleaseEnterSkuName')}}",
                    clearable: true,
                  },
                },
                cost_price: {
                  type: 'number',
                  title: "{{t('inventory.costPrice')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                  'x-reactions': [
                    {
                      dependencies: ['.'],
                      fulfill: {
                        state: {
                          'sale_price.value':
                            '{{$self.value ? Math.round($self.value * 1.3 * 100) / 100 : 0}}',
                          'retail_price.value':
                            '{{$self.value ? Math.round($self.value * 1.5 * 100) / 100 : 0}}',
                          'wholesale_price.value':
                            '{{$self.value ? Math.round($self.value * 1.2 * 100) / 100 : 0}}',
                        },
                      },
                    },
                  ],
                },
                sale_price: {
                  type: 'number',
                  title: "{{t('inventory.salePrice')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                retail_price: {
                  type: 'number',
                  title: "{{t('inventory.retailPrice')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                wholesale_price: {
                  type: 'number',
                  title: "{{t('inventory.wholesalePrice')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                weight: {
                  type: 'number',
                  title: "{{t('inventory.weight')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                volume: {
                  type: 'number',
                  title: "{{t('inventory.volume')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                length: {
                  type: 'number',
                  title: "{{t('inventory.length')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                width: {
                  type: 'number',
                  title: "{{t('inventory.width')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                height: {
                  type: 'number',
                  title: "{{t('inventory.height')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 2,
                  },
                },
                min_stock: {
                  type: 'number',
                  title: "{{t('inventory.minStock')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 0,
                  },
                },
                max_stock: {
                  type: 'number',
                  title: "{{t('inventory.maxStock')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 0,
                  },
                },
                reorder_point: {
                  type: 'number',
                  title: "{{t('inventory.reorderPoint')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 0,
                  },
                },
                status: {
                  type: 'string',
                  title: "{{t('inventory.status')}}",
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: "{{t('inventory.pleaseSelectStatus')}}",
                    clearable: true,
                  },
                },
                images: {
                  type: 'array',
                  title: "{{t('inventory.skuImages')}}",
                  'x-component': 'Upload',
                  'x-component-props': {
                    accept: 'image/*',
                    maxSize: 5 * 1024 * 1024, // 5MB
                    maxCount: 5,
                    multiple: true,
                    showFileList: true,
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
      id: '',
      name: '',
      code: '',
      barcode: '',
      category_id: '',
      category_name: '',
      brand_id: '',
      brand_name: '',
      description: '',
      status: '',
      is_sale: true,
      is_purchase: true,
      is_inventory: true,
      unit_id: '',
      unit_name: '',
      weight: 0,
      volume: 0,
      length: 0,
      width: 0,
      height: 0,
      cost_price: 0,
      sale_price: 0,
      retail_price: 0,
      wholesale_price: 0,
      min_stock: 0,
      max_stock: 0,
      reorder_point: 0,
      tax_rate: 0,
      tax_inclusive: false,
      images: [],
      tags: [],
      features: [],
      skus: [],
      merchant_id: '',
      creator_id: '',
      creator_name: '',
      create_time: '',
      update_time: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: InventoryProductAddFormData) => {
    try {
      // 调用 API
      const response = await inventoryApi.createOrUpdateProduct(values);
      return response;
    } catch (error) {
      console.error('Inventory product add form submission error:', error);
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
  const setFormValues = (values: Partial<InventoryProductAddFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取分类列表
  const getCategoryList = async () => {
    try {
      const response = await inventoryApi.getCategoryList();
      return response;
    } catch (error) {
      console.error('Get category list error:', error);
      throw error;
    }
  };

  // 获取品牌列表
  const getBrandList = async () => {
    try {
      const response = await inventoryApi.getBrandList();
      return response;
    } catch (error) {
      console.error('Get brand list error:', error);
      throw error;
    }
  };

  // 获取单位列表
  const getUnitList = async () => {
    try {
      const response = await inventoryApi.getUnitList();
      return response;
    } catch (error) {
      console.error('Get unit list error:', error);
      throw error;
    }
  };

  // 获取标签列表
  const getTagList = async () => {
    try {
      const response = await inventoryApi.getTagList();
      return response;
    } catch (error) {
      console.error('Get tag list error:', error);
      throw error;
    }
  };

  // 获取特性列表
  const getFeatureList = async () => {
    try {
      const response = await inventoryApi.getFeatureList();
      return response;
    } catch (error) {
      console.error('Get feature list error:', error);
      throw error;
    }
  };

  // 设置创建者信息
  const setCreatorInfo = (creatorInfo: any) => {
    formApi.setFieldValue('creator_id', creatorInfo.id);
    formApi.setFieldValue('creator_name', creatorInfo.name);
  };

  // 添加SKU
  const addSku = () => {
    const currentSkus = formApi.getValues().skus || [];
    const newSku = {
      sku_id: '',
      sku_code: '',
      sku_barcode: '',
      sku_name: '',
      cost_price: 0,
      sale_price: 0,
      retail_price: 0,
      wholesale_price: 0,
      weight: 0,
      volume: 0,
      length: 0,
      width: 0,
      height: 0,
      min_stock: 0,
      max_stock: 0,
      reorder_point: 0,
      status: 'ACTIVE',
      images: [],
      features: [],
    };

    formApi.setFieldValue('skus', [...currentSkus, newSku]);
  };

  // 移除SKU
  const removeSku = (index: number) => {
    const currentSkus = formApi.getValues().skus || [];
    const newSkus = currentSkus.filter((_, i) => i !== index);
    formApi.setFieldValue('skus', newSkus);
  };

  // 添加特性
  const addFeature = () => {
    const currentFeatures = formApi.getValues().features || [];
    const newFeature = {
      feature_id: '',
      feature_name: '',
      feature_value: '',
    };

    formApi.setFieldValue('features', [...currentFeatures, newFeature]);
  };

  // 移除特性
  const removeFeature = (index: number) => {
    const currentFeatures = formApi.getValues().features || [];
    const newFeatures = currentFeatures.filter((_, i) => i !== index);
    formApi.setFieldValue('features', newFeatures);
  };

  // 获取状态选项
  const getStatusOptions = () => {
    return [
      {
        label: "{{t('inventory.active')}}",
        value: 'ACTIVE',
      },
      {
        label: "{{t('inventory.inactive')}}",
        value: 'INACTIVE',
      },
      {
        label: "{{t('inventory.discontinued')}}",
        value: 'DISCONTINUED',
      },
    ];
  };

  // 验证SKU
  const validateSkus = () => {
    const skus = formApi.getValues().skus || [];
    if (skus.length === 0) {
      return t('inventory.pleaseAddAtLeastOneSku');
    }

    for (let i = 0; i < skus.length; i++) {
      const sku = skus[i];
      if (!sku.sku_name) {
        return t('inventory.pleaseEnterSkuName', { index: i + 1 });
      }
      if (!sku.sku_code) {
        return t('inventory.pleaseEnterSkuCode', { index: i + 1 });
      }
    }

    return true;
  };

  // 验证特性
  const validateFeatures = () => {
    const features = formApi.getValues().features || [];
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      if (!feature.feature_name) {
        return t('inventory.pleaseEnterFeatureName', { index: i + 1 });
      }
      if (!feature.feature_value) {
        return t('inventory.pleaseEnterFeatureValue', { index: i + 1 });
      }
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
    getCategoryList,
    getBrandList,
    getUnitList,
    getTagList,
    getFeatureList,
    setCreatorInfo,
    addSku,
    removeSku,
    addFeature,
    removeFeature,
    getStatusOptions,
    validateSkus,
    validateFeatures,
  };
}
