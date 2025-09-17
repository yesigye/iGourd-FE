<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="drawerTitle"
    :width="600"
    @register="register"
    @success="handleSuccess"
  >
    <div class="p-4">
      <Form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- 店铺名称 -->
        <FormItem
          name="store_name"
          :label="t('store.storeName')"
          :rules="[{ required: true, message: t('store.please_enter_store_name') }]"
        >
          <Input
            v-model:value="formData.store_name"
            :placeholder="t('store.please_enter_store_name')"
          />
        </FormItem>

        <!-- 店铺编码 -->
        <FormItem
          name="store_code"
          :label="t('store.storeCode')"
          :rules="[{ required: true, message: t('store.please_enter_store_code') }]"
        >
          <Input
            v-model:value="formData.store_code"
            :placeholder="t('store.please_enter_store_code')"
          />
        </FormItem>

        <!-- 店铺类型 -->
        <FormItem
          name="store_type"
          :label="t('store.storeType')"
          :rules="[{ required: true, message: t('store.please_select_store_type') }]"
        >
          <Select
            v-model:value="formData.store_type"
            :placeholder="t('store.please_select_store_type')"
            :options="storeTypeOptions"
          />
        </FormItem>

        <!-- 地址 -->
        <FormItem
          name="address"
          :label="t('store.address')"
          :rules="[{ required: true, message: t('store.please_enter_address') }]"
        >
          <Textarea
            v-model:value="formData.address"
            :placeholder="t('store.please_enter_address')"
            :rows="3"
          />
        </FormItem>

        <!-- 城市 -->
        <FormItem
          name="city"
          :label="t('store.city')"
          :rules="[{ required: true, message: t('store.please_enter_city') }]"
        >
          <Input
            v-model:value="formData.city"
            :placeholder="t('store.please_enter_city')"
          />
        </FormItem>

        <!-- 电话 -->
        <FormItem
          name="phone"
          :label="t('store.phone')"
          :rules="[{ required: true, message: t('store.please_enter_phone') }]"
        >
          <Input
            v-model:value="formData.phone"
            :placeholder="t('store.please_enter_phone')"
          />
        </FormItem>

        <!-- 店长选择 -->
        <FormItem
          name="manager_id"
          :label="t('store.managerName')"
          :rules="[{ required: true, message: t('store.please_select_manager') }]"
        >
          <Select
            v-model:value="formData.manager_id"
            :placeholder="t('store.please_select_manager')"
            :options="managerOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 开业日期 -->
        <FormItem
          name="open_date"
          :label="t('store.openDate')"
          :rules="[{ required: true, message: t('store.please_select_open_date') }]"
        >
          <DatePicker
            v-model:value="formData.open_date"
            :placeholder="t('store.please_select_open_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 描述 -->
        <FormItem
          name="description"
          :label="t('store.description')"
        >
          <Textarea
            v-model:value="formData.description"
            :placeholder="t('store.please_enter_description')"
            :rows="3"
          />
        </FormItem>
      </Form>
    </div>

    <template #footer>
      <Space>
        <Button @click="handleCancel">
          {{ t('common.cancel') }}
        </Button>
        <Button
          v-if="drawerData?.type !== 'detail'"
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ t('common.confirm') }}
        </Button>
      </Space>
    </template>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useIgourdDrawer } from '@igourd/common-ui';;
import {
  Form,
  FormItem,
  Input,
  Select,
  DatePicker,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  StoreListCreateVO,
  StoreListModifyVO,
  StoreType,
} from '@@/store/types';

import {
  createStoreListApi,
  updateStoreListApi,
  getStoreListDetailApi,
} from '@@/store/apis';

defineOptions({
  name: 'StoreListDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const managerOptions = ref([]);

// 店铺类型选项
const storeTypeOptions = [
  { label: t('store.storeType.retail'), value: 'RETAIL' },
  { label: t('store.storeType.wholesale'), value: 'WHOLESALE' },
  { label: t('store.storeType.online'), value: 'ONLINE' },
  { label: t('store.storeType.hybrid'), value: 'HYBRID' },
];

// 表单数据
const formData = ref<StoreListCreateVO | StoreListModifyVO>({
  store_name: '',
  store_code: '',
  store_type: 'RETAIL',
  address: '',
  city: '',
  phone: '',
  manager_id: 0,
  open_date: '',
  description: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  store_name: [{ required: true, message: t('store.please_enter_store_name') }],
  store_code: [{ required: true, message: t('store.please_enter_store_code') }],
  store_type: [{ required: true, message: t('store.please_select_store_type') }],
  address: [{ required: true, message: t('store.please_enter_address') }],
  city: [{ required: true, message: t('store.please_enter_city') }],
  phone: [{ required: true, message: t('store.please_enter_phone') }],
  manager_id: [{ required: true, message: t('store.please_select_manager') }],
  open_date: [{ required: true, message: t('store.please_select_open_date') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('store.addStore');
  } else if (type === 'edit') {
    return t('store.editStore');
  } else if (type === 'detail') {
    return t('store.storeDetail');
  } else {
    return t('store.store');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadManagerOptions();

      if (newData.type === 'edit' || newData.type === 'detail') {
        if (newData.id) {
          await loadFormData(newData.id);
        }
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true }
);

// 加载店长选项
const loadManagerOptions = async () => {
  try {
    // 这里应该调用获取店长列表的 API
    // 暂时使用空数组
    managerOptions.value = [];
  } catch (error) {
    console.error('加载店长选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getStoreListDetailApi({
      store_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      store_name: data.store_name,
      store_code: data.store_code,
      store_type: data.store_type,
      address: data.address,
      city: data.city,
      phone: data.phone,
      manager_id: data.manager_id,
      open_date: data.open_date,
      description: data.description,
    };
  } catch (error) {
    console.error('加载店铺详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    store_name: '',
    store_code: '',
    store_type: 'RETAIL',
    address: '',
    city: '',
    phone: '',
    manager_id: 0,
    open_date: '',
    description: '',
    merchant_id: userStore.merchantId,
  };
};

// 选项过滤
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const submitData = {
      ...formData.value,
      merchant_id: userStore.merchantId,
    };

    if (drawerData.value?.type === 'add') {
      await createStoreListApi(submitData as StoreListCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateStoreListApi({
        ...submitData,
        store_id: drawerData.value.id,
      } as StoreListModifyVO);
    }

    handleSuccess();
  } catch (error) {
    console.error('提交失败:', error);
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  closeDrawer();
};

// 成功回调
const handleSuccess = () => {
  closeDrawer();
  emit('success');
};

// 设置抽屉数据
const setDrawerData = (data: { type: string; id?: number }) => {
  drawerData.value = data;
};

// 暴露方法
defineExpose({
  setDrawerData,
});

const emit = defineEmits<{
  success: [];
}>();
</script>
