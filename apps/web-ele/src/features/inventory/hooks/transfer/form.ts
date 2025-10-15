import type { ISchema } from '@igourd/common-ui';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';
import { inject } from 'vue';
import { onFieldValueChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createTransfer,
  getTransferDetail,
  modifyTransfer,
  wareHouseProductSearch,
} from '@@/inventory/apis';

import { orderNoGenerate } from '#/api/common';
import { useWarehouseSelect } from '#/hooks';
import { useDrawerForm } from '#/hooks/use-drawer-form';
import { floorDecimal, retainDecimal8,} from '#/utils/eleValidate';

import { useMerchantSelect } from './use-merchant-select';

export function useTransferForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();
  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('count.creator')}:`;
  const { gridApi } = inject<{
      gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'));

  // 调拨类型
  const transferTypeList = [
    {
      label: t('inventory.sameStoreTransfer'),
      value: 'TRANSFER_SAME_STORE',
    },
    {
      label: t('inventory.differentStoreTransfer'),
      value: 'TRANSFER_DIFFERENT_STORE',
    },
    {
      label: t('inventory.transferOut'),
      value: 'TRANSFER_IN_ONLY',
    },
    {
      label: t('inventory.transferIn'),
      value: 'TRANSFER_OUT_ONLY',
    },
  ];
  const { currentLoginUserApp } = useUserStore();
  const merchantList = useMerchantSelect({ id: currentLoginUserApp.owner_id });
  const destinationWarehouse = useWarehouseSelect();
  // 重置表单
  const initForm = (form) => {
    form.setFieldState('source_merchant_id', (f) => {
      f.disabled = false;
    });
    form.setFieldState('destination_merchant_id', (f) => {
      f.disabled = false;
    });
    form.setFieldState('destination_warehouse_id', (f) => {
      f.disabled = true;
    });
    form.setFieldState('row_0', (f) => {
      f.hidden = false;
    });
    form.setFieldState('row_1', (f) => {
      f.hidden = false;
    });
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
          'hide-required-asterisk': true,
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
          transfer_type: {
            type: 'string',
            title: "{{t('transfer.transfer-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              maxLength: 256,
              placeholder: "{{t('common.select')}}",
              clearable: true,
            },
            enum: transferTypeList,
          },
          row_0: {
            type: 'void', // 表示空字段
            title: "{{t('transfer.source-warehouse-name')}}", // formItem 的 label
            'x-component': 'Space',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              asterisk: true, // label 上显示必填的 * 号
              feedbackLayout: 'none',
            },
            properties: {
              source_merchant_id: {
                type: 'string',
                title: '',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-reactions': {
                  fulfill: {
                    state: {
                      dataSource: '{{ merchantList.value }}',
                    },
                  },
                },
                'x-component-props': {
                  style: { width: '300px', marginRight: '10px' },
                  colon: false,
                },
              },
              source_warehouse_id: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': {
                  label: '',
                },
                'x-component-props': {
                  style: 'width: 240px;',
                  colon: false,
                },
                'x-reactions': {
                  fulfill: {
                    state: {
                      dataSource: '{{ warehouse.value }}',
                    },
                  },
                },
              },
            },
          },
          row_1: {
            type: 'void', // 表示空字段
            title: "{{t('transfer.destination-warehouse-name')}}", // formItem 的 label
            'x-component': 'Space',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              asterisk: true, // label 上显示必填的 * 号
              feedbackLayout: 'none',
            },
            properties: {
              destination_merchant_id: {
                type: 'string',
                title: '',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-reactions': {
                  fulfill: {
                    state: {
                      dataSource: '{{ merchantList.value }}',
                    },
                  },
                },
                'x-decorator-props': {
                  class: 'abcd',
                },
                'x-component-props': {
                  style: { width: '300px', marginRight: '10px' },
                },
              },
              destination_warehouse_id: {
                type: 'string',
                title: '',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: 'width: 240px;',
                  colon: false,
                },
                'x-reactions': {
                  fulfill: {
                    state: {
                      dataSource: '{{ warehouse.value }}',
                    },
                  },
                },
              },
            },
          },
          stock_transfer_item_list: {
            type: 'array',
            'x-component': 'ProductTable',
            'x-component-props': {
              mode: 'transfer',
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
          row_2: {
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
                            'x-content':
                              "{{t('transfer.total-transfer-quantity')}} ",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          total_transfer_quantity: {
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
                            'x-content':
                              "{{t('transfer.total-transfer-product-price')}} ",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          total_amount: {
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
  const totalFun = (items) => {
    // 计算调拨商品总数量
    const totalTransferQuantity = items.reduce(
      (sum, item) =>
        floorDecimal(
          sum + Number(retainDecimal8(item.transfer_quantity, 0) || 0),
          0,
        ),
      0,
    );
    console.log(totalTransferQuantity, 'totalTransferQuantity');

    // 计算调拨商品总成本金额 = 调拨数量 * 成本价
    const subTotalAmount = items
      .reduce(
        (sum, item) =>
          sum +
          Number(item.transfer_quantity || 0) *
            Number(item.product_cost_price || 0),
        0,
      )
      .toFixed(2);

    // 计算调拨商品总金额(含税) = 调拨数量 * 销售价
    const totalAmount = items
      .reduce(
        (sum, item) =>
          sum +
          Number(item.transfer_quantity || 0) *
            Number(item.product_cost_price || 0),
        0,
      )
      .toFixed(2);
    return {
      totalTransferQuantity,
      subTotalAmount,
      totalAmount,
    };
  };
  // 表单提交处理
  const handleSubmit = async (formData: PurchaseCodeRulesFormData) => {
    try {
      let response = null;
      if (!formData.id) {
        const result = await orderNoGenerate({
          category_type: 'STOCK_TRANSFER',
        });
        formData.stock_transfer_no = result.order_no;
      }
      // 	VAT配置
      formData.vat_configuration = 'NOT_APPLICATION';
      // 汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0.14;
      // 结算货币编码
      formData.currency_code = 'CNY';
      const { totalTransferQuantity, subTotalAmount, totalAmount } = totalFun(
        formData.stock_transfer_item_list,
      );
      formData.subtotal_amount = subTotalAmount;
      formData.total_amount = totalAmount;
      formData.total_transfer_quantity = totalTransferQuantity;
      const params = JSON.parse(JSON.stringify(formData));

      // 处理数据 basic_unit_radio
      params.stock_transfer_item_list.forEach((item) => {
        item.basic_unit_radio = 1;
        item.product_name = item.major_name;
        // 库存数量
        item.stock_quantity = item.stock_total_quantity;
        // 考虑单位换算比例
        const unitRatio = Number(item.basic_unit_radio || 1); // 获取单位比例，默认为1
        const transferQty = floorDecimal(item.transfer_quantity, 0);
        const stockQty = Number(item.stock_quantity);

        // 将输入的调拨数量转换为基础单位数量进行比较
        const convertedTransferQty = transferQty * unitRatio;
        // 计算剩余数量 = 库存数量 - 调拨数量（基础单位）
        item.remaining_quantity =
          params.transfer_type === 'TRANSFER_IN_ONLY'
            ? floorDecimal(stockQty + convertedTransferQty, 0)
            : stayFloatSub(stockQty, convertedTransferQty);
        item.product_cost_price = item.cost_price;

      });
      // 如果仅入库和仅出库 初始化id 0
      if (params.transfer_type === 'TRANSFER_IN_ONLY') {
        params.source_merchant_id = 0;
        params.source_warehouse_id = 0;
      }
      if (params.transfer_type === 'TRANSFER_OUT_ONLY') {
        params.destination_merchant_id = 0;
        params.destination_warehouse_id = 0;
      }
      // 调用 API
      response = await (params.id
        ? modifyTransfer({
            ...params,
          })
        : createTransfer({
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
      title: t('transfer.add-transfer'),
      appendToMain: true,
      class: 'w-2/3',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          // 编辑
          if (data.id) {
            const detail = await getTransferDetail({
              stock_transfer_id: data.id,
            });
            detail.stock_transfer_item_list =
              detail.stock_transfer_item_model_list;
            formAPI.setValues(detail);
          } else {
            formAPI.setValues({ stock_transfer_item_list: [{}] });
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
        stock_transfer_item_list: [{}],
      },
      schema,
      scope: {
        warehouse,
        userName,
        userLabel,
        merchantList,
        destinationWarehouse,
        totalFun,
      },
      effects() {
        onFieldValueChange('transfer_type', (field, form: Form) => {
          initForm(form);
          // 同门店
          switch (field.value) {
            case 'TRANSFER_DIFFERENT_STORE': {
              form.setFieldState('source_merchant_id', (f) => {
                f.disabled = true;
              });
              form.setFieldState('destination_merchant_id', (f) => {
                f.disabled = false;
              });
              form.setFieldState('destination_warehouse_id', (f) => {
                f.disabled = true;
              });

              break;
            }
            case 'TRANSFER_IN_ONLY': {
              form.setFieldState('row_0', (f) => {
                f.hidden = true;
              });
              form.setFieldState('row_1', (f) => {
                f.hidden = false;
              });

              break;
            }
            case 'TRANSFER_OUT_ONLY': {
              form.setFieldState('row_0', (f) => {
                f.hidden = false;
              });
              form.setFieldState('row_1', (f) => {
                f.hidden = true;
              });
              break;
            }
            case 'TRANSFER_SAME_STORE': {
              form.setFieldState('source_merchant_id', (f) => {
                f.disabled = true;
              });
              form.setFieldState('destination_merchant_id', (f) => {
                f.disabled = true;
              });
              form.setFieldState('destination_warehouse_id', (f) => {
                f.disabled = false;
              });

              break;
            }
            // No default
          }
        });
        onFieldValueChange('stock_transfer_item_list.*', (field, form) => {
          const { totalTransferQuantity, totalAmount } = totalFun(
            field.records,
          );
          console.log(totalAmount, totalTransferQuantity);

          form.setValuesIn('total_amount', `${totalAmount} `);
          form.setValuesIn(
            'total_transfer_quantity',
            `${totalTransferQuantity} `,
          );
        });
        // 目标商家 仓库
        onFieldValueChange('destination_merchant_id', (field, form: Form) => {
          destinationWarehouse.value = useWarehouseSelect({
            destination_mearchant_id: field.value,
          });
          form.setFieldState('destination_warehouse_id', (f) => {
            f.disabled = false;
          });
        });
      },
    },
  });
  return { Form, formAPI, Drawer, drawerApi };
}
