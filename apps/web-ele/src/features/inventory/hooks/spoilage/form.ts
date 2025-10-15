import type { ISchema } from '@igourd/common-ui';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';
import { inject } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createSpoilage,
  getSpoilageDetail,
  modifySpoilage,
  wareHouseProductSearch,
} from '@@/inventory/apis';
import { dayjs } from 'element-plus';

import { orderNoGenerate } from '#/api/common';
import { useWarehouseSelect } from '#/hooks';
import { useDrawerForm } from '#/hooks/use-drawer-form';
import { floorDecimal } from '#/utils/eleValidate';

export function useSpoilageForm() {
  const { t } = useI18n();
  const { gridApi } = inject<{
      gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'));
  // 枚举报损原因
  const consumptionReason = [
    {
      value: 'EXPIRED_GOODS',
      label: t('spoilage.consumption-reason-enum.expired-products'),
    },
    {
      value: 'DAMAGED_GOODS',
      label: t('spoilage.consumption-reason-enum.damaged-products'),
    },
    {
      value: 'PERSONAL_USES',
      label: t('spoilage.consumption-reason-enum.personal-use'),
    },
    {
      value: 'RAW_MATERIALS',
      label: t('spoilage.consumption-reason-enum.raw_materials'),
    },
    {
      value: 'OTHERS',
      label: t('spoilage.consumption-reason-enum.others'),
    },
  ];

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
          consumption_reason: {
            type: 'string',
            title: "{{t('spoilage.consumption-reason')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: consumptionReason,
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
          stock_consumption_item_list: {
            type: 'array',
            'x-component': 'ProductTable',
            'x-component-props': {
              mode: 'spoilage',
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
      if (!formData.id) {
        const result = await orderNoGenerate({
          category_type: 'INVENTORY_WRITE_OFF',
        });
        formData.stock_consumption_no = result.order_no;
      }
      formData.consumption_date = dayjs().format('YYYY-MM-DD HH:mm:ss');
      // 	VAT配置
      formData.vat_configuration = 'NOT_APPLICATION';
      // 汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0.14;
      // 结算货币编码
      formData.currency_code = 'CNY';
      // 计算总数量
      formData.total_spoilage_quantity =
        formData.stock_consumption_item_list.reduce(
          (acc, item) => acc + floorDecimal(item.consumption_quantity, 0),
          0,
        );
      formData.stock_consumption_item_list.forEach((item) => {
        item.subtotal_amount = (
          item.consumption_quantity * item.cost_price
        ).toFixed(0);
      });
      const total = formData.stock_consumption_item_list.reduce(
        (acc, item) => acc + item.consumption_quantity * item.cost_price,
        0,
      );
      formData.subtotal_amount = total.toFixed(0);
      formData.total_amount = total.toFixed(0);
      formData.stock_consumption_item_list.forEach((item) => {
        item.consumption_quantity = floorDecimal(item.consumption_quantity, 0);
      });
      const params = JSON.parse(JSON.stringify(formData));
      // 处理数据 basic_unit_radio
      params.stock_consumption_item_list.forEach((item) => {
        item.basic_unit_radio = 1;
        item.product_name = item.major_name;
        // 库存数量
        item.stock_quantity = item.stock_total_quantity;

        item.product_cost_price = item.cost_price;

      });
      // 调用 API
      response = await (params.id
        ? modifySpoilage({
            ...params,
          })
        : createSpoilage({
            ...params,
          }));
      gridApi.reload();
      return response;
    } catch (error) {
      console.error('调拨单 customized form submission error:', error);
      throw error;
    }
  };
  const { Form, formAPI, Drawer, drawerApi } = useDrawerForm({
    drawerOptions: {
      title: t('spoilage.add-stock-consumption-save'),
      appendToMain: true,
      class: 'w-2/3',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          // 编辑
          if (data.id) {
            const detail = await getSpoilageDetail({
              stock_consumption_id: data.id,
            });
            detail.returned_quantity = detail.physical_total_quantity;
            formAPI.setValues(detail);
          } else {
            formAPI.setValues({ stock_consumption_item_list: [{}] });
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
        stock_consumption_item_list: [{}],
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
