import type { UserInfo } from '@igourd/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(data: {
  owner_id: string;
  owner_type: string;
}) {
  return requestClient
    .post<UserInfo>(`/v1/passport/owner/selection`, data)
    .then((res) => {
      return {
        ...res,
        function_trees: [
          {
            function: {
              function_id: '80001',
              actions: [
                {
                  name: 'Reports',
                  action_key: 'merchant_manage_web_pc.home_report',
                  function_id: '80001',
                  url: '/merchant/basics/reports/report-merchant/statistics',
                },
                {
                  name: 'Sales',
                  action_key: 'merchant_manage_web_pc.home_sale',
                  function_id: '80001',
                  url: '/merchant/basics/dashboard/overview',
                },
                {
                  name: 'Shortcut',
                  action_key: 'merchant_manage_web_pc.home_shortcut',
                  function_id: '80001',
                  url: '/merchant/merchant-basics/index',
                },
                {
                  name: 'Message',
                  action_key: 'merchant_manage_web_pc.home_message',
                  function_id: '80001',
                  url: '/merchant/basics/merchant-news/page-list',
                },
              ],
              name: 'Home',
              function_key: 'merchant_manage_web_pc.home',
              app_id: '10001',
              style_class: 'icon-icon_home',
              menu_id: '70001',
              menu: {
                id: '70001',
                menu_key: 'merchant_manage_web_pc.home',
                name: 'Home',
                parent_id: '0',
                sort_number: 1,
                level: 1,
                app_id: '10001',
                url: '/home',
                style_class: 'icon-icon_home',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'PAGE',
                component_paths: '/views/home/index.vue',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: null,
          },
          {
            function: {
              function_id: '80002',
              actions: [],
              name: 'Purchase',
              function_key: 'merchant_manage_web_pc.purchase',
              app_id: '10001',
              style_class: 'icon-icon_purchase',
              menu_id: '70002',
              menu: {
                id: '70002',
                menu_key: 'merchant_manage_web_pc.purchase',
                name: 'Purchase',
                parent_id: '0',
                sort_number: 2,
                level: 1,
                app_id: '10001',
                url: '/purchase',
                style_class: 'icon-icon_purchase',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80003',
                  name: 'Vendor Custom Feature',
                  function_key:
                    'merchant_manage_web_pc.purchase_vendor_custom_feature',
                  app_id: '10001',
                  style_class: 'icon-icon_purchase',
                  menu_id: '70101',
                  menu: {
                    id: '70101',
                    menu_key:
                      'merchant_manage_web_pc.purchase_vendor_custom_feature',
                    name: 'Vendor Custom Feature',
                    parent_id: '70002',
                    sort_number: 3,
                    level: 2,
                    app_id: '10001',
                    url: '/purchase/vendor',
                    style_class: 'icon-icon_purchase',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'DIRECTORY',
                    component_paths: '',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80002',
                },
                sub_function_trees: [
                  {
                    function: {
                      function_id: '80003',
                      actions: [
                        {
                          name: 'Add',
                          action_key:
                            'merchant_manage_web_pc.purchase_customized_add',
                          function_id: '80003',
                          url: '/merchant/basics/dynamic-column/create',
                        },
                        {
                          name: 'Edit',
                          action_key:
                            'merchant_manage_web_pc.purchase_customized_edit',
                          function_id: '80003',
                          url: '/merchant/basics/dynamic-column/modify',
                        },
                        {
                          name: 'Delete',
                          action_key:
                            'merchant_manage_web_pc.purchase_customized_delete',
                          function_id: '80003',
                          url: '/merchant/purchase/vendor/remove',
                        },
                        {
                          name: 'Detail',
                          action_key:
                            'merchant_manage_web_pc.purchase_customized_detail',
                          function_id: '80003',
                          url: '',
                        },
                      ],
                      name: 'Vendor Custom Feature',
                      function_key:
                        'merchant_manage_web_pc.purchase_vendor_custom_feature',
                      app_id: '10001',
                      style_class: '',
                      menu_id: '70101',
                      menu: {
                        id: '70101',
                        menu_key:
                          'merchant_manage_web_pc.purchase_vendor_custom_feature',
                        name: 'Vendor Custom Feature',
                        parent_id: '70002',
                        sort_number: 3,
                        level: 2,
                        app_id: '10001',
                        url: '/purchase/vendor/customized',
                        style_class: '',
                        status: 'ACTIVE',
                        shortcuts: '',
                        type: 'PAGE',
                        component_paths:
                          '/features/purchase/pages/customized/index.vue',
                        component_name: '',
                        is_displayed: true,
                      },
                      parent_id: '80002',
                    },
                    sub_function_trees: null,
                  },
                  {
                    function: {
                      function_id: '80004',
                      actions: [
                        {
                          name: 'Add',
                          action_key:
                            'merchant_manage_web_pc.purchase_list_add',
                          function_id: '80004',
                          url: '/merchant/purchase/vendor/create',
                        },
                        {
                          name: 'Edit',
                          action_key:
                            'merchant_manage_web_pc.purchase_list_edit',
                          function_id: '80004',
                          url: '/merchant/purchase/vendor/modify',
                        },
                        {
                          name: 'Delete',
                          action_key:
                            'merchant_manage_web_pc.purchase_list_delete',
                          function_id: '80004',
                          url: '/merchant/purchase/vendor/remove',
                        },
                        {
                          name: 'Detail',
                          action_key:
                            'merchant_manage_web_pc.purchase_list_detail',
                          function_id: '80004',
                          url: '/merchant/purchase/vendor/detail',
                        },
                        {
                          name: 'Export',
                          action_key:
                            'merchant_manage_web_pc.purchase_list_export',
                          function_id: '80004',
                          url: '/merchant/base/file-export/export',
                        },
                      ],
                      name: 'Vendor List',
                      function_key:
                        'merchant_manage_web_pc.purchase_vendor_list',
                      app_id: '10001',
                      style_class: '',
                      menu_id: '70102',
                      menu: {
                        id: '70102',
                        menu_key: 'merchant_manage_web_pc.purchase_vendor_list',
                        name: 'Vendor List',
                        parent_id: '70002',
                        sort_number: 4,
                        level: 2,
                        app_id: '10001',
                        url: '/purchase/vendor/list',
                        style_class: '',
                        status: 'ACTIVE',
                        shortcuts: '',
                        type: 'PAGE',
                        component_paths:
                          '/features/purchase/pages/list/index.vue',
                        component_name: '',
                        is_displayed: true,
                      },
                      parent_id: '80002',
                    },
                    sub_function_trees: null,
                  },
                ],
              },
              {
                function: {
                  function_id: '80005',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.purchase_order_add',
                      function_id: '80005',
                      url: '/merchant/purchase/purchase-order/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.purchase_order_edit',
                      function_id: '80005',
                      url: '/merchant/purchase/purchase-order/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.purchase_order_delete',
                      function_id: '80005',
                      url: '/merchant/purchase/purchase-order/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.purchase_order_detail',
                      function_id: '80005',
                      url: '/merchant/purchase/purchase-order/detail',
                    },
                    {
                      name: 'Review',
                      action_key:
                        'merchant_manage_web_pc.purchase_order_review',
                      function_id: '80005',
                      url: '/merchant/purchase/purchase-order/review',
                    },
                  ],
                  name: 'Purchase Order',
                  function_key:
                    'merchant_manage_web_pc.purchase_purchase_order',
                  app_id: '10001',
                  style_class: 'icon-icon_purchase',
                  menu_id: '70103',
                  menu: {
                    id: '70103',
                    menu_key: 'merchant_manage_web_pc.purchase_purchase_order',
                    name: 'Purchase Order',
                    parent_id: '70002',
                    sort_number: 5,
                    level: 2,
                    app_id: '10001',
                    url: '/purchase/purchase',
                    style_class: 'icon-icon_purchase',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'DIRECTORY',
                    component_paths: '',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80002',
                },
                sub_function_trees: [
                  {
                    function: {
                      function_id: '80005',
                      actions: [
                        {
                          name: 'Add',
                          action_key:
                            'merchant_manage_web_pc.purchase_order_add',
                          function_id: '80005',
                          url: '/merchant/purchase/purchase-order/create',
                        },
                        {
                          name: 'Edit',
                          action_key:
                            'merchant_manage_web_pc.purchase_order_edit',
                          function_id: '80005',
                          url: '/merchant/purchase/purchase-order/modify',
                        },
                        {
                          name: 'Delete',
                          action_key:
                            'merchant_manage_web_pc.purchase_order_delete',
                          function_id: '80005',
                          url: '/merchant/purchase/purchase-order/remove',
                        },
                        {
                          name: 'Detail',
                          action_key:
                            'merchant_manage_web_pc.purchase_order_detail',
                          function_id: '80005',
                          url: '/merchant/purchase/purchase-order/detail',
                        },
                        {
                          name: 'Review',
                          action_key:
                            'merchant_manage_web_pc.purchase_order_review',
                          function_id: '80005',
                          url: '/merchant/purchase/purchase-order/review',
                        },
                      ],
                      name: 'Purchase Order',
                      function_key:
                        'merchant_manage_web_pc.purchase_purchase_order',
                      app_id: '10001',
                      style_class: '',
                      menu_id: '70103',
                      menu: {
                        id: '70103',
                        menu_key:
                          'merchant_manage_web_pc.purchase_purchase_order',
                        name: 'Purchase Order',
                        parent_id: '70002',
                        sort_number: 5,
                        level: 2,
                        app_id: '10001',
                        url: '/purchase/purchase/order',
                        style_class: '',
                        status: 'ACTIVE',
                        shortcuts: '',
                        type: 'PAGE',
                        component_paths:
                          '/features/purchase/pages/order/index.vue',
                        component_name: '',
                        is_displayed: true,
                      },
                      parent_id: '80002',
                    },
                    sub_function_trees: null,
                  },
                  {
                    function: {
                      function_id: '80006',
                      actions: [
                        {
                          name: 'Add',
                          action_key:
                            'merchant_manage_web_pc.purchase_receipt_add',
                          function_id: '80006',
                          url: '/merchant/purchase/goods-receipt-note/create',
                        },
                        {
                          name: 'Edit',
                          action_key:
                            'merchant_manage_web_pc.purchase_receipt_edit',
                          function_id: '80006',
                          url: '/merchant/purchase/goods-receipt-note/modify',
                        },
                        {
                          name: 'Delete',
                          action_key:
                            'merchant_manage_web_pc.purchase_receipt_delete',
                          function_id: '80006',
                          url: '/merchant/purchase/goods-receipt-note/remove',
                        },
                        {
                          name: 'Detail',
                          action_key:
                            'merchant_manage_web_pc.purchase_receipt_detail',
                          function_id: '80006',
                          url: '/merchant/purchase/goods-receipt-note/list/detai1',
                        },
                        {
                          name: 'Print',
                          action_key:
                            'merchant_manage_web_pc.purchase_receipt_print',
                          function_id: '80006',
                          url: '',
                        },
                        {
                          name: 'Review',
                          action_key:
                            'merchant_manage_web_pc.purchase_receipt_review',
                          function_id: '80006',
                          url: '/merchant/purchase/goods-receipt-note/review',
                        },
                      ],
                      name: 'Goods Receipt Note',
                      function_key:
                        'merchant_manage_web_pc.purchase_goods_receipt_note',
                      app_id: '10001',
                      style_class: '',
                      menu_id: '70104',
                      menu: {
                        id: '70104',
                        menu_key:
                          'merchant_manage_web_pc.purchase_goods_receipt_note',
                        name: 'Goods Receipt Note',
                        parent_id: '70002',
                        sort_number: 6,
                        level: 2,
                        app_id: '10001',
                        url: '/purchase/purchase/receipt',
                        style_class: '',
                        status: 'ACTIVE',
                        shortcuts: '',
                        type: 'PAGE',
                        component_paths:
                          '/features/purchase/pages/receipt/index.vue',
                        component_name: '',
                        is_displayed: true,
                      },
                      parent_id: '80002',
                    },
                    sub_function_trees: null,
                  },
                  {
                    function: {
                      function_id: '1904558954575302657',
                      actions: [],
                      name: 'Purchase Order',
                      function_key:
                        'merchant_manage_web_pc.purchase_purchase_neworder',
                      app_id: '10001',
                      style_class: '',
                      menu_id: '1904558954503999489',
                      menu: {
                        id: '1904558954503999489',
                        menu_key:
                          'merchant_manage_web_pc.purchase_purchase_neworder',
                        name: 'menu_name.merchant_manage_web_pc.purchase_purchase_neworder',
                        parent_id: '70002',
                        sort_number: 6,
                        level: 2,
                        app_id: '10001',
                        url: '/purchase/purchase/new-order',
                        style_class: '',
                        status: 'ACTIVE',
                        shortcuts: '',
                        type: 'PAGE',
                        component_paths: '/views/purchase/new-order',
                        component_name: 'PurchaseNewOrder',
                        is_displayed: false,
                      },
                      parent_id: '80002',
                    },
                    sub_function_trees: null,
                  },
                  {
                    function: {
                      function_id: '80008',
                      actions: [
                        {
                          name: 'Add',
                          action_key:
                            'merchant_manage_web_pc.purchase_returned_add',
                          function_id: '80008',
                          url: '/merchant/purchase/purchase-returned/create',
                        },
                        {
                          name: 'Edit',
                          action_key:
                            'merchant_manage_web_pc.purchase_returned_edit',
                          function_id: '80008',
                          url: '/merchant/purchase/purchase-returned/modify',
                        },
                        {
                          name: 'Delete',
                          action_key:
                            'merchant_manage_web_pc.purchase_returned_delete',
                          function_id: '80008',
                          url: '/merchant/purchase/purchase-returned/remove',
                        },
                        {
                          name: 'Detail',
                          action_key:
                            'merchant_manage_web_pc.purchase_returned_detail',
                          function_id: '80008',
                          url: '/merchant/purchase/purchase-returned/detail',
                        },
                        {
                          name: 'Print',
                          action_key:
                            'merchant_manage_web_pc.purchase_returned_print',
                          function_id: '80008',
                          url: '',
                        },
                        {
                          name: 'Review',
                          action_key:
                            'merchant_manage_web_pc.purchase_returned_review',
                          function_id: '80008',
                          url: '/merchant/purchase/purchase-returned/review',
                        },
                      ],
                      name: 'Purchase Returned',
                      function_key:
                        'merchant_manage_web_pc.purchase_purchase_returned',
                      app_id: '10001',
                      style_class: '',
                      menu_id: '70106',
                      menu: {
                        id: '70106',
                        menu_key:
                          'merchant_manage_web_pc.purchase_purchase_returned',
                        name: 'Purchase Returned',
                        parent_id: '70002',
                        sort_number: 8,
                        level: 2,
                        app_id: '10001',
                        url: '/purchase/purchase/returned',
                        style_class: '',
                        status: 'ACTIVE',
                        shortcuts: '',
                        type: 'PAGE',
                        component_paths:
                          '/features/purchase/pages/returned/index.vue',
                        component_name: '',
                        is_displayed: true,
                      },
                      parent_id: '80002',
                    },
                    sub_function_trees: null,
                  },
                ],
              },
            ],
          },
          {
            function: {
              function_id: '80009',
              actions: [],
              name: 'Inventory',
              function_key: 'merchant_manage_web_pc.inventory',
              app_id: '10001',
              style_class: 'icon-icon_Inventory',
              menu_id: '70003',
              menu: {
                id: '70003',
                menu_key: 'merchant_manage_web_pc.inventory',
                name: 'Inventory',
                parent_id: '0',
                sort_number: 9,
                level: 1,
                app_id: '10001',
                url: '/inventory',
                style_class: 'icon-icon_Inventory',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80010',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_feature_add',
                      function_id: '80010',
                      url: '/merchant/basics/dynamic-column/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_feature_edit',
                      function_id: '80010',
                      url: '/merchant/basics/dynamic-column/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_feature_delete',
                      function_id: '80010',
                      url: '/merchant/basics/dynamic-column/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_feature_detail',
                      function_id: '80010',
                      url: '',
                    },
                  ],
                  name: 'Product Custom Feature',
                  function_key:
                    'merchant_manage_web_pc.inventory_product_custom_feature',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70107',
                  menu: {
                    id: '70107',
                    menu_key:
                      'merchant_manage_web_pc.inventory_product_custom_feature',
                    name: 'Product Custom Feature',
                    parent_id: '70003',
                    sort_number: 10,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/product/feature',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/product-feature/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80011',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_group_add',
                      function_id: '80011',
                      url: '/merchant/basics/inventory/product-group/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_group_edit',
                      function_id: '80011',
                      url: '/merchant/basics/inventory/product-group/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_group_delete',
                      function_id: '80011',
                      url: '/merchant/basics/inventory/product-group/remove',
                    },
                  ],
                  name: 'Product Group',
                  function_key:
                    'merchant_manage_web_pc.inventory_product_group',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70108',
                  menu: {
                    id: '70108',
                    menu_key: 'merchant_manage_web_pc.inventory_product_group',
                    name: 'Product Group',
                    parent_id: '70003',
                    sort_number: 11,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/product/group',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/product-group/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80012',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_label_add',
                      function_id: '80012',
                      url: '/merchant/basics/inventory/product-label/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_label_edit',
                      function_id: '80012',
                      url: '/merchant/basics/inventory/product-label/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_label_delete',
                      function_id: '80012',
                      url: '/merchant/basics/inventory/product-label/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_label_detail',
                      function_id: '80012',
                      url: '',
                    },
                  ],
                  name: 'Product Label',
                  function_key:
                    'merchant_manage_web_pc.inventory_product_label',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70109',
                  menu: {
                    id: '70109',
                    menu_key: 'merchant_manage_web_pc.inventory_product_label',
                    name: 'Product Label',
                    parent_id: '70003',
                    sort_number: 12,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/product/label',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/product-label/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80013',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_add',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_edit',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_delete',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_detail',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/detail',
                    },
                    {
                      name: 'Export',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_export',
                      function_id: '80013',
                      url: '/merchant/base/file-export/export',
                    },
                    {
                      name: 'Import',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_import',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/import/excel',
                    },
                    {
                      name: 'QuickPurchase',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_quick_purchase',
                      function_id: '80013',
                      url: '/merchant/purchase/purchase-order/create',
                    },
                    {
                      name: 'Print Barcode',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_print_barcode',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Import preview',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_import_preview',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/import/excel/preview',
                    },
                    {
                      name: 'Print preview',
                      action_key:
                        'merchant_manage_web_pc.inventory_product_list_print_barcode_preview',
                      function_id: '80013',
                      url: '/merchant/basics/inventory/product/barcode/print/preview',
                    },
                    {
                      name: 'More',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_more',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Copy',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_copy',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_product-add_unit-add',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_product-add_unit-delete',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Bundle',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_product-add_unit-bundle',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_product-add_spec-delete',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Units',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_product-add_units',
                      function_id: '80013',
                      url: '',
                    },
                    {
                      name: 'Specs',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-list_product-add_specs',
                      function_id: '80013',
                      url: '',
                    },
                  ],
                  name: 'Product List',
                  function_key: 'merchant_manage_web_pc.inventory_product_list',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70110',
                  menu: {
                    id: '70110',
                    menu_key: 'merchant_manage_web_pc.inventory_product_list',
                    name: 'Product List',
                    parent_id: '70003',
                    sort_number: 13,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/product/list',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/product-list/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80014',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.inventory_list_add',
                      function_id: '80014',
                      url: '/merchant/basics/inventory/stock/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.inventory_list_edit',
                      function_id: '80014',
                      url: '/merchant/basics/inventory/stock/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_list_delete',
                      function_id: '80014',
                      url: '/merchant/basics/inventory/stock/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_list_detail',
                      function_id: '80014',
                      url: '/merchant/basics/inventory/stock/detail',
                    },
                    {
                      name: 'QuickPurchase',
                      action_key:
                        'merchant_manage_web_pc.inventory_list_quick_purchase',
                      function_id: '80014',
                      url: '/merchant/purchase/purchase-order/create',
                    },
                  ],
                  name: 'Stock List',
                  function_key: 'merchant_manage_web_pc.inventory_stock_list',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70111',
                  menu: {
                    id: '70111',
                    menu_key: 'merchant_manage_web_pc.inventory_stock_list',
                    name: 'Stock List',
                    parent_id: '70003',
                    sort_number: 14,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/list',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/inventory/pages/list/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80015',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_warehouse_add',
                      function_id: '80015',
                      url: '/merchant/basics/inventory/warehouse/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_warehouse_edit',
                      function_id: '80015',
                      url: '/merchant/basics/inventory/warehouse/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_warehouse_delete',
                      function_id: '80015',
                      url: '/merchant/basics/inventory/warehouse/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_warehouse_detail',
                      function_id: '80015',
                      url: '',
                    },
                  ],
                  name: 'Warehouse',
                  function_key: 'merchant_manage_web_pc.inventory_warehouse',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70112',
                  menu: {
                    id: '70112',
                    menu_key: 'merchant_manage_web_pc.inventory_warehouse',
                    name: 'Warehouse',
                    parent_id: '70003',
                    sort_number: 15,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/warehouse',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/warehouse/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80016',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_physical_add',
                      function_id: '80016',
                      url: '/merchant/basics/inventory/physical-stock-take/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_physical_edit',
                      function_id: '80016',
                      url: '/merchant/basics/inventory/physical-stock-take/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_physical_delete',
                      function_id: '80016',
                      url: '/merchant/basics/inventory/physical-stock-take/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_physical_detail',
                      function_id: '80016',
                      url: '/merchant/basics/inventory/physical-stock-take/detail',
                    },
                    {
                      name: 'Print',
                      action_key:
                        'merchant_manage_web_pc.inventory_physical_print',
                      function_id: '80016',
                      url: '',
                    },
                    {
                      name: 'Physical Status',
                      action_key:
                        'merchant_manage_web_pc.inventory_physical_status',
                      function_id: '80016',
                      url: '/merchant/basics/inventory/physical-stock-take/status/modify',
                    },
                  ],
                  name: 'Physical Stock Take',
                  function_key:
                    'merchant_manage_web_pc.inventory_physical_stock_take',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70113',
                  menu: {
                    id: '70113',
                    menu_key:
                      'merchant_manage_web_pc.inventory_physical_stock_take',
                    name: 'Physical Stock Take',
                    parent_id: '70003',
                    sort_number: 16,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/count',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/count/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80017',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_add',
                      function_id: '80017',
                      url: '/merchant/basics/inventory/stock-transfer/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_edit',
                      function_id: '80017',
                      url: '/merchant/basics/inventory/stock-transfer/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_delete',
                      function_id: '80017',
                      url: '/merchant/basics/inventory/stock-transfer/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_detail',
                      function_id: '80017',
                      url: '/merchant/basics/inventory/stock-transfer/detail',
                    },
                    {
                      name: 'Print',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_print',
                      function_id: '80017',
                      url: '',
                    },
                    {
                      name: 'Transfer Status',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_status',
                      function_id: '80017',
                      url: '/merchant/basics/inventory/stock-transfer/status/modify',
                    },
                    {
                      name: 'Transfer audit',
                      action_key:
                        'merchant_manage_web_pc.inventory_transfer_review',
                      function_id: '80017',
                      url: '/merchant/basics/inventory/stock-transfer/review',
                    },
                  ],
                  name: 'Stock Transfer',
                  function_key:
                    'merchant_manage_web_pc.inventory_stock_transfer',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70114',
                  menu: {
                    id: '70114',
                    menu_key: 'merchant_manage_web_pc.inventory_stock_transfer',
                    name: 'Stock Transfer',
                    parent_id: '70003',
                    sort_number: 17,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/transfer',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/transfer/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80018',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_consumption_add',
                      function_id: '80018',
                      url: '/merchant/basics/inventory/stock-consumption/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_consumption_edit',
                      function_id: '80018',
                      url: '/merchant/basics/inventory/stock-consumption/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_consumption_delete',
                      function_id: '80018',
                      url: '/merchant/basics/inventory/stock-consumption/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_consumption_detail',
                      function_id: '80018',
                      url: '/merchant/basics/inventory/stock-consumption/detail',
                    },
                    {
                      name: 'Print',
                      action_key:
                        'merchant_manage_web_pc.inventory_consumption_print',
                      function_id: '80018',
                      url: '',
                    },
                    {
                      name: 'Consumption approved Status',
                      action_key:
                        'merchant_manage_web_pc.inventory_consumption_status_approved',
                      function_id: '80018',
                      url: '/merchant/basics/inventory/stock-consumption/status/approved',
                    },
                  ],
                  name: 'Stock Consumption',
                  function_key:
                    'merchant_manage_web_pc.inventory_stock_consumption',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70115',
                  menu: {
                    id: '70115',
                    menu_key:
                      'merchant_manage_web_pc.inventory_stock_consumption',
                    name: 'Stock Consumption',
                    parent_id: '70003',
                    sort_number: 18,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/spoilage',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/spoilage/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80019',
                  actions: [],
                  name: 'Stock Change Log',
                  function_key:
                    'merchant_manage_web_pc.inventory_stock_change_log',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70116',
                  menu: {
                    id: '70116',
                    menu_key:
                      'merchant_manage_web_pc.inventory_stock_change_log',
                    name: 'Stock Change Log',
                    parent_id: '70003',
                    sort_number: 19,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/change/log',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/stock-change-log/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80020',
                  actions: [],
                  name: 'Price Change Log',
                  function_key:
                    'merchant_manage_web_pc.inventory_price_change_log',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70117',
                  menu: {
                    id: '70117',
                    menu_key:
                      'merchant_manage_web_pc.inventory_price_change_log',
                    name: 'Price Change Log',
                    parent_id: '70003',
                    sort_number: 20,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/price/log',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/price-change-log/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80021',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.inventory_unit_add',
                      function_id: '80021',
                      url: '/merchant/basics/inventory/product-unit/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.inventory_unit_edit',
                      function_id: '80021',
                      url: '/merchant/basics/inventory/product-unit/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_unit_delete',
                      function_id: '80021',
                      url: '/merchant/basics/inventory/product-unit/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.inventory_unit_detail',
                      function_id: '80021',
                      url: '/merchant/basics/inventory/product-unit/detail',
                    },
                  ],
                  name: 'Units',
                  function_key: 'merchant_manage_web_pc.inventory_units',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70118',
                  menu: {
                    id: '70118',
                    menu_key: 'merchant_manage_web_pc.inventory_units',
                    name: 'Units',
                    parent_id: '70003',
                    sort_number: 21,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/unit',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/inventory/pages/unit/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1912919411765809154',
                  actions: [
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_sku-list_edit',
                      function_id: '1912919411765809154',
                      url: '/merchant/basics/inventory/product/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_sku-list_delete',
                      function_id: '1912919411765809154',
                      url: '/merchant/basics/inventory/product/remove',
                    },
                    {
                      name: 'Details',
                      action_key:
                        'merchant_manage_web_pc.inventory_sku-list_detail',
                      function_id: '1912919411765809154',
                      url: '/merchant/basics/inventory/product-info/detail',
                    },
                  ],
                  name: 'SKU List',
                  function_key: 'merchant_manage_web_pc.inventory_sku-list',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1912919411681923073',
                  menu: {
                    id: '1912919411681923073',
                    menu_key: 'merchant_manage_web_pc.inventory_sku-list',
                    name: 'SKU List',
                    parent_id: '70003',
                    sort_number: 14,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/skuList',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/sku-list/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1912926446012076034',
                  actions: [
                    {
                      name: 'Add Spec',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-spec_add',
                      function_id: '1912926446012076034',
                      url: '/merchant/basics/inventory/product-spec/create',
                    },
                    {
                      name: 'Edit Spec',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-spec_edit',
                      function_id: '1912926446012076034',
                      url: '',
                    },
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-spec_value-add',
                      function_id: '1912926446012076034',
                      url: '/merchant/basics/inventory/product-spec-value/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-spec_value-edit',
                      function_id: '1912926446012076034',
                      url: '/merchant/basics/inventory/product-spec-value/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-spec_value-delete',
                      function_id: '1912926446012076034',
                      url: '/merchant/basics/inventory/product-spec-value/remove',
                    },
                    {
                      name: 'Delete Spec',
                      action_key:
                        'merchant_manage_web_pc.inventory_product-spec_delete',
                      function_id: '1912926446012076034',
                      url: '/merchant/basics/inventory/product-spec/remove',
                    },
                  ],
                  name: 'Product Spec',
                  function_key:
                    'merchant_manage_web_pc./inventory/product-spec',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1912926445961744386',
                  menu: {
                    id: '1912926445961744386',
                    menu_key: 'merchant_manage_web_pc./inventory/product-spec',
                    name: 'Product Spec',
                    parent_id: '70003',
                    sort_number: 15,
                    level: 2,
                    app_id: '10001',
                    url: '/inventory/productSpec',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/inventory/pages/product-spec/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80009',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80022',
              actions: [],
              name: 'Customer',
              function_key: 'merchant_manage_web_pc.customer',
              app_id: '10001',
              style_class: 'icon-icon_Customer',
              menu_id: '70004',
              menu: {
                id: '70004',
                menu_key: 'merchant_manage_web_pc.customer',
                name: 'Customer',
                parent_id: '0',
                sort_number: 22,
                level: 1,
                app_id: '10001',
                url: '/customer',
                style_class: 'icon-icon_Customer',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80023',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.customer_customized_feature_add',
                      function_id: '80023',
                      url: '/merchant/basics/dynamic-column/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.customer_customized_feature_edit',
                      function_id: '80023',
                      url: '/merchant/basics/dynamic-column/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.customer_customized_feature_delete',
                      function_id: '80023',
                      url: '/merchant/basics/dynamic-column/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.customer_customized_feature_detail',
                      function_id: '80023',
                      url: '',
                    },
                  ],
                  name: 'Customer Custom Feature',
                  function_key:
                    'merchant_manage_web_pc.customer_customer_custom_feature',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70119',
                  menu: {
                    id: '70119',
                    menu_key:
                      'merchant_manage_web_pc.customer_customer_custom_feature',
                    name: 'Customer Custom Feature',
                    parent_id: '70004',
                    sort_number: 23,
                    level: 2,
                    app_id: '10001',
                    url: '/customer/feature',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/customer/pages/feature/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80022',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80024',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.customer_list_add',
                      function_id: '80024',
                      url: '/merchant/basics/customer/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.customer_list_edit',
                      function_id: '80024',
                      url: '/merchant/basics/customer/modify',
                    },
                    {
                      name: 'Delete',
                      action_key: 'merchant_manage_web_pc.customer_list_delete',
                      function_id: '80024',
                      url: '/merchant/basics/customer/remove',
                    },
                    {
                      name: 'Detail',
                      action_key: 'merchant_manage_web_pc.customer_list_detail',
                      function_id: '80024',
                      url: '/merchant/basics/customer/detail',
                    },
                    {
                      name: 'label binding',
                      action_key:
                        'merchant_manage_web_pc.customer_list_label_bind',
                      function_id: '80024',
                      url: '/merchant/basics/customer/label/bind',
                    },
                    {
                      name: 'Customer recharge',
                      action_key:
                        'merchant_manage_web_pc.customer_list_recharge',
                      function_id: '80024',
                      url: '/merchant/basics/customer/recharge',
                    },
                  ],
                  name: 'Customer List',
                  function_key: 'merchant_manage_web_pc.customer_customer_list',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70120',
                  menu: {
                    id: '70120',
                    menu_key: 'merchant_manage_web_pc.customer_customer_list',
                    name: 'Customer List',
                    parent_id: '70004',
                    sort_number: 24,
                    level: 2,
                    app_id: '10001',
                    url: '/customer/list',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/customer/pages/list/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80022',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80025',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.customer_label_add',
                      function_id: '80025',
                      url: '/merchant/basics/customer/customer-label/create',
                    },
                    {
                      name: 'Add Customer',
                      action_key:
                        'merchant_manage_web_pc.customer_label_add_customer',
                      function_id: '80025',
                      url: '/merchant/basics/customer/customer-label/label/customer/bind',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.customer_label_delete',
                      function_id: '80025',
                      url: '/merchant/basics/customer/customer-label/remove',
                    },
                  ],
                  name: 'Customer Label',
                  function_key:
                    'merchant_manage_web_pc.customer_customer_label',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70121',
                  menu: {
                    id: '70121',
                    menu_key: 'merchant_manage_web_pc.customer_customer_label',
                    name: 'Customer Label',
                    parent_id: '70004',
                    sort_number: 25,
                    level: 2,
                    app_id: '10001',
                    url: '/customer/label',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/customer/pages/label/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80022',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80026',
                  actions: [],
                  name: 'Porints Log',
                  function_key: 'merchant_manage_web_pc.customer_porints_log',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70122',
                  menu: {
                    id: '70122',
                    menu_key: 'merchant_manage_web_pc.customer_porints_log',
                    name: 'Porints Log',
                    parent_id: '70004',
                    sort_number: 26,
                    level: 2,
                    app_id: '10001',
                    url: '/customer/prints/log',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/customer/pages/prints/log/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80022',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80027',
                  actions: [
                    {
                      name: 'Save',
                      action_key: 'merchant_manage_web_pc.customer_points_save',
                      function_id: '80027',
                      url: '/merchant/basics/customer/setting-point/save',
                    },
                  ],
                  name: 'Points Settings',
                  function_key:
                    'merchant_manage_web_pc.customer_points_settings',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70123',
                  menu: {
                    id: '70123',
                    menu_key: 'merchant_manage_web_pc.customer_points_settings',
                    name: 'Points Settings',
                    parent_id: '70004',
                    sort_number: 27,
                    level: 2,
                    app_id: '10001',
                    url: '/customer/integral',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/customer/pages/integral/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80022',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80028',
                  actions: [
                    {
                      name: 'Save',
                      action_key: 'merchant_manage_web_pc.customer_rights_save',
                      function_id: '80028',
                      url: '/merchant/basics/customer/setting-point/save',
                    },
                  ],
                  name: 'Customer Rights Settings',
                  function_key:
                    'merchant_manage_web_pc.customer_customer_rights_settings',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70124',
                  menu: {
                    id: '70124',
                    menu_key:
                      'merchant_manage_web_pc.customer_customer_rights_settings',
                    name: 'Customer Rights Settings',
                    parent_id: '70004',
                    sort_number: 28,
                    level: 2,
                    app_id: '10001',
                    url: '/customer/equity',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/customer/pages/equity/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80022',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80029',
              actions: [],
              name: 'Marketing',
              function_key: 'merchant_manage_web_pc.marketing',
              app_id: '10001',
              style_class: 'icon-icon_Promotion',
              menu_id: '70005',
              menu: {
                id: '70005',
                menu_key: 'merchant_manage_web_pc.marketing',
                name: 'Marketing',
                parent_id: '0',
                sort_number: 29,
                level: 1,
                app_id: '10001',
                url: '/marketing',
                style_class: 'icon-icon_Promotion',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80030',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.marketing_discount_add',
                      function_id: '80030',
                      url: '/merchant/basics/marketing/promotion/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.marketing_discount_edit',
                      function_id: '80030',
                      url: '/merchant/basics/marketing/promotion/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.marketing_discount_delete',
                      function_id: '80030',
                      url: '/merchant/basics/marketing/promotion/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.marketing_discount_detail',
                      function_id: '80030',
                      url: '/merchant/basics/marketing/promotion/detail',
                    },
                    {
                      name: 'Close Status',
                      action_key:
                        'merchant_manage_web_pc.marketing_discount_close_switch',
                      function_id: '80030',
                      url: '/merchant/basics/marketing/promotion/status/close',
                    },
                  ],
                  name: 'Reduction/Discount',
                  function_key:
                    'merchant_manage_web_pc.marketing_reduction/discount',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70125',
                  menu: {
                    id: '70125',
                    menu_key:
                      'merchant_manage_web_pc.marketing_reduction/discount',
                    name: 'Reduction/Discount',
                    parent_id: '70005',
                    sort_number: 30,
                    level: 2,
                    app_id: '10001',
                    url: '/marketing/discount',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/marketing/pages/discount/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80029',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80031',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.marketing_price_add',
                      function_id: '80031',
                      url: '/merchant/basics/marketing/price-level/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.marketing_price_edit',
                      function_id: '80031',
                      url: '/merchant/basics/marketing/price-level/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.marketing_price_delete',
                      function_id: '80031',
                      url: '/merchant/basics/marketing/price-level/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.marketing_price_detail',
                      function_id: '80031',
                      url: '/merchant/basics/marketing/price-level/detail',
                    },
                    {
                      name: 'Close Status',
                      action_key:
                        'merchant_manage_web_pc.marketing_price_close_switch',
                      function_id: '80031',
                      url: '/merchant/basics/marketing/price-level/status/close',
                    },
                  ],
                  name: 'Price Levels',
                  function_key: 'merchant_manage_web_pc.marketing_price_levels',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70126',
                  menu: {
                    id: '70126',
                    menu_key: 'merchant_manage_web_pc.marketing_price_levels',
                    name: 'Price Levels',
                    parent_id: '70005',
                    sort_number: 31,
                    level: 2,
                    app_id: '10001',
                    url: '/marketing/price',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/marketing/pages/price/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80029',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80032',
              actions: [],
              name: 'Accounting',
              function_key: 'merchant_manage_web_pc.accounting',
              app_id: '10001',
              style_class: 'icon-icon_Accounting',
              menu_id: '70006',
              menu: {
                id: '70006',
                menu_key: 'merchant_manage_web_pc.accounting',
                name: 'Accounting',
                parent_id: '0',
                sort_number: 32,
                level: 1,
                app_id: '10001',
                url: '/account',
                style_class: 'icon-icon_Accounting',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80033',
                  actions: [
                    {
                      name: 'Export',
                      action_key: 'merchant_manage_web_pc.account_flows_export',
                      function_id: '80033',
                      url: '/merchant/base/file-export/export',
                    },
                    {
                      name: 'Print',
                      action_key: 'merchant_manage_web_pc.account_flows_print',
                      function_id: '80033',
                      url: '',
                    },
                  ],
                  name: 'Finance Flows',
                  function_key:
                    'merchant_manage_web_pc.accounting_finance_flows',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70127',
                  menu: {
                    id: '70127',
                    menu_key: 'merchant_manage_web_pc.accounting_finance_flows',
                    name: 'Finance Flows',
                    parent_id: '70006',
                    sort_number: 33,
                    level: 2,
                    app_id: '10001',
                    url: '/account/flows',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/account/pages/flows/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80034',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.account_notes_add',
                      function_id: '80034',
                      url: '/merchant/basics/accounting/accounting-note/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.account_notes_edit',
                      function_id: '80034',
                      url: '/merchant/basics/accounting/accounting-note/modify',
                    },
                    {
                      name: 'Delete',
                      action_key: 'merchant_manage_web_pc.account_notes_delete',
                      function_id: '80034',
                      url: '/merchant/basics/accounting/accounting-note/remove',
                    },
                    {
                      name: 'Detail',
                      action_key: 'merchant_manage_web_pc.account_notes_detail',
                      function_id: '80034',
                      url: '/merchant/basics/accounting/accounting-note/detail',
                    },
                    {
                      name: 'Export',
                      action_key: 'merchant_manage_web_pc.account_notes_export',
                      function_id: '80034',
                      url: '/merchant/base/file-export/export',
                    },
                    {
                      name: 'Settlement',
                      action_key:
                        'merchant_manage_web_pc.account_notes_settlement',
                      function_id: '80034',
                      url: '/merchant/basics/accounting/accounting-note/total',
                    },
                    {
                      name: 'Review',
                      action_key: 'merchant_manage_web_pc.account_notes_review',
                      function_id: '80034',
                      url: '/merchant/basics/accounting/accounting-note/trading-completed',
                    },
                  ],
                  name: 'Accounting Notes',
                  function_key:
                    'merchant_manage_web_pc.accounting_accounting_notes',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70128',
                  menu: {
                    id: '70128',
                    menu_key:
                      'merchant_manage_web_pc.accounting_accounting_notes',
                    name: 'Accounting Notes',
                    parent_id: '70006',
                    sort_number: 34,
                    level: 2,
                    app_id: '10001',
                    url: '/account/notes',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/account/pages/notes/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80035',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.account_exchange_add',
                      function_id: '80035',
                      url: '/merchant/basics/accounting/currency-exchange/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.account_exchange_edit',
                      function_id: '80035',
                      url: '/merchant/basics/accounting/currency-exchange/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.account_exchange_delete',
                      function_id: '80035',
                      url: '/merchant/basics/accounting/currency-exchange/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.account_exchange_detail',
                      function_id: '80035',
                      url: '/merchant/basics/accounting/currency-exchange/detail',
                    },
                    {
                      name: 'Paging query',
                      action_key:
                        'merchant_manage_web_pc.account_exchange_page_list',
                      function_id: '80035',
                      url: '/merchant/basics/accounting/currency-exchange/page-list',
                    },
                  ],
                  name: 'Currency Exchange',
                  function_key:
                    'merchant_manage_web_pc.accounting_currency_exchange',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70129',
                  menu: {
                    id: '70129',
                    menu_key:
                      'merchant_manage_web_pc.accounting_currency_exchange',
                    name: 'Currency Exchange',
                    parent_id: '70006',
                    sort_number: 35,
                    level: 2,
                    app_id: '10001',
                    url: '/account/exchange',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/account/pages/exchange/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80036',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.account_category_add',
                      function_id: '80036',
                      url: '/merchant/basics/accounting/finance-category/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.account_category_edit',
                      function_id: '80036',
                      url: '/merchant/basics/accounting/finance-category/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.account_category_delete',
                      function_id: '80036',
                      url: '/merchant/basics/accounting/finance-category/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.account_category_detail',
                      function_id: '80036',
                      url: '/merchant/basics/accounting/finance-category/detail',
                    },
                  ],
                  name: 'Finance Category',
                  function_key:
                    'merchant_manage_web_pc.accounting_finance_category',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70130',
                  menu: {
                    id: '70130',
                    menu_key:
                      'merchant_manage_web_pc.accounting_finance_category',
                    name: 'Finance Category',
                    parent_id: '70006',
                    sort_number: 36,
                    level: 2,
                    app_id: '10001',
                    url: '/account/classification',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/account/pages/classification/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80037',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.account_management_add',
                      function_id: '80037',
                      url: '/merchant/basics/accounting/account/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.account_management_edit',
                      function_id: '80037',
                      url: '/merchant/basics/accounting/account/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.account_management_delete',
                      function_id: '80037',
                      url: '/merchant/basics/accounting/account/remove',
                    },
                    {
                      name: 'Export',
                      action_key:
                        'merchant_manage_web_pc.account_management_export',
                      function_id: '80037',
                      url: '/merchant/base/file-export/export',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.account_management_detail',
                      function_id: '80037',
                      url: '/merchant/basics/accounting/account/detail',
                    },
                  ],
                  name: 'Account',
                  function_key: 'merchant_manage_web_pc.accounting_account',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70131',
                  menu: {
                    id: '70131',
                    menu_key: 'merchant_manage_web_pc.accounting_account',
                    name: 'Account',
                    parent_id: '70006',
                    sort_number: 37,
                    level: 2,
                    app_id: '10001',
                    url: '/account/management',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/account/pages/management/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80039',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.account_tax_add',
                      function_id: '80039',
                      url: '/merchant/basics/accounting/tax/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.account_tax_edit',
                      function_id: '80039',
                      url: '/merchant/basics/accounting/tax/modify',
                    },
                    {
                      name: 'Delete',
                      action_key: 'merchant_manage_web_pc.account_tax_delete',
                      function_id: '80039',
                      url: '/merchant/basics/accounting/tax/remove',
                    },
                    {
                      name: 'Detail',
                      action_key: 'merchant_manage_web_pc.account_tax_detail',
                      function_id: '80039',
                      url: '/merchant/basics/accounting/tax/detail',
                    },
                  ],
                  name: 'Tax',
                  function_key: 'merchant_manage_web_pc.accounting_tax',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70133',
                  menu: {
                    id: '70133',
                    menu_key: 'merchant_manage_web_pc.accounting_tax',
                    name: 'Tax',
                    parent_id: '70006',
                    sort_number: 39,
                    level: 2,
                    app_id: '10001',
                    url: '/account/tax',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/account/pages/tax/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1941054302951948290',
                  actions: [],
                  name: 'Chart of Account',
                  function_key: 'merchant_manage_web_pc.chart_of_accounts',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1941054302775787521',
                  menu: {
                    id: '1941054302775787521',
                    menu_key: 'merchant_manage_web_pc.chart_of_accounts',
                    name: 'menu_name.merchant_manage_web_pc.chart_of_accounts',
                    parent_id: '70006',
                    sort_number: 9,
                    level: 2,
                    app_id: '10001',
                    url: '/account/chart-of-accounts',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'DIRECTORY',
                    component_paths:
                      '/features/account/pages/chart-of-accounts/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1941055430817071106',
                  actions: [],
                  name: 'Subsidiary Ledger',
                  function_key: 'merchant_manage_web_pc.subsidiary-ledger',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1941055430695436289',
                  menu: {
                    id: '1941055430695436289',
                    menu_key: 'merchant_manage_web_pc.subsidiary-ledger',
                    name: 'Subsidiary Ledger',
                    parent_id: '70006',
                    sort_number: 5,
                    level: 2,
                    app_id: '10001',
                    url: 'subsidiary-ledger',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'DIRECTORY',
                    component_paths:
                      '/features/account/pages/subsidiary-ledger/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1947221137405587457',
                  actions: [
                    {
                      name: 'action_name.merchant_manage_web_pc.collection_voucher_add',
                      action_key:
                        'merchant_manage_web_pc.collection_voucher_add',
                      function_id: '1947221137405587457',
                      url: '',
                    },
                    {
                      name: 'action_name.merchant_manage_web_pc.collection_voucher_edit',
                      action_key:
                        'merchant_manage_web_pc.collection_voucher_edit',
                      function_id: '1947221137405587457',
                      url: '',
                    },
                    {
                      name: 'action_name.merchant_manage_web_pc.collection_voucher_delete',
                      action_key:
                        'merchant_manage_web_pc.collection_voucher_delete',
                      function_id: '1947221137405587457',
                      url: '',
                    },
                    {
                      name: 'action_name.merchant_manage_web_pc.collection_voucher_detail',
                      action_key:
                        'merchant_manage_web_pc.collection_voucher_detail',
                      function_id: '1947221137405587457',
                      url: '',
                    },
                    {
                      name: 'action_name.merchant_manage_web_pc.collection_voucher_audit',
                      action_key:
                        'merchant_manage_web_pc.collection_voucher_audit',
                      function_id: '1947221137405587457',
                      url: '',
                    },
                  ],
                  name: 'Collection Voucher',
                  function_key: 'merchant_manage_web_pc.collection_voucher',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1947221137221038082',
                  menu: {
                    id: '1947221137221038082',
                    menu_key: 'merchant_manage_web_pc.collection_voucher',
                    name: 'Collection Voucher',
                    parent_id: '70006',
                    sort_number: 57,
                    level: 2,
                    app_id: '10001',
                    url: 'collection-voucher',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/account/pages/collection-voucher/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1948392391261106177',
                  actions: [],
                  name: 'Final transfer',
                  function_key: 'merchant_manage_web_pc.final-transfer',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1948392391105916929',
                  menu: {
                    id: '1948392391105916929',
                    menu_key: 'merchant_manage_web_pc.final-transfer',
                    name: 'Final transfer',
                    parent_id: '70006',
                    sort_number: 1,
                    level: 2,
                    app_id: '10001',
                    url: 'final-transfer',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'DIRECTORY',
                    component_paths:
                      '/features/account/pages/final-transfer/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80032',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80040',
              actions: [],
              name: 'Sales',
              function_key: 'merchant_manage_web_pc.sales',
              app_id: '10001',
              style_class: 'icon-icon_sale',
              menu_id: '70007',
              menu: {
                id: '70007',
                menu_key: 'merchant_manage_web_pc.sales',
                name: 'Sales',
                parent_id: '0',
                sort_number: 40,
                level: 1,
                app_id: '10001',
                url: '/sale',
                style_class: 'icon-icon_sale',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80041',
                  actions: [
                    {
                      name: 'Hold',
                      action_key: 'merchant_manage_web_pc.sale_scan_code_hold',
                      function_id: '80041',
                      url: '/merchant/order/order-holding/create',
                    },
                    {
                      name: 'Take',
                      action_key: 'merchant_manage_web_pc.sale_scan_code_take',
                      function_id: '80041',
                      url: '',
                    },
                    {
                      name: 'Select Customer',
                      action_key:
                        'merchant_manage_web_pc.sale_scan_code_select_customer',
                      function_id: '80041',
                      url: '/merchant/basics/customer/page-list',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.sale_scan_code_delete',
                      function_id: '80041',
                      url: '/merchant/order/order-holding/remove',
                    },
                    {
                      name: 'Settlement',
                      action_key:
                        'merchant_manage_web_pc.sale_scan_code_settlement',
                      function_id: '80041',
                      url: '/merchant/order/calc',
                    },
                    {
                      name: 'Empty',
                      action_key: 'merchant_manage_web_pc.sale_scan_code_empty',
                      function_id: '80041',
                      url: '',
                    },
                    {
                      name: 'Order details',
                      action_key:
                        'merchant_manage_web_pc.sale_scan_code_detail',
                      function_id: '80041',
                      url: '/merchant/order/detail',
                    },
                    {
                      name: 'Online order payment',
                      action_key:
                        'merchant_manage_web_pc.sale_scan_code_online_pay',
                      function_id: '80041',
                      url: '/merchant/order/online/pay',
                    },
                    {
                      name: 'Offline refund',
                      action_key:
                        'merchant_manage_web_pc.sale_scan_code_offline_refund',
                      function_id: '80041',
                      url: '/merchant/order/returned/offline/refund',
                    },
                    {
                      name: 'Delete pending orders',
                      action_key: 'merchant_manage_web_pc.sale_hold_delete',
                      function_id: '80041',
                      url: '',
                    },
                    {
                      name: 'Delete pending orders',
                      action_key: 'merchant_manage_web_pc.hold_product_delete',
                      function_id: '80041',
                      url: '',
                    },
                  ],
                  name: 'Scan Code Retail',
                  function_key: 'merchant_manage_web_pc.sales_scan_code_retail',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70134',
                  menu: {
                    id: '70134',
                    menu_key: 'merchant_manage_web_pc.sales_scan_code_retail',
                    name: 'Scan Code Retail',
                    parent_id: '70007',
                    sort_number: 41,
                    level: 2,
                    app_id: '10001',
                    url: '/sale/scan/code',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/sale/pages/scan/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80040',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80042',
                  actions: [
                    {
                      name: 'Scan Code Retail',
                      action_key:
                        'merchant_manage_web_pc.sale_order_scan_code_retail',
                      function_id: '80042',
                      url: '/merchant/order/create',
                    },
                    {
                      name: 'Export',
                      action_key: 'merchant_manage_web_pc.sale_order_export',
                      function_id: '80042',
                      url: '/merchant/base/file-export/export',
                    },
                    {
                      name: 'Online order payment',
                      action_key:
                        'merchant_manage_web_pc.sale_order_scan_code_online_pay',
                      function_id: '80042',
                      url: '/merchant/order/online/pay',
                    },
                  ],
                  name: 'Sales Order',
                  function_key: 'merchant_manage_web_pc.sales_sales_order',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70135',
                  menu: {
                    id: '70135',
                    menu_key: 'merchant_manage_web_pc.sales_sales_order',
                    name: 'Sales Order',
                    parent_id: '70007',
                    sort_number: 42,
                    level: 2,
                    app_id: '10001',
                    url: '/sale/order',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/sale/pages/order/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80040',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80043',
                  actions: [
                    {
                      name: 'Order Return',
                      action_key: 'merchant_manage_web_pc.sale_returned_order',
                      function_id: '80043',
                      url: '/merchant/order/returned/create',
                    },
                    {
                      name: 'Print Receipts',
                      action_key: 'merchant_manage_web_pc.sale_returned_print',
                      function_id: '80043',
                      url: '',
                    },
                    {
                      name: 'Offline refund',
                      action_key:
                        'merchant_manage_web_pc.sale_returned_offline_refund',
                      function_id: '80043',
                      url: '/merchant/order/returned/offline/refund',
                    },
                  ],
                  name: 'Order Returned',
                  function_key: 'merchant_manage_web_pc.sales_order_returned',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70136',
                  menu: {
                    id: '70136',
                    menu_key: 'merchant_manage_web_pc.sales_order_returned',
                    name: 'merchant_manage_web_pc.menu_name.sales.order_returned',
                    parent_id: '70007',
                    sort_number: 43,
                    level: 2,
                    app_id: '10001',
                    url: '/sale/returned',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/sale/pages/returned/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80040',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80044',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.sale_shift_add',
                      function_id: '80044',
                      url: '/merchant/trade/shift-change/shift/create',
                    },
                    {
                      name: 'Export',
                      action_key: 'merchant_manage_web_pc.sale_shift_export',
                      function_id: '80044',
                      url: '/merchant/base/file-export/export',
                    },
                  ],
                  name: 'Shifts Change',
                  function_key: 'merchant_manage_web_pc.sales_shifts_change',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70137',
                  menu: {
                    id: '70137',
                    menu_key: 'merchant_manage_web_pc.sales_shifts_change',
                    name: 'Shifts Change',
                    parent_id: '70007',
                    sort_number: 44,
                    level: 2,
                    app_id: '10001',
                    url: '/sale/shifts',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/sale/pages/shifts/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80040',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80045',
                  actions: [
                    {
                      name: 'Export',
                      action_key: 'merchant_manage_web_pc.sale_daily_export',
                      function_id: '80045',
                      url: '/merchant/base/file-export/export',
                    },
                  ],
                  name: 'Daily Settlement',
                  function_key: 'merchant_manage_web_pc.sales_daily_settlement',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70138',
                  menu: {
                    id: '70138',
                    menu_key: 'merchant_manage_web_pc.sales_daily_settlement',
                    name: 'Daily Settlement',
                    parent_id: '70007',
                    sort_number: 45,
                    level: 2,
                    app_id: '10001',
                    url: '/sale/enter/product',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/sale/pages/enter/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80040',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80046',
              actions: [],
              name: 'Reports',
              function_key: 'merchant_manage_web_pc.reports',
              app_id: '10001',
              style_class: 'icon-icon_reports',
              menu_id: '70008',
              menu: {
                id: '70008',
                menu_key: 'merchant_manage_web_pc.reports',
                name: 'Reports',
                parent_id: '0',
                sort_number: 46,
                level: 1,
                app_id: '10001',
                url: '/report',
                style_class: 'icon-icon_reports',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80047',
                  actions: [
                    {
                      name: 'Export',
                      action_key: 'merchant_manage_web_pc.report_sales_export',
                      function_id: '80047',
                      url: '/merchant/base/file-export/export',
                    },
                  ],
                  name: 'Product Sales Reports',
                  function_key:
                    'merchant_manage_web_pc.reports_product_sales_reports',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70139',
                  menu: {
                    id: '70139',
                    menu_key:
                      'merchant_manage_web_pc.reports_product_sales_reports',
                    name: 'Product Sales Reports',
                    parent_id: '70008',
                    sort_number: 47,
                    level: 2,
                    app_id: '10001',
                    url: '/report/sales',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/report/pages/sales/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80046',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80048',
                  actions: [
                    {
                      name: 'Export',
                      action_key:
                        'merchant_manage_web_pc.report_customer_export',
                      function_id: '80048',
                      url: '/merchant/base/file-export/export',
                    },
                  ],
                  name: 'Financial Statement',
                  function_key:
                    'merchant_manage_web_pc.reports_financial_statement',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70140',
                  menu: {
                    id: '70140',
                    menu_key:
                      'merchant_manage_web_pc.reports_financial_statement',
                    name: 'Financial Statement',
                    parent_id: '70008',
                    sort_number: 48,
                    level: 2,
                    app_id: '10001',
                    url: '/report/financial',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/report/pages/financial/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80046',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80049',
                  actions: [
                    {
                      name: 'Data overview',
                      action_key:
                        'merchant_manage_web_pc.report_customer_overview',
                      function_id: '80049',
                      url: '/merchant/basics/reports/report-merchant/customer/overview',
                    },
                  ],
                  name: 'Customer Reports',
                  function_key:
                    'merchant_manage_web_pc.reports_customer_reports',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70141',
                  menu: {
                    id: '70141',
                    menu_key: 'merchant_manage_web_pc.reports_customer_reports',
                    name: 'Customer Reports',
                    parent_id: '70008',
                    sort_number: 49,
                    level: 2,
                    app_id: '10001',
                    url: '/report/customer',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/report/pages/customer/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80046',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80050',
                  actions: [
                    {
                      name: 'Export',
                      action_key:
                        'merchant_manage_web_pc.report_inventory_export',
                      function_id: '80050',
                      url: '/merchant/base/file-export/export',
                    },
                    {
                      name: 'Total',
                      action_key:
                        'merchant_manage_web_pc.report_inventory_total',
                      function_id: '80050',
                      url: '/merchant/basics/reports/report-stock/total',
                    },
                  ],
                  name: 'Inventory Reports',
                  function_key:
                    'merchant_manage_web_pc.reports_inventory_reports',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70142',
                  menu: {
                    id: '70142',
                    menu_key:
                      'merchant_manage_web_pc.reports_inventory_reports',
                    name: 'Inventory Reports',
                    parent_id: '70008',
                    sort_number: 50,
                    level: 2,
                    app_id: '10001',
                    url: '/report/inventory',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/report/pages/inventory/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80046',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80051',
              actions: [],
              name: 'Employee',
              function_key: 'merchant_manage_web_pc.employee',
              app_id: '10001',
              style_class: 'icon-icon_Employee',
              menu_id: '70009',
              menu: {
                id: '70009',
                menu_key: 'merchant_manage_web_pc.employee',
                name: 'Employee',
                parent_id: '0',
                sort_number: 51,
                level: 1,
                app_id: '10001',
                url: '/employee',
                style_class: 'icon-icon_Employee',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80052',
                  actions: [
                    {
                      name: 'Add',
                      action_key: 'merchant_manage_web_pc.employee_role_add',
                      function_id: '80052',
                      url: '/passport/role/create',
                    },
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.employee_role_edit',
                      function_id: '80052',
                      url: '/passport/role/modify',
                    },
                    {
                      name: 'Delete',
                      action_key: 'merchant_manage_web_pc.employee_role_delete',
                      function_id: '80052',
                      url: '/passport/role/batch/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.employee_role_list_detail',
                      function_id: '80052',
                      url: '/passport/role/function/detail',
                    },
                  ],
                  name: 'Role Management',
                  function_key:
                    'merchant_manage_web_pc.employee_role_management',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70143',
                  menu: {
                    id: '70143',
                    menu_key: 'merchant_manage_web_pc.employee_role_management',
                    name: 'Role Management',
                    parent_id: '70009',
                    sort_number: 52,
                    level: 2,
                    app_id: '10001',
                    url: '/employee/role',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/employee/pages/role/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80051',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80053',
                  actions: [
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.employee_management_add',
                      function_id: '80053',
                      url: '/passport/user/normal/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.employee_management_edit',
                      function_id: '80053',
                      url: '/passport/user/normal/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.employee_management_delete',
                      function_id: '80053',
                      url: '/passport/user/normal/remove',
                    },
                    {
                      name: 'Detail',
                      action_key:
                        'merchant_manage_web_pc.employee_management_list_detail',
                      function_id: '80053',
                      url: '',
                    },
                    {
                      name: 'Reset Password',
                      action_key:
                        'merchant_manage_web_pc.employee_management_reset_password',
                      function_id: '80053',
                      url: '/passport/user/password/reset',
                    },
                    {
                      name: 'Switch status',
                      action_key:
                        'merchant_manage_web_pc.employee_management_froze_status',
                      function_id: '80053',
                      url: '/passport/user/normal/froze',
                    },
                  ],
                  name: 'Employee Management',
                  function_key:
                    'merchant_manage_web_pc.employee_employee_management',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70144',
                  menu: {
                    id: '70144',
                    menu_key:
                      'merchant_manage_web_pc.employee_employee_management',
                    name: 'Employee Management',
                    parent_id: '70009',
                    sort_number: 53,
                    level: 2,
                    app_id: '10001',
                    url: '/employee/index',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths: '/features/employee/pages/list/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80051',
                },
                sub_function_trees: null,
              },
            ],
          },
          {
            function: {
              function_id: '80055',
              actions: [],
              name: 'Settings',
              function_key: 'merchant_manage_web_pc.settings',
              app_id: '10001',
              style_class: 'icon-icon_setup',
              menu_id: '70010',
              menu: {
                id: '70010',
                menu_key: 'merchant_manage_web_pc.settings',
                name: 'Settings',
                parent_id: '0',
                sort_number: 55,
                level: 1,
                app_id: '10001',
                url: '/setting',
                style_class: 'icon-icon_setup',
                status: 'ACTIVE',
                shortcuts: '',
                type: 'DIRECTORY',
                component_paths: '',
                component_name: '',
                is_displayed: true,
              },
              parent_id: '0',
            },
            sub_function_trees: [
              {
                function: {
                  function_id: '80056',
                  actions: [
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.setting_storeset_edit',
                      function_id: '80056',
                      url: '/merchant/basics/merchant/sub-merchant/modify',
                    },
                  ],
                  name: 'Store Settings',
                  function_key:
                    'merchant_manage_web_pc.settings_store_settings',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70146',
                  menu: {
                    id: '70146',
                    menu_key: 'merchant_manage_web_pc.settings_store_settings',
                    name: 'merchant_manage_web_pc.menu_name.settings.store_settings',
                    parent_id: '70010',
                    sort_number: 56,
                    level: 2,
                    app_id: '10001',
                    url: '/setting/storeset',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/setting/pages/storeset/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80055',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80057',
                  actions: [
                    {
                      name: 'Prohibited Switch',
                      action_key:
                        'merchant_manage_web_pc.setting_sales_prohibited',
                      function_id: '80057',
                      url: '/merchant/basics/settings/setting-merchant-system/modify',
                    },
                  ],
                  name: 'Sales Settings',
                  function_key:
                    'merchant_manage_web_pc.settings_sales_settings',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70147',
                  menu: {
                    id: '70147',
                    menu_key: 'merchant_manage_web_pc.settings_sales_settings',
                    name: 'merchant_manage_web_pc.menu_name.settings.sales_settings',
                    parent_id: '70010',
                    sort_number: 57,
                    level: 2,
                    app_id: '10001',
                    url: '/setting/saleset',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/setting/pages/saleset/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80055',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80058',
                  actions: [
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.setting_template_edit',
                      function_id: '80058',
                      url: '/merchant/basics/settings/print-template-merchant/list',
                    },
                    {
                      name: 'Add',
                      action_key:
                        'merchant_manage_web_pc.setting_template_add_receipt',
                      function_id: '80058',
                      url: '/merchant/basics/settings/print-template-merchant/create',
                    },
                    {
                      name: 'Edit',
                      action_key:
                        'merchant_manage_web_pc.setting_template_edit_receipt',
                      function_id: '80058',
                      url: '/merchant/basics/settings/print-template-merchant/modify',
                    },
                    {
                      name: 'Delete',
                      action_key:
                        'merchant_manage_web_pc.setting_template_delete_receipt',
                      function_id: '80058',
                      url: '/merchant/basics/settings/print-template-merchant/remove',
                    },
                  ],
                  name: 'Template Settings',
                  function_key:
                    'merchant_manage_web_pc.settings_template_settings',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70148',
                  menu: {
                    id: '70148',
                    menu_key:
                      'merchant_manage_web_pc.settings_template_settings',
                    name: 'merchant_manage_web_pc.menu_name.settings.template_settings',
                    parent_id: '70010',
                    sort_number: 58,
                    level: 2,
                    app_id: '10001',
                    url: '/setting/template',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/setting/pages/template/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80055',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '80059',
                  actions: [
                    {
                      name: 'Edit',
                      action_key: 'merchant_manage_web_pc.setting_payment_edit',
                      function_id: '80059',
                      url: '/merchant/basics/settings/setting-merchant-system/modify',
                    },
                  ],
                  name: 'Payment Mode Settings',
                  function_key:
                    'merchant_manage_web_pc.settings_payment_mode_settings',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '70149',
                  menu: {
                    id: '70149',
                    menu_key:
                      'merchant_manage_web_pc.settings_payment_mode_settings',
                    name: 'merchant_manage_web_pc.menu_name.settings.payment_mode_settings',
                    parent_id: '70010',
                    sort_number: 59,
                    level: 2,
                    app_id: '10001',
                    url: '/setting/payment',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'PAGE',
                    component_paths:
                      '/features/setting/pages/payment/index.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80055',
                },
                sub_function_trees: null,
              },
              {
                function: {
                  function_id: '1967876137202823170',
                  actions: [],
                  name: 'function_name.merchant_manage_web_pc.code-rules',
                  function_key: 'merchant_manage_web_pc.code-rules',
                  app_id: '10001',
                  style_class: '',
                  menu_id: '1967876136905027586',
                  menu: {
                    id: '1967876136905027586',
                    menu_key: 'merchant_manage_web_pc.code-rules',
                    name: 'menu_name.merchant_manage_web_pc.code-rules',
                    parent_id: '70010',
                    sort_number: 1,
                    level: 2,
                    app_id: '10001',
                    url: '/setting/code-rules',
                    style_class: '',
                    status: 'ACTIVE',
                    shortcuts: '',
                    type: 'DIRECTORY',
                    component_paths:
                      '/features/setting/pages/code-rules/code-rules.vue',
                    component_name: '',
                    is_displayed: true,
                  },
                  parent_id: '80055',
                },
                sub_function_trees: null,
              },
            ],
          },
        ],
      };
    });
}

export async function basicsMerchantList(data: any) {
  return requestClient.post('/v1/merchant/basics/merchant/list', data);
}

/**
 * 获取用户角色信息
 */
export async function getUserRolesApi() {
  return requestClient.get('/v1/passport/role/user/roles');
}
