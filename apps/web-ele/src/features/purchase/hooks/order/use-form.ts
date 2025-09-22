import { observable } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getWarehouseListApi } from '@@/inventory';

import { useDrawerForm } from '#/hooks';

export function useOrderForm() {
  const { t } = useI18n();
  const warehouse = observable<{ ops: any }>({
    ops: [],
  });

  const { Drawer, drawerApi, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      class: 'w-full',
      appendToMain: true,
      title: 'Hello',
      onOpened: () => {
        getWarehouseListApi({}).then(({ list }) => {
          warehouse.ops = list.map((i) => ({
            ...i,
            label: i.name,
            value: i.id,
          }));
        });
      },
    },
    formOptions: {
      scope: {
        warehouse,
      },
      schema: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 10,
          layout: 'vertical',
        },
        properties: {
          warehouse_id: {
            type: 'string',
            'x-component': 'Select',
            'x-reactions': {
              fulfill: {
                state: {
                  dataSource: '{{ warehouse.ops }}',
                },
              },
            },
          },
          purchase_order_item_model_list: {
            type: 'void',
            'x-component': 'ProductTable',
            'x-component-props': {
              warehouse: '{{warehouse.ops}}',
            },
            'x-reactions': {
              dependencies: ['warehouse_id'],
              fulfill: {
                schema: {
                  'x-component-props': {
                    warehouse_id: '{{$deps[0]}}',
                  },
                },
              },
            },
          },
        },
      },
      handleSubmit() {
        console.log(formAPI.values);
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
    },
  });
  // onBeforeMount(() => {
  //   getWarehouseListApi({}).then((res) => {
  //     warehouse.value = res.list.map((i) => {
  //       return {
  //         ...i,
  //         label: i.name,
  //         value: i.id,
  //       };
  //     });
  //   });
  // });
  return {
    t,
    Drawer,
    Form,
    formAPI,
    drawerApi,
  };
}
