import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createInventoryStock,
  getInventoryStockDetail,
  modifyInventoryStock,
  wareHouseProductSearch,
} from '@@/inventory/apis';

import { useWarehouseSelect } from '#/hooks';
import { useDrawerForm } from '#/hooks/use-drawer-form';

import { inventoryReasonList } from './enum';

export function useListForm() {
  const { t } = useI18n();
  // 翻译字典
  inventoryReasonList.forEach((item) => {
    item.label = t(item.label);
  });

  const warehouse = useWarehouseSelect();
  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('count.creator')}:`;

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
            title: "{{t('spoilage.warehouse-name')}}",
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
                message: "{{t('spoilage.warehouse-name-validate')}}",
              },
            ],
          },
          last_add_stock_reason: {
            type: 'string',
            title: "{{t('list.add-inventory-reason')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: inventoryReasonList,
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.select')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('spoilage.consumption-reason-validate')}}",
              },
            ],
          },
          product: {
            type: 'array',
            'x-component': 'ProductTable',
            'x-component-props': {
              mode: 'inventory',
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
              maxlength: 256,
              rows: 5,
              'show-word-limit': true,
            },
          },
          attachment_url: {
            type: 'string',
            title: "{{t('common.Attachment')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Upload',
            'x-component-props': {
              action: 'https://formily-vue.free.beeceptor.com/file',
              drag: true,
            },
          },
        },
      },
    },
  };
  const totalFun = (formData) => {
    const items = formData.stock_consumption_item_list;
  };
  // 表单提交处理
  const handleSubmit = async (formData: PurchaseCodeRulesFormData) => {
    try {
      let response = null;
      // 仓位ID(暂时默认传个1)
      formData.warehouse_location_id = 1;
      const params = JSON.parse(JSON.stringify(formData));
      const keysToCopy = [
        'product_code',
        'product_id',
        'product_name',
        'product_group_id',
        'product_unit_name',
        'merchant_id',
        'basic_product_id',
        'sku_group_code',
        'stock_quantity',
        'basic_unit_radio',
      ];
      const list = params.product.map((item) => {
        const partialCopy = keysToCopy.reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {});
        partialCopy.product_id = item.id;
        partialCopy.basic_unit_radio = 1;
        partialCopy.product_name = item.major_name;
        return partialCopy;
      });
      params.product = list;
      if (params.id) {
        response = await modifyInventoryStock({
          ...params,
        });
      } else {
        // 调用 API
        response = await createInventoryStock({
          ...params,
        });
      }
      return response;
    } catch (error) {
      console.error('调拨单 customized form submission error:', error);
      throw error;
    }
  };
  const { Form, formAPI, Drawer, drawerApi } = useDrawerForm({
    drawerOptions: {
      title: t('list.add-stock'),
      appendToMain: true,
      class: 'w-2/3',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          // 编辑
          if (data.id) {
            const detail = await getInventoryStockDetail({
              stock_id: data.id,
            });
            detail.product_model.stock_quantity = detail.stock_quantity;
            detail.product = [detail.product_model];
            // detail.returned_quantity = detail.physical_total_quantity;
            formAPI.setValues(detail);
          }
        } else {
          // 关闭抽屉时，重置表单
          formAPI.values = {};
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
      initialValues: {
        product: [{}],
      },
      schema,
      scope: {
        warehouse,
        userName,
        userLabel,
      },
    },
  });
  return { Form, formAPI, Drawer, drawerApi };
}
