import type { ISchema } from '@igourd/common-ui';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';
import { inject } from 'vue';
import { onFieldValueChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';



import { createCount, getCountDetail, updateCount } from '@@/inventory/apis';
import { dayjs } from 'element-plus';

import { orderNoGenerate } from '#/api/common';
import { useWarehouseSelect } from '#/hooks';
import { useDrawerForm } from '#/hooks/use-drawer-form';
import { floorDecimal, retainDecimal8 } from '#/utils/eleValidate';

import { wareHouseProductSearch } from '../../apis';

const summary = (list) => {
  // 盘点商品总成本差值金额 总成本差值金额 = 原数量 * 成本价 - 盘点数量 * 成本价
  const totalVarianceCost = list.reduce(
    (acc, item) =>
      acc + Number(item.returned_quantity || 0) * Number(item.cost_price || 0),
    0,
  );
  // 计算total_variance_selling_price
  const totalVarianceSellingPriceOrigin = list.reduce(
    (acc, item) =>
      acc + Number(item.origin_quantity || 0) * Number(item.selling_price || 0),
    0,
  );
  const totalVarianceSellingPrice = list.reduce(
    (acc, item) =>
      acc +
      Number(item.physical_quantity || 0) * Number(item.selling_price || 0),
    0,
  );
  // 点商品总成本差值金额
  const totalVarianceCostChange = retainDecimal8(
    totalVarianceCost - totalVarianceSellingPriceOrigin,
    2,
  );
  // 盘点差额总数量
  // 计算总数量差异 - 确保每次从0开始累加
  const totalVarianceQuantity = floorDecimal(
    list.reduce((sum, item) => sum + Number(item.variance_quantity || 0), 0),
    8,
  );
  // 盘点商品总售价差值金额
  const totalVarianceSellingPriceChange = retainDecimal8(
    totalVarianceSellingPrice - totalVarianceSellingPriceOrigin,
    2,
  );
  return {
    totalVarianceCost: totalVarianceCostChange,
    totalVarianceQuantity,
    totalVarianceSellingPrice: totalVarianceSellingPriceChange,
  };
};
// 计算数量差异
const countVarianceQuantity = (item) => {
  // 只处理已选产品的项目
  const physicalQty = Number(item.physical_quantity || 0);
  const originQty = Number(item.stock_total_quantity || 0);
  const unitRatio = Number(item.basic_unit_radio || 1);

  // 重新计算数量差异
  const variance_quantity =
    unitRatio > 1
      ? floorDecimal(physicalQty * unitRatio - originQty, 0)
      : floorDecimal(physicalQty - originQty, 0);
  return variance_quantity;
};
export function useCountForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();
  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('count.creator')}:`;
  const { gridApi } = inject<{
      gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'));

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

      const params = JSON.parse(JSON.stringify(formData));
      // 处理数据 basic_unit_radio
      params.physical_stock_take_item_list.forEach((item) => {
        item.basic_unit_radio = 1;
        item.product_name = item.major_name;
        // 盘点差额数量
        item.variance_quantity = countVarianceQuantity(item);
        // 盘点商品原有数量
        item.origin_quantity = item.stock_total_quantity;

      });

      const {
        totalVarianceCost,
        totalVarianceQuantity,
        totalVarianceSellingPrice,
      } = summary(params.physical_stock_take_item_list);
      params.total_variance_cost = totalVarianceCost;
      params.total_variance_quantity = totalVarianceQuantity;
      params.total_variance_selling_price = totalVarianceSellingPrice;
      // 调用 API
      response = await (params.id
        ? updateCount({
            ...params,
          })
        : createCount({
            ...params,
          }));
          gridApi.reload()
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
                  class: 'text-red-500',
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
          physical_stock_take_item_list: {
            type: 'array',
            'x-component': 'ProductTable',
            'x-component-props': {
              mode: 'physical',
              // capabilities: [
              //   'barcode',
              //   'unit',
              //   'vat',
              //   'discount',
              //   'stock',
              //   'image',
              //   'remark',
              // ],
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
          row_1: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              class: 'w-full flex mt-10 mb-10',
              style: {},
            },
            properties: {
              row_col_0: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  class: 'w-2/3',
                  style: {},
                },
                properties: {
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
                },
              },
              row_col_1: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  class: 'w-1/3 flex items-center justify-center mt-6 mb-6',
                  style: {
                    background: '#edf5ff',
                  },
                },
                properties: {
                  center: {
                    type: 'void',
                    'x-component': 'div',
                    properties: {
                      label_1: {
                        type: 'void',
                        'x-component': 'div',
                        'x-component-props': {
                          class: 'flex',
                        },
                        properties: {
                          c: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': "{{t('count.diff-num')+' : '}}",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          diffNum: {
                            type: 'string',
                            'x-component': 'div',
                            'x-content': "{{$self.value?$self.value:'0'}}",
                            'x-component-props': {
                              style: {},
                            },
                          },
                        },
                      },
                      label_2: {
                        type: 'void',
                        'x-component': 'div',
                        'x-component-props': {
                          class: 'flex',
                        },
                        properties: {
                          c: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': "{{t('count.diff-cost')+' : '}}",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          diffCost: {
                            type: 'string',
                            'x-component': 'div',
                            'x-content': "{{$self.value?$self.value:'0'}}",
                            'x-component-props': {
                              style: {},
                            },
                          },
                        },
                      },
                      label_3: {
                        type: 'void',
                        'x-component': 'div',
                        'x-component-props': {
                          class: 'flex',
                        },
                        properties: {
                          c: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': "{{t('count.diff-sale')+' : '}}",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          diffSale: {
                            type: 'string',
                            'x-component': 'div',
                            'x-content': "{{$self.value?$self.value:'0'}}",
                            'x-component-props': {
                              style: {},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          attachment_url: {
            type: 'string',
            title: "{{t('common.attachment')}}",
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
            detail.physical_stock_take_item_list =
              detail.physical_stock_take_item_models;
            detail.returned_quantity = detail.physical_total_quantity;
            formAPI.setValues(detail);
          } else {
            // 增加时，保留1条数据
            formAPI.setValues({ physical_stock_take_item_list: [{}] });
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
      initialValues: { physical_stock_take_item_list: [{}] },
      schema,
      scope: {
        userLabel,
        warehouse,
        userName,
      },
      effects() {
        onFieldValueChange('warehouse_id', (field) => {
          console.log(`target值变化：${field.value}`);
        });
        onFieldValueChange('physical_stock_take_item_list.*', (field, form) => {
          const {
            totalVarianceCost,
            totalVarianceQuantity,
            totalVarianceSellingPrice,
          } = summary(field.records);

          form.setValuesIn('diffNum', totalVarianceQuantity);
          form.setValuesIn('diffCost', totalVarianceCost);
          form.setValuesIn('diffSale', totalVarianceSellingPrice);
        });
      },
    },
  });

  return { Form, formAPI, Drawer, drawerApi };
}
