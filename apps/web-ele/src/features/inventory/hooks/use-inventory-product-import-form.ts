import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface InventoryProductImportFormData {
  import_type: number; // 1: 导入文件, 2: 导入历史
  selected_fields: string[];
  field_order: string[];
  template_file: string;
  import_file: string;
  merchant_id: string;
  creator_id: string;
  creator_name: string;
  create_time: string;
  update_time: string;
}

export function useInventoryProductImportForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的产品导入表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 导入类型选择
      importTypeSelection: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.importType')}}",
          defaultOpen: true,
        },
        properties: {
          import_type: {
            type: 'number',
            title: "{{t('inventory.importType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('inventory.importFiles')}}",
                  value: 1,
                },
                {
                  label: "{{t('inventory.importHistory')}}",
                  value: 2,
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectImportType')}}",
              },
            ],
          },
        },
      },

      // 导入字段选择
      importFieldSelection: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.importField')}}",
          defaultOpen: true,
        },
        properties: {
          selected_fields: {
            type: 'array',
            title: "{{t('inventory.selectedFields')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Checkbox.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('inventory.productName')}}",
                  value: 'product_name',
                },
                {
                  label: "{{t('inventory.productCode')}}",
                  value: 'product_code',
                },
                {
                  label: "{{t('inventory.productBarcode')}}",
                  value: 'product_barcode',
                },
                {
                  label: "{{t('inventory.productCategory')}}",
                  value: 'category_name',
                },
                {
                  label: "{{t('inventory.productBrand')}}",
                  value: 'brand_name',
                },
                {
                  label: "{{t('inventory.productDescription')}}",
                  value: 'description',
                },
                {
                  label: "{{t('inventory.costPrice')}}",
                  value: 'cost_price',
                },
                {
                  label: "{{t('inventory.salePrice')}}",
                  value: 'sale_price',
                },
                {
                  label: "{{t('inventory.retailPrice')}}",
                  value: 'retail_price',
                },
                {
                  label: "{{t('inventory.wholesalePrice')}}",
                  value: 'wholesale_price',
                },
                {
                  label: "{{t('inventory.weight')}}",
                  value: 'weight',
                },
                {
                  label: "{{t('inventory.volume')}}",
                  value: 'volume',
                },
                {
                  label: "{{t('inventory.length')}}",
                  value: 'length',
                },
                {
                  label: "{{t('inventory.width')}}",
                  value: 'width',
                },
                {
                  label: "{{t('inventory.height')}}",
                  value: 'height',
                },
                {
                  label: "{{t('inventory.minStock')}}",
                  value: 'min_stock',
                },
                {
                  label: "{{t('inventory.maxStock')}}",
                  value: 'max_stock',
                },
                {
                  label: "{{t('inventory.reorderPoint')}}",
                  value: 'reorder_point',
                },
                {
                  label: "{{t('inventory.taxRate')}}",
                  value: 'tax_rate',
                },
                {
                  label: "{{t('inventory.taxInclusive')}}",
                  value: 'tax_inclusive',
                },
                {
                  label: "{{t('inventory.isSale')}}",
                  value: 'is_sale',
                },
                {
                  label: "{{t('inventory.isPurchase')}}",
                  value: 'is_purchase',
                },
                {
                  label: "{{t('inventory.isInventory')}}",
                  value: 'is_inventory',
                },
                {
                  label: "{{t('inventory.status')}}",
                  value: 'status',
                },
                {
                  label: "{{t('inventory.productTags')}}",
                  value: 'tags',
                },
                {
                  label: "{{t('inventory.productImages')}}",
                  value: 'images',
                },
              ],
            },
            'x-validator': [
              {
                validator: (value) => {
                  if (!value || value.length === 0) {
                    return t('inventory.pleaseSelectAtLeastOneField');
                  }
                  return true;
                },
              },
            ],
          },
          field_order: {
            type: 'array',
            title: "{{t('inventory.fieldOrder')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
              dragSort: true,
            },
            items: {
              type: 'object',
              properties: {
                field_name: {
                  type: 'string',
                  title: "{{t('inventory.fieldName')}}",
                  'x-component': 'PreviewText',
                },
                field_label: {
                  type: 'string',
                  title: "{{t('inventory.fieldLabel')}}",
                  'x-component': 'PreviewText',
                },
                is_required: {
                  type: 'boolean',
                  title: "{{t('inventory.isRequired')}}",
                  'x-component': 'Switch',
                  'x-component-props': {
                    disabled: true,
                  },
                },
              },
            },
          },
        },
      },

      // 模板下载
      templateDownload: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.downloadTemplate')}}",
          defaultOpen: true,
        },
        properties: {
          template_file: {
            type: 'string',
            title: "{{t('inventory.templateFile')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          download_template: {
            type: 'void',
            title: "{{t('inventory.downloadTemplate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'ElButton',
            'x-component-props': {
              type: 'primary',
              onClick: 'downloadTemplate',
            },
          },
        },
      },

      // 文件上传
      fileUpload: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.dragFiles')}}",
          defaultOpen: true,
        },
        properties: {
          import_file: {
            type: 'string',
            title: "{{t('inventory.importFile')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Upload',
            'x-component-props': {
              accept: '.xlsx,.xls,.csv',
              maxSize: 10 * 1024 * 1024, // 10MB
              maxCount: 1,
              multiple: false,
              showFileList: true,
              drag: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectImportFile')}}",
              },
            ],
          },
        },
      },

      // 导入设置
      importSettings: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.importSettings')}}",
          defaultOpen: false,
        },
        properties: {
          skip_errors: {
            type: 'boolean',
            title: "{{t('inventory.skipErrors')}}",
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
          update_existing: {
            type: 'boolean',
            title: "{{t('inventory.updateExisting')}}",
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
          validate_data: {
            type: 'boolean',
            title: "{{t('inventory.validateData')}}",
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
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      import_type: 1,
      selected_fields: [],
      field_order: [],
      template_file: '',
      import_file: '',
      merchant_id: '',
      creator_id: '',
      creator_name: '',
      create_time: '',
      update_time: '',
      skip_errors: false,
      update_existing: false,
      validate_data: true,
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: InventoryProductImportFormData) => {
    try {
      // 调用 API
      const response = await inventoryApi.importProducts(values);
      return response;
    } catch (error) {
      console.error('Inventory product import form submission error:', error);
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
  const setFormValues = (values: Partial<InventoryProductImportFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取导入字段选项
  const getImportFieldOptions = () => {
    return [
      {
        label: "{{t('inventory.productName')}}",
        value: 'product_name',
        required: true,
      },
      {
        label: "{{t('inventory.productCode')}}",
        value: 'product_code',
        required: false,
      },
      {
        label: "{{t('inventory.productBarcode')}}",
        value: 'product_barcode',
        required: false,
      },
      {
        label: "{{t('inventory.productCategory')}}",
        value: 'category_name',
        required: false,
      },
      {
        label: "{{t('inventory.productBrand')}}",
        value: 'brand_name',
        required: false,
      },
      {
        label: "{{t('inventory.productDescription')}}",
        value: 'description',
        required: false,
      },
      {
        label: "{{t('inventory.costPrice')}}",
        value: 'cost_price',
        required: false,
      },
      {
        label: "{{t('inventory.salePrice')}}",
        value: 'sale_price',
        required: false,
      },
      {
        label: "{{t('inventory.retailPrice')}}",
        value: 'retail_price',
        required: false,
      },
      {
        label: "{{t('inventory.wholesalePrice')}}",
        value: 'wholesale_price',
        required: false,
      },
      {
        label: "{{t('inventory.weight')}}",
        value: 'weight',
        required: false,
      },
      {
        label: "{{t('inventory.volume')}}",
        value: 'volume',
        required: false,
      },
      {
        label: "{{t('inventory.length')}}",
        value: 'length',
        required: false,
      },
      {
        label: "{{t('inventory.width')}}",
        value: 'width',
        required: false,
      },
      {
        label: "{{t('inventory.height')}}",
        value: 'height',
        required: false,
      },
      {
        label: "{{t('inventory.minStock')}}",
        value: 'min_stock',
        required: false,
      },
      {
        label: "{{t('inventory.maxStock')}}",
        value: 'max_stock',
        required: false,
      },
      {
        label: "{{t('inventory.reorderPoint')}}",
        value: 'reorder_point',
        required: false,
      },
      {
        label: "{{t('inventory.taxRate')}}",
        value: 'tax_rate',
        required: false,
      },
      {
        label: "{{t('inventory.taxInclusive')}}",
        value: 'tax_inclusive',
        required: false,
      },
      {
        label: "{{t('inventory.isSale')}}",
        value: 'is_sale',
        required: false,
      },
      {
        label: "{{t('inventory.isPurchase')}}",
        value: 'is_purchase',
        required: false,
      },
      {
        label: "{{t('inventory.isInventory')}}",
        value: 'is_inventory',
        required: false,
      },
      {
        label: "{{t('inventory.status')}}",
        value: 'status',
        required: false,
      },
      {
        label: "{{t('inventory.productTags')}}",
        value: 'tags',
        required: false,
      },
      {
        label: "{{t('inventory.productImages')}}",
        value: 'images',
        required: false,
      },
    ];
  };

  // 设置创建者信息
  const setCreatorInfo = (creatorInfo: any) => {
    formApi.setFieldValue('creator_id', creatorInfo.id);
    formApi.setFieldValue('creator_name', creatorInfo.name);
  };

  // 处理字段选择变化
  const handleFieldSelectionChange = (selectedFields: string[]) => {
    formApi.setFieldValue('selected_fields', selectedFields);

    // 更新字段顺序
    const fieldOptions = getImportFieldOptions();
    const fieldOrder = selectedFields.map(field => {
      const option = fieldOptions.find(opt => opt.value === field);
      return {
        field_name: field,
        field_label: option?.label || field,
        is_required: option?.required || false,
      };
    });

    formApi.setFieldValue('field_order', fieldOrder);
  };

  // 处理字段顺序变化
  const handleFieldOrderChange = (fieldOrder: any[]) => {
    formApi.setFieldValue('field_order', fieldOrder);
  };

  // 下载模板
  const downloadTemplate = async () => {
    try {
      const selectedFields = formApi.getValues().selected_fields || [];
      if (selectedFields.length === 0) {
        throw new Error(t('inventory.pleaseSelectAtLeastOneField'));
      }

      const response = await inventoryApi.downloadImportTemplate({
        fields: selectedFields,
        field_order: formApi.getValues().field_order || [],
      });

      // 处理文件下载
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product_import_template_${Date.now()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      return response;
    } catch (error) {
      console.error('Download template error:', error);
      throw error;
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('selected_fields', JSON.stringify(formApi.getValues().selected_fields || []));
      formData.append('field_order', JSON.stringify(formApi.getValues().field_order || []));
      formData.append('skip_errors', String(formApi.getValues().skip_errors || false));
      formData.append('update_existing', String(formApi.getValues().update_existing || false));
      formData.append('validate_data', String(formApi.getValues().validate_data || true));

      const response = await inventoryApi.uploadImportFile(formData);
      return response;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  // 验证导入文件
  const validateImportFile = (file: File) => {
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(fileExtension)) {
      return t('inventory.invalidFileType');
    }

    if (file.size > 10 * 1024 * 1024) {
      return t('inventory.fileTooLarge');
    }

    return true;
  };

  // 获取导入进度
  const getImportProgress = async (importId: string) => {
    try {
      const response = await inventoryApi.getImportProgress(importId);
      return response;
    } catch (error) {
      console.error('Get import progress error:', error);
      throw error;
    }
  };

  // 获取导入结果
  const getImportResult = async (importId: string) => {
    try {
      const response = await inventoryApi.getImportResult(importId);
      return response;
    } catch (error) {
      console.error('Get import result error:', error);
      throw error;
    }
  };

  // 获取导入历史
  const getImportHistory = async (params: any) => {
    try {
      const response = await inventoryApi.getImportHistory(params);
      return response;
    } catch (error) {
      console.error('Get import history error:', error);
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
    getImportFieldOptions,
    setCreatorInfo,
    handleFieldSelectionChange,
    handleFieldOrderChange,
    downloadTemplate,
    handleFileUpload,
    validateImportFile,
    getImportProgress,
    getImportResult,
    getImportHistory,
  };
}
