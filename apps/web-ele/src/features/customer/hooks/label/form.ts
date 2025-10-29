import type { ISchema } from '@igourd/common-ui';

import { h } from 'vue';

import { action, ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getCustomerListApi } from '@@/customer/apis';

import { useDrawerForm } from '#/hooks/use-drawer-form';

const UploadButton = () => {
  return h(ElButton, {}, { default: () => '上传图片' });
};
const detailData = {};
export function useCustomerlabelForm() {
  const { t } = useI18n();

  const schema: ISchema = {
    type: 'object',
    properties: {
      card1: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: t('list.basic-information'),
        },
        properties: {
          name: {
            type: 'string',
            title: t('list.customer-label'),
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: t('list.customer-name'),
              class: 'w-[300px]',
            },
          },
        },
      },
      card2: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: t('list.basic-information'),
        },
        properties: {
          customer_id_list: {
            type: 'array',
            title: t('list.customer'),
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'TransferTable',
            'x-component-props': {
              rowKey: 'id',
              columns: [
                {
                  label: "{{t('label.customer')}}",
                  prop: 'name',
                  filter: { type: 'input' },
                },
                {
                  label: "{{t('label.contact-telephone')}}",
                  prop: 'product_code',
                  width: 140,
                  filter: {
                    type: 'select',
                    options: [
                      { label: 'A', value: 'A' },
                      { label: 'B', value: 'B' },
                    ],
                  },
                },
              ],
              fetchLeft: '{{ actions.fetchProducts }}',
              // fetchRight: '{{ actions.fetchSelectedProducts }}',
              fetchByIds: '{{ actions.fetchProductsByIds }}',
              getAllIdsUnderFilter: '{{ actions.getAllIdsUnderFilter }}',
              topFilterFields: [
                {
                  key: 'customer',
                  label: "{{t('label.customer')}}",
                  type: 'remote-select',
                  remoteMethod: '{{ actions.searchVendors }}',
                },
                {
                  key: 'brand',
                  label: "{{t('label.contact-telephone')}}",
                  type: 'select',
                  options: [{ label: 'Nike', value: 'nike' }],
                },
              ],
              searchPlaceholder:
                "{{t('list.enter-purchase-order-no-vendor-name-')}}",
              excludeSelectedFromLeft: true,
            },
          },
        },
      },
    },
  };
  const useAsyncDataSource = (service) => (field) => {
    field.loading = true;
    service(field).then(
      action?.bound((data) => {
        field.dataSource = data;
        field.loading = false;
      }),
    );
  };

  const loadData = async (field: { props: { name: string } }) => {
    const result = await getCustomerListApi({
      page_num: 1,
      page_size: 100,
    });
    const option = result.list.map(
      (item: { label: string; value: string }) => ({
        label: item.name,
        value: item.id,
      }),
    );
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('label.add-label'),
      appendToMain: true,
      class: 'w-3/4',
    },
    formOptions: {
      schema,
      scope: {
        loadData,
        actions: {
          fetchProducts: getCustomerListApi,
          fetchSelectedProducts: (params) => {
            // params.product_label_id = detailData.value.id;
            return [{}];
          },
          fetchProductsByIds: () => [],
          getAllIdsUnderFilter: () => [],
          searchVendors: () => [],
        },
      },
    },
  });
}
