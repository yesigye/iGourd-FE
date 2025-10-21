import { reactive } from 'vue';

import { validateChar } from '#/utils';

export const parseOptions = (options) => {
  if (typeof options === 'string') {
    try {
      return JSON.parse(options);
    } catch {
      return [];
    }
  }
  return options || [];
};

// Status options for product
export const getStatusList = (t) => [
  {
    label: 'inventory.on-sale',
    value: 'ON_SALE',
  },
  {
    label: 'inventory.off-sale',
    value: 'OFF_SALE',
  },
];

// Form validation rules
export const getRules = (t) => ({
  major_name: [
    {
      required: true,
      message: t('inventory.please-input-product-major-name'),
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule, value, callback) => {
        if (value && value.length > 64) {
          callback(
            new Error(t('common.characters-limit-exceeded', { value: 64 })),
          );
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  minor_name: [
    {
      validator: (rule, value, callback) => {
        if (value && value.length > 64) {
          callback(
            new Error(t('common.characters-limit-exceeded', { value: 64 })),
          );
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  product_barcode: [
    {
      required: true,
      message: t('inventory.please-input-barcode'),
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule, value, callback) => {
        if (value && !/^\d*$/.test(value)) {
          callback(new Error(t('validation.onlyNumbers')));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  product_code: [
    {
      required: true,
      message: t('inventory.please-input-product-code'),
      trigger: ['blur', 'change'],
    },
  ],
  // major_unit_id: [
  //   {
  //     required: false,
  //     message: t('inventory.please-select-product-unit'),
  //     trigger: ['blur', 'change']
  //   }
  // ],
  vendor_id: [
    {
      required: false,
      message: t('inventory.please-select-vendor'),
      trigger: ['blur', 'change'],
    },
  ],
  status: [
    {
      required: true,
      message: t('inventory.please-select-status'),
      trigger: ['blur', 'change'],
    },
  ],
  cost_price: [
    {
      required: true,
      message: t('inventory.please-input-cost-price'),
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule, value, callback) => {
        if (value && !/^\d+(\.\d{1,4})?$/.test(value)) {
          callback(new Error(t('common.validate.amount-format', { value: 4 })));
        } else if (value && value.toString().replace('.', '').length > 15) {
          callback(new Error(t('common.max-length', { value: 15 })));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  selling_price: [
    {
      required: true,
      message: t('inventory.please-input-selling-price'),
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule, value, callback) => {
        if (value && !/^\d+(\.\d{1,4})?$/.test(value)) {
          callback(new Error(t('common.validate.amount-format', { value: 4 })));
        } else if (value && value.toString().replace('.', '').length > 15) {
          callback(new Error(t('common.max-length', { value: 15 })));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
});

export interface ProductFormData {
  id: string;
  currency_code: string;
  dynamic_data: string;
  major_name: string;
  minor_name: string;
  merchant_id: null | number;
  product_group_id: null | number;
  product_group_name: string;
  product_label_id_list: any[];
  profile_photo: string;
  status: string;
  tax_excise_id: null | number;
  tax_other_id: null | number;
  tax_rate: null | number;
  tax_vat_id: null | number;
  major_description: string;
  minor_description: string;
  remark: string;
  product_profile_id: string;
  major_unit_id: string;
  major_unit_name: string;
  product_barcode: string;
  product_code: string;
  product_spec_model: string;
  barcode: string;
  code: string;
  cost_price: null | number;
  profit_rate: null | number;
  product_id: null | number;
  product_unit_id: null | number;
  selling_price: null | number;
  vendor_id: null | number;
  vendor_name: string;
  initial_stock_quantity: number;
  initial_stock_warehouse_id: null | number;
  initial_stock_warehouse_location_id: number;
  is_basic: boolean;
  basic_product_id: string;
  basic_unit_id: string;
  basic_unit_radio: number | undefined;
  product_info_list: any | null;
  product_profile_unit_radio_list: any | null;
  product_profile_spec_list: any | null;
  product_profile_unit_info: any | null;
}

// Default form values
export const getDefaultForm = (): ProductFormData => ({
  // sku开始
  // 旧字段目前有用的
  id: '',
  currency_code: '',
  dynamic_data: '',
  major_name: '',
  minor_name: '',
  merchant_id: null,
  product_group_id: null,
  product_group_name: '',
  product_label_id_list: [],
  profile_photo: '',
  status: 'ON_SALE',
  tax_excise_id: null,
  tax_other_id: null,
  tax_rate: null,
  tax_vat_id: null,
  major_description: '',
  minor_description: '',
  remark: '',
  product_profile_id: '',
  // 新字段
  major_unit_id: '',
  major_unit_name: '',
  product_barcode: '',
  product_code: '',
  product_spec_model: '',
  // 旧兼容新情况的旧字段
  barcode: '',
  code: '',
  cost_price: null,
  profit_rate: null,
  product_id: null,
  product_unit_id: null,
  selling_price: null,
  vendor_id: null,
  vendor_name: '',
  initial_stock_quantity: 0,
  initial_stock_warehouse_id: null,
  initial_stock_warehouse_location_id: 1,
  is_basic: true,
  basic_product_id: '',
  basic_unit_id: '',
  basic_unit_radio: undefined,
  product_info_list: null,
  product_profile_unit_radio_list: null,
  product_profile_spec_list: null,
  product_profile_unit_info: null,
});

// Page size config
export const pageSize = 20;

// Dynamic fields query params
export const getDynamicFieldsQueryParams = () =>
  reactive({
    page_size: 100,
    page_num: 1,
    type: '',
    entity: 'PRODUCT',
    is_compulsory: '',
    is_fixed_option: '',
    name: '',
  });

// Shared stock validation rules
export const validateSharedStock = (t) => (_, value, callback) => {
  if (!value.basic_product_id || !value.basic_unit_radio) {
    return callback(new Error(t('inventory.please-shared-stock')));
  }
  return callback();
};

export const generateDynamicRules = (dynamicFields, t) => {
  const dynamicRules = {};

  dynamicFields.forEach((field) => {
    const rules = [];

    if (field.required || field.is_compulsory) {
      rules.push({
        required: true,
        message: t('common.enter') + field.label,
        trigger: ['blur', 'change'],
      });
    }

    switch (field.type) {
      case 'INPUT': {
        rules.push({
          validator: validateChar(64),
          trigger: ['blur', 'change'],
        });
        break;
      }
      case 'SELECT': {
        if (field.is_fixed_option) {
          rules.push({
            validator: (rule, value, callback) => {
              if (value && !parseOptions(field.options).includes(value)) {
                callback(new Error(t('common.enter')));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change'],
          });
        }
        break;
      }
    }

    if (rules.length > 0) {
      dynamicRules[field.prop] = rules;
    }
  });

  return dynamicRules;
};
