import { useI18n } from '@igourd/locales';
import {
  useIgourdDrawer,
  useIgourdForm,
  type ISchema,
} from '@igourd/common-ui';
import {
  productSearch,
  purchaseApi,
  warehouseProductPageList,
  getPurchaseDetailApi,
} from '../apis';
import { useUserStore } from '@igourd/stores';

export function usePurchaseOrderForm() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      headerGrid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: [2, 3, 3],
          minColumns: [1, 2, 2],
          columnGap: 16,
        },
        properties: {
          vendor_id: {
            type: 'string',
            title: '{{ t("purchase.selectVendor") }}', // ✅ 保持
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              filterable: true,
              clearable: true,
              placeholder: '{{ t("purchase.pleaseSelectVendor") }}', // ✅ 保持
            },
          },

          warehouse_id: {
            type: 'string',
            title: '{{ t("purchase.selectWarehouse") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              filterable: true,
              clearable: true,
              placeholder: '{{ t("purchase.pleaseSelectWarehouse") }}',
            },
          },

          purchase_date: {
            type: 'string',
            title: '{{ t("purchase.date") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'DatePicker',
            'x-component-props': { type: 'date', style: { width: '100%' } },
          },

          vat_configuration: {
            type: 'string',
            title: '{{ t("purchase.vat") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              {
                label: '{{ t("purchase.not_applicable") }}',
                value: 'NOT_APPLICATION',
              },
              {
                label: '{{ t("purchase.VAT_inclusive") }}',
                value: 'VAT_INCLUSIVE',
              },
              {
                label: '{{ t("purchase.VAT_exclusive") }}',
                value: 'VAT_EXCLUSIVE',
              },
            ],
            'x-component-props': {
              clearable: true,
              placeholder: '{{ t("purchase.pleaseVatConfiguration") }}',
            },
          },

          currency_code: {
            type: 'string',
            title: '{{ t("purchase.currency") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': { clearable: true },
          },

          // display_exchange_rate: {
          //   type: 'number',
          //   title: '{{ t("purchase.exchangeRate") }}',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Input',
          //   'x-read-pretty': true,
          //   'x-component-props': { disabled: true },
          // },

          deposit_amount: {
            type: 'number',
            title: '{{ t("purchase.deposit") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'InputNumber',
            'x-component-props': {
              min: 0,
              precision: 2,
              placeholder: '{{ t("purchase.inputDeposit") }}',
            },
          },
        },
      },

      // ===== 商品明细（自定义组件） =====
      purchase_order_item_model_list: {
        type: 'void',
        title: '{{ t("purchase.products") }}',
        'x-decorator': 'FormItem',
        'x-component': 'ProductArrayTable',
        'x-component-props': {
          merchantId: currentLoginUserApp.owner_id,
          type: 'purchase',
          // ⛔️ 不建议在 props 里用复杂表达式去取 form 值
          // initialWarehouseId: '{{ $form.values.warehouse_id }}',
          // InventoryService: '{{ InventoryService }}',
        },
        // ✅ 用 reactions 把联动值写入组件 props，稳定可追踪
        'x-reactions': [
          {
            dependencies: ['warehouse_id'],
            fulfill: {
              run: '$self.componentProps.initialWarehouseId = $form.values.warehouse_id',
            },
          },
          // 如果你要把某个服务注入，也可以：
          // { fulfill: { run: 'field.componentProps.InventoryService = $scope.InventoryService' } }
        ],
      },

      remark: {
        type: 'string',
        title: '{{ t("purchase.remark") }}',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          rows: 2,
          maxlength: 128,
          showWordLimit: true,
          placeholder: '{{ t("common.enterRemark") }}',
        },
      },

      attachment_url: {
        type: 'string',
        title: '{{ t("purchase.attachment") }}',
        'x-decorator': 'FormItem',
        'x-component': 'Upload',
        'x-component-props': { limit: 1 },
      },

      summaryGrid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: [1, 2, 2],
          minColumns: [1, 1, 1],
          columnGap: 16,
        },
        properties: {
          subtotal_amount: {
            type: 'string',
            title: '{{ t("purchase.subtotal") }}', // ✅ 修正
            'x-decorator': 'FormItem',
            'x-component': 'PreviewText.Input',
            'x-reactions': [
              {
                fulfill: {
                  state: {
                    value:
                      '{{ ($form.values.purchase_order_iterm_list || []).reduce((acc, it) => acc + ((+it.quantity || 0) * (+it.cost_price || 0)), 0).toFixed(2) }}',
                  },
                },
              },
            ],
          },

          vat_amount: {
            type: 'string',
            title: '{{ t("purchase.VAT") }}', // ✅ 修正
            'x-decorator': 'FormItem',
            'x-component': 'PreviewText.Input',
          },

          other_tax_amount: {
            type: 'string',
            title: '{{ t("purchase.other_tax") }}', // ✅ 修正
            'x-decorator': 'FormItem',
            'x-component': 'PreviewText.Input',
          },

          discount_amount: {
            type: 'string',
            title: '{{ t("purchase.discount") }}', // ✅ 修正
            'x-decorator': 'FormItem',
            'x-component': 'PreviewText.Input',
          },

          total_amount: {
            type: 'string',
            title: '{{ t("purchase.total") }}', // ✅ 修正
            'x-decorator': 'FormItem',
            'x-component': 'PreviewText.Input',
            'x-reactions': [
              {
                fulfill: {
                  state: {
                    value:
                      '{{ ((+$form.values.subtotal_amount || 0) - (+$form.values.discount_amount || 0) + (+$form.values.vat_amount || 0) + (+$form.values.other_tax_amount || 0)).toFixed(2) }}',
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    onOpenChange(isOpen) {
      if (!isOpen) {
        return;
      }
      const { purchase_order_no } = drawerApi.getData() || {};
      if (!purchase_order_no) {
        return;
      }
      drawerApi.lock();

      getPurchaseDetailApi({
        purchase_order_no,
        merchant_id: currentLoginUserApp.owner_id,
      })
        .then((data) => {
          formAPI.setValues(data);
        })
        .finally(() => {
          drawerApi.unlock();
        });
    },
    title: t('purchase.addOrder'),
    class: 'w-full',
    appendToMain: true,
    async onConfirm() {
      await formAPI.validate();
      await formAPI.submit(purchaseApi.createOrUpdateOrder);
      drawerApi.close();
    },
  });

  const { Form, formAPI } = useIgourdForm({
    scope: {
      InventoryService: {
        warehouseProductPageList(data: any) {
          return warehouseProductPageList({
            ...data,
            merchant_id: currentLoginUserApp.owner_id,
          });
        },
        productSearch(data: any) {
          return productSearch({
            ...data,
            merchant_id: currentLoginUserApp.owner_id,
          });
        },
      },
    },
    initialValues: {
      id: '1948935587745611778',
      create_time: '2025-07-25 17:37:08',
      modify_time: '2025-07-25 17:37:08',
      time_zone: 'America/Adak',
      version: '2025-07-26 10:37:09.315',
      creator_id: '1948930401941700610',
      remark: '1',
      purchase_order_no: '753497428013733',
      vendor_id: '1948933454061223938',
      warehouse_id: '1938848394624745473',
      merchant_id: '1938848394566025217',
      merchant_name: '麦当劳',
      vendor_name: '测试公司1',
      warehouse_name: 'Default',
      purchase_date: '2025-07-25',
      currency_code: 'MAD',
      exchange_rate: 1,
      vat_configuration: 'VAT_INCLUSIVE',
      status: 'CREATED',
      attachment_url: '',
      subtotal_amount: 0,
      discount_percentage: 0,
      discount_amount: 0,
      vat_amount: 0,
      other_tax_amount: 0,
      total_amount: 0,
      deposit_amount: 0,
      receipted_percentage: 0,
      review_status: 'PENDING',
      creator_name: '王凤智',
      purchase_order_item_model_list: [
        {
          id: '1948935587795943426',
          create_time: '2025-07-03 03:50:42',
          modify_time: '2025-07-12 04:58:32',
          time_zone: 'America/Adak',
          version: '2025-07-12 21:58:32.492',
          creator_id: '1937855404871630849',
          remark: '',
          merchant_id: '1938848394566025217',
          major_name: '荒野大镖客',
          minor_name: '',
          product_code: 'PC737371',
          product_barcode: '2025070318514',
          major_unit_name: '袋',
          stock_total_quantity: 19,
          stock_total_quantity_message: '19袋',
          purchase_unit_id: null,
          sale_unit_id: null,
          product_group_id: '0',
          is_enabled_multi_unit: 0,
          product_profile_unit_radio_list: null,
          vat_tax: {
            id: null,
            create_time: null,
            modify_time: null,
            time_zone: null,
            version: null,
            creator_id: null,
            remark: null,
            merchant_id: null,
            name: null,
            tax_type: null,
            taxation_office_tax_type: null,
            calculation_type: null,
            percentage: null,
            currency_code: null,
            tax_amount: null,
          },
          excise_tax: {
            id: null,
            create_time: null,
            modify_time: null,
            time_zone: null,
            version: null,
            creator_id: null,
            remark: null,
            merchant_id: null,
            name: null,
            tax_type: null,
            taxation_office_tax_type: null,
            calculation_type: null,
            percentage: null,
            currency_code: null,
            tax_amount: null,
          },
          other_tax: {
            id: null,
            create_time: null,
            modify_time: null,
            time_zone: null,
            version: null,
            creator_id: null,
            remark: null,
            merchant_id: null,
            name: null,
            tax_type: null,
            taxation_office_tax_type: null,
            calculation_type: null,
            percentage: null,
            currency_code: null,
            tax_amount: null,
          },
          tax_vat_id: '0',
          tax_excise_id: '0',
          tax_other_id: '0',
          sale_warehouse_id: '1938848394624745473',
          sale_warehouse_name: 'Default',
          sale_warehouse_product_stock_quantity: 19,
          sale_warehouse_product_stock_quantity_message: '19袋',
          product_profile_id: '1940755073008254977',
          profile_photo: '',
          sku_group_code: '1940755073289273346',
          spec_code: '',
          sku_barcode: '2025070344535',
          product_spec_kv: '[]',
          product_spec_kvmessage: '',
          product_unit_id: '8',
          product_unit_name: '袋',
          basic_unit_radio: 1,
          basic_unit_id: '8',
          basic_unit_name: '袋',
          basic_product_id: '1940755073289273347',
          cost_price: 0,
          selling_price: 268,
          major_unit_id: '8',
          status: 'ON_SALE',
          info_major_name: null,
          sub_product_stock_search_models: null,
          product_id: '1940755073289273347',
          purchase_order_id: '1948935587745611778',
          quantity: 11,
        },
      ],
      purchase_order_item_model_list1: null,
      attachment_name: null,
    },
    useI18n,
    schema: formSchema,
  });

  return { Drawer, Form };
}
