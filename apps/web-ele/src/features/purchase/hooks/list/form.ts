import type { ISchema } from '@igourd/common-ui';

import { inject, ref } from 'vue';

import { action, ElButton, useFieldSchema } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';

import { basicsCountryAreaList } from '#/api/common';
import { useDrawerForm } from '#/hooks/use-drawer-form';
import { getDynamicColumnList } from '@@/inventory/apis';
import dayjs from 'dayjs';
import {
  createPurchaseVendorApi,
  updatePurchaseRecordApi,
} from '@@/purchase/apis';

const dynamicColumn = ref([]);
//获取动态列数据
getDynamicColumnList({ entity: 'VENDOR' }).then((res) => {
  dynamicColumn.value = res.list;
});
export function useListForm() {
  const { t } = useI18n();
  const { gridApi } = inject<{
  gridApi: ExtendedVxeGridApi;
}>(Symbol.for('PageGrid'), { gridApi: null });


  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('common.creator')}:`;

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
    const optionResult = await basicsCountryAreaList({});
    const option = optionResult.map(
      (item: { label: string; value: string }) => ({
        label: `${item.name}+${item.area_code}`,
        value: `+${item.area_code}`,
      }),
    );
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  // 表单提交处理
  const handleSubmit = async (formData: any) => {
    try {
      let response = null;
      // 处理动态字段数据
      const dynamicData = {}
      dynamicColumn.value.forEach(element => {
          dynamicData[element.key] = formData[element.key]
      });
      formData.dynamic_data = JSON.stringify(dynamicData);
      response = formData.id
        ? updatePurchaseRecordApi(formData)
        : await createPurchaseVendorApi(formData);
      gridApi.reload();
      return response;
    } catch (error) {
      console.error('供应商 customized form submission error:', error);
      throw error;
    }
  };

  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('purchase.add-vendor'),
      appendToMain: true,
      class: 'w-full',
      contentClass: 'bg-muted',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          if (data.effective_time) {
            data.effective_time = dayjs(data.effective_time).format(
              'YYYY-MM-DD',
            );
          }

          //处理动态数据
          if(data.dynamic_data){
              data.dynamic_data = JSON.parse(data.dynamic_data);
          }
          const params ={
            ...data,
            ...data.dynamic_data
          }
          formAPI.setValues(params);
          formAPI.setFormState({ readPretty: data?.mode === 'detail' });
        }
      },
      async onConfirm() {
        await formAPI.validate();
        drawerApi.lock();
        await handleSubmit(formAPI.values)
          .then(() => {
            drawerApi.close();
          })
          .finally(() => {
            drawerApi.unlock();
          });
      },
    },
    formOptions: {
      schema: null,
      scope: {
        userLabel,
        userName,
        useAsyncDataSource,
        loadData,
      },
    },
  });
  return { Drawer, Form, drawerApi, formAPI };
}
