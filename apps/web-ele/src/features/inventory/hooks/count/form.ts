import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { createCount, getCountDetail, updateCount } from '@@/inventory/apis';
import { dayjs } from 'element-plus';

import { orderNoGenerate } from '#/api/common';
import { useWarehouseSelect } from '#/hooks';
import { useDrawerForm } from '#/hooks/use-drawer-form';

import { wareHouseProductSearch } from '../../apis';

export function useCountForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();
  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('count.creator')}:`;

  // 表单提交处理
  const handleSubmit = async (formData: PurchaseCodeRulesFormData) => {
    try {
      let response = null;
      // 	VAT配置
      formData.vat_configuration = 'NOT_APPLICATION';
      formData.total_variance_cost = '';
      // 其他税额
      formData.other_tax_amount = 100;
      // 盘点单No 新增时 生成订单号
      if (!formData.id) {
        const result = await orderNoGenerate({
          category_type: 'PHYSICAL_STOCK_TAKE',
        });
        formData.physical_stock_take_no = result.order_no;
      }
      // 汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0.14;
      // 结算货币编码
      formData.currency_code = 'CNY';
      if (formData.physical_stock_take_date) {
        formData.physical_stock_take_date = dayjs(
          formData.physical_stock_take_date,
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      // 调用 API
      response = await (formData.id
        ? updateCount({
            ...formData,
          })
        : createCount({
            ...formData,
          }));
      func('refresh-tree');
      return response;
    } catch (error) {
      console.error('盘点单 customized form submission error:', error);
      throw error;
    }
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          layout: 'vertical',
        },
        properties: {
          label: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {
              style: { marginBottom: '10px' },
            },
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-content': '{{userLabel}}',
                'x-component-props': {
                  style: { fontSize: '14px' },
                },
              },
              d: {
                type: 'void',
                'x-component': 'div',
                'x-content': '{{userName}}',
                'x-component-props': {
                  style: { color: 'red' },
                },
              },
            },
          },

          warehouse_id: {
            type: 'string',
            title: "{{t('count.warehouse-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              maxLength: 256,
              placeholder: "{{t('common.select')}}",
              clearable: true,
            },
            'x-reactions': {
              fulfill: {
                state: {
                  dataSource: '{{ warehouse.value }}',
                },
              },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('product-group.please-select-level')}}",
              },
            ],
          },
          physical_stock_take_date: {
            type: 'string',
            title: "{{t('count.physical-stock-take-date')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'DatePicker',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.select')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('product-group.please-select-level')}}",
              },
            ],
          },
          physical_stock_take_item_models: {
            type: 'array',
            'x-component': 'ProductTable',
            'x-component-props': {
              mode: 'return',
              capabilities: [
                'barcode',
                'unit',
                'vat',
                'discount',
                'stock',
                'image',
                'remark',
              ],
              vatMode: 'VAT_EXCLUSIVE',
              // 业务标记（用于单位禁用逻辑兼容旧条件）
              isReceiptMode: false,
              purchaseOrderSelected: false,
              // 可选：展示/校验库存
              searchProducts: (keywords: string) => {
                return wareHouseProductSearch({
                  keywords,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  warehouse_id: '',
                  // business_type: 'purchase',
                  page_num: 1,
                  page_size: 20,
                }).then(({ list }) => {
                  return list.map((item: any) => {
                    return {
                      ...item,
                      value: item.id,
                      label: [item.major_name, item.product_spec_kvmessage]
                        .filter(Boolean)
                        .join('-'),
                    };
                  });
                });
              },
            },
          },
          remark: {
            type: 'string',
            title: "{{t('common.remarks')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxlength: 32,
              'show-word-limit': true,
              style: { width: '100%' },
            },
          },
          drag: {
            type: 'array',
            title: "{{t('common.Attachment')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Upload',
            'x-component-props': {
              action: 'https://formily-vue.free.beeceptor.com/file',
              textContent: '将文件拖到此处，或者点击上传',
              drag: true,
            },
          },
        },
      },
    },
  };
  const { Form, formAPI, Drawer, drawerApi } = useDrawerForm({
    drawerOptions: {
      title: t('count.addInventoryCountSave'),
      appendToMain: true,
      class: 'md:w-2/3',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          // 编辑
          if (data.id) {
            const detail = await getCountDetail({
              physical_stock_take_id: data.id,
            });
            formAPI.setValues(detail);
          }
        }
      },
      onClosed() {
        formAPI.reset();
      },
      async onConfirm() {
        await formAPI.validate();
        drawerApi.lock();
        await handleSubmit(formAPI.values as PurchaseCodeRulesFormData)
          .then(() => {
            drawerApi.close();
          })
          .finally(() => {
            drawerApi.unlock();
          });
      },
    },
    formOptions: {
      initialValues: { physical_stock_take_item_models: [{}] },
      schema,
      scope: {
        userLabel,
        warehouse,
        userName,
      },
    },
  });

  return { Form, formAPI, Drawer, drawerApi };
}
