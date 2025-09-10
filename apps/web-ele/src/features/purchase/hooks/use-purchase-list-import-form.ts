import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface PurchaseListImportFormData {
  import_type: number;
  selected_fields: string[];
  template_file: File | null;
  import_file: File | null;
  merchant_id: string;
}

// 定义字段类型
interface ImportField {
  id: number;
  name: string;
  isChack: boolean;
  disabled: boolean;
}

export function usePurchaseListImportForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的采购列表导入表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 导入类型选择
      importType: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.importType')}}",
          defaultOpen: true,
        },
        properties: {
          import_type: {
            type: 'number',
            title: "{{t('purchase.importType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('purchase.importFiles')}}",
                  value: 1,
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectImportType')}}",
              },
            ],
          },
        },
      },

      // 导入字段选择
      importFields: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.importFields')}}",
          defaultOpen: true,
        },
        properties: {
          selected_fields: {
            type: 'array',
            title: "{{t('purchase.selectFields')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Checkbox.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('purchase.vendorName')}}",
                  value: 'vendor_name',
                  disabled: true,
                },
                {
                  label: "{{t('purchase.contactName')}}",
                  value: 'contact_name',
                  disabled: true,
                },
                {
                  label: "{{t('purchase.phoneNumber')}}",
                  value: 'phone_number',
                  disabled: true,
                },
                {
                  label: "{{t('purchase.image')}}",
                  value: 'image',
                  disabled: false,
                },
                {
                  label: "{{t('purchase.address')}}",
                  value: 'address',
                  disabled: false,
                },
                {
                  label: "{{t('purchase.taxNumber')}}",
                  value: 'tax_number',
                  disabled: false,
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectFields')}}",
              },
            ],
          },
        },
      },

      // 模板下载
      templateDownload: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.templateDownload')}}",
          defaultOpen: true,
        },
        properties: {
          template_info: {
            type: 'void',
            title: "{{t('purchase.templateInfo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'FormGrid',
            'x-component-props': {
              columns: 1,
            },
            properties: {
              template_name: {
                type: 'string',
                title: "{{t('purchase.templateName')}}",
                'x-component': 'PreviewText',
                'x-component-props': {
                  value: t('purchase.excelTemplate'),
                },
              },
              download_button: {
                type: 'void',
                title: "{{t('purchase.downloadTemplate')}}",
                'x-component': 'ElButton',
                'x-component-props': {
                  type: 'primary',
                  onClick: 'downloadTemplate',
                },
              },
            },
          },
        },
      },

      // 文件上传
      fileUpload: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.fileUpload')}}",
          defaultOpen: true,
        },
        properties: {
          import_file: {
            type: 'string',
            title: "{{t('purchase.importFile')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Upload',
            'x-component-props': {
              accept: '.xls,.xlsx',
              maxSize: 2 * 1024 * 1024, // 2MB
              maxCount: 1,
              multiple: false,
              drag: true,
              showFileList: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectFile')}}",
              },
              {
                validator: (value) => {
                  if (value && value.length > 0) {
                    const file = value[0];
                    if (!file.name.match(/\.(xls|xlsx)$/)) {
                      return t('purchase.fileFormatError');
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      return t('purchase.fileSizeError');
                    }
                  }
                  return true;
                },
              },
            ],
          },
        },
      },

      // 导入说明
      importInstructions: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.importInstructions')}}",
          defaultOpen: false,
        },
        properties: {
          instructions: {
            type: 'void',
            title: "{{t('purchase.instructions')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'FormGrid',
            'x-component-props': {
              columns: 1,
            },
            properties: {
              instruction_1: {
                type: 'string',
                title: "{{t('purchase.instruction1')}}",
                'x-component': 'PreviewText',
                'x-component-props': {
                  value: t('purchase.instruction1Text'),
                },
              },
              instruction_2: {
                type: 'string',
                title: "{{t('purchase.instruction2')}}",
                'x-component': 'PreviewText',
                'x-component-props': {
                  value: t('purchase.instruction2Text'),
                },
              },
              instruction_3: {
                type: 'string',
                title: "{{t('purchase.instruction3')}}",
                'x-component': 'PreviewText',
                'x-component-props': {
                  value: t('purchase.instruction3Text'),
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
      import_type: 1,
      selected_fields: ['vendor_name', 'contact_name', 'phone_number', 'address'],
      template_file: null,
      import_file: null,
      merchant_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: PurchaseListImportFormData) => {
    try {
      // 调用 API
      const response = await purchaseApi.importPurchaseList(values);
      return response;
    } catch (error) {
      console.error('Purchase list import form submission error:', error);
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
  const setFormValues = (values: Partial<PurchaseListImportFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 下载模板
  const downloadTemplate = async () => {
    try {
      const response = await purchaseApi.downloadImportTemplate();
      return response;
    } catch (error) {
      console.error('Download template error:', error);
      throw error;
    }
  };

  // 获取导入字段列表
  const getImportFields = (): ImportField[] => {
    return [
      {
        id: 1,
        name: t('purchase.vendorName'),
        isChack: true,
        disabled: true,
      },
      {
        id: 2,
        name: t('purchase.contactName'),
        isChack: true,
        disabled: true,
      },
      {
        id: 3,
        name: t('purchase.phoneNumber'),
        isChack: true,
        disabled: true,
      },
      {
        id: 4,
        name: t('purchase.image'),
        isChack: false,
        disabled: false,
      },
      {
        id: 5,
        name: t('purchase.address'),
        isChack: true,
        disabled: false,
      },
      {
        id: 6,
        name: t('purchase.taxNumber'),
        isChack: false,
        disabled: false,
      },
    ];
  };

  // 切换字段选择
  const toggleFieldSelection = (fieldId: number) => {
    const currentFields = formApi.getValues().selected_fields || [];
    const field = getImportFields().find(f => f.id === fieldId);

    if (field && !field.disabled) {
      const fieldValue = getFieldValueById(fieldId);
      if (currentFields.includes(fieldValue)) {
        // 移除字段
        const newFields = currentFields.filter(f => f !== fieldValue);
        formApi.setFieldValue('selected_fields', newFields);
      } else {
        // 添加字段
        const newFields = [...currentFields, fieldValue];
        formApi.setFieldValue('selected_fields', newFields);
      }
    }
  };

  // 根据字段ID获取字段值
  const getFieldValueById = (fieldId: number): string => {
    const fieldMap: { [key: number]: string } = {
      1: 'vendor_name',
      2: 'contact_name',
      3: 'phone_number',
      4: 'image',
      5: 'address',
      6: 'tax_number',
    };
    return fieldMap[fieldId] || '';
  };

  // 检查字段是否选中
  const isFieldSelected = (fieldId: number): boolean => {
    const currentFields = formApi.getValues().selected_fields || [];
    const fieldValue = getFieldValueById(fieldId);
    return currentFields.includes(fieldValue);
  };

  // 获取选中的字段列表
  const getSelectedFields = (): ImportField[] => {
    const currentFields = formApi.getValues().selected_fields || [];
    return getImportFields().filter(field =>
      currentFields.includes(getFieldValueById(field.id))
    );
  };

  // 验证文件格式
  const validateFileFormat = (file: File): boolean => {
    const allowedTypes = ['.xls', '.xlsx'];
    const fileName = file.name.toLowerCase();
    return allowedTypes.some(type => fileName.endsWith(type));
  };

  // 验证文件大小
  const validateFileSize = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    return file.size <= maxSize;
  };

  // 验证文件行数
  const validateFileRows = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // 这里可以添加文件行数验证逻辑
      // 实际实现需要读取Excel文件内容
      resolve(true);
    });
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
    downloadTemplate,
    getImportFields,
    toggleFieldSelection,
    isFieldSelected,
    getSelectedFields,
    validateFileFormat,
    validateFileSize,
    validateFileRows,
  };
}
