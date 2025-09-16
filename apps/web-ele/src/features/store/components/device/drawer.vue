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
        <!-- 设备名称 -->
        <FormItem
          name="device_name"
          :label="t('store.deviceName')"
          :rules="[{ required: true, message: t('store.please_enter_device_name') }]"
        >
          <Input
            v-model:value="formData.device_name"
            :placeholder="t('store.please_enter_device_name')"
          />
        </FormItem>

        <!-- 设备编码 -->
        <FormItem
          name="device_code"
          :label="t('store.deviceCode')"
          :rules="[{ required: true, message: t('store.please_enter_device_code') }]"
        >
          <Input
            v-model:value="formData.device_code"
            :placeholder="t('store.please_enter_device_code')"
          />
        </FormItem>

        <!-- 设备类型 -->
        <FormItem
          name="device_type"
          :label="t('store.deviceType')"
          :rules="[{ required: true, message: t('store.please_select_device_type') }]"
        >
          <Select
            v-model:value="formData.device_type"
            :placeholder="t('store.please_select_device_type')"
            :options="deviceTypeOptions"
          />
        </FormItem>

        <!-- 所属店铺 -->
        <FormItem
          name="store_id"
          :label="t('store.storeName')"
          :rules="[{ required: true, message: t('store.please_select_store') }]"
        >
          <Select
            v-model:value="formData.store_id"
            :placeholder="t('store.please_select_store')"
            :options="storeOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- IP地址 -->
        <FormItem
          name="ip_address"
          :label="t('store.ipAddress')"
          :rules="[{ required: true, message: t('store.please_enter_ip_address') }]"
        >
          <Input
            v-model:value="formData.ip_address"
            :placeholder="t('store.please_enter_ip_address')"
          />
        </FormItem>

        <!-- MAC地址 -->
        <FormItem
          name="mac_address"
          :label="t('store.macAddress')"
          :rules="[{ required: true, message: t('store.please_enter_mac_address') }]"
        >
          <Input
            v-model:value="formData.mac_address"
            :placeholder="t('store.please_enter_mac_address')"
          />
        </FormItem>

        <!-- 版本号 -->
        <FormItem
          name="version"
          :label="t('store.version')"
          :rules="[{ required: true, message: t('store.please_enter_version') }]"
        >
          <Input
            v-model:value="formData.version"
            :placeholder="t('store.please_enter_version')"
          />
        </FormItem>

        <!-- 位置 -->
        <FormItem
          name="location"
          :label="t('store.location')"
          :rules="[{ required: true, message: t('store.please_enter_location') }]"
        >
          <Input
            v-model:value="formData.location"
            :placeholder="t('store.please_enter_location')"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem
          name="remark"
          :label="t('store.remark')"
        >
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('store.please_enter_remark')"
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
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import {
  Form,
  FormItem,
  Input,
  Select,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  StoreDeviceCreateVO,
  StoreDeviceModifyVO,
  DeviceType,
} from '@@igourd/stores/types';

import {
  createStoreDeviceApi,
  updateStoreDeviceApi,
  getStoreDeviceDetailApi,
} from '@@igourd/stores/apis';

defineOptions({
  name: 'StoreDeviceDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const storeOptions = ref([]);

// 设备类型选项
const deviceTypeOptions = [
  { label: t('store.deviceType.pos'), value: 'POS' },
  { label: t('store.deviceType.printer'), value: 'PRINTER' },
  { label: t('store.deviceType.scanner'), value: 'SCANNER' },
  { label: t('store.deviceType.display'), value: 'DISPLAY' },
  { label: t('store.deviceType.camera'), value: 'CAMERA' },
  { label: t('store.deviceType.other'), value: 'OTHER' },
];

// 表单数据
const formData = ref<StoreDeviceCreateVO | StoreDeviceModifyVO>({
  device_name: '',
  device_code: '',
  device_type: 'POS',
  store_id: 0,
  ip_address: '',
  mac_address: '',
  version: '',
  location: '',
  remark: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  device_name: [{ required: true, message: t('store.please_enter_device_name') }],
  device_code: [{ required: true, message: t('store.please_enter_device_code') }],
  device_type: [{ required: true, message: t('store.please_select_device_type') }],
  store_id: [{ required: true, message: t('store.please_select_store') }],
  ip_address: [{ required: true, message: t('store.please_enter_ip_address') }],
  mac_address: [{ required: true, message: t('store.please_enter_mac_address') }],
  version: [{ required: true, message: t('store.please_enter_version') }],
  location: [{ required: true, message: t('store.please_enter_location') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('store.addDevice');
  } else if (type === 'edit') {
    return t('store.editDevice');
  } else if (type === 'detail') {
    return t('store.deviceDetail');
  } else {
    return t('store.device');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadStoreOptions();

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

// 加载店铺选项
const loadStoreOptions = async () => {
  try {
    // 这里应该调用获取店铺列表的 API
    // 暂时使用空数组
    storeOptions.value = [];
  } catch (error) {
    console.error('加载店铺选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getStoreDeviceDetailApi({
      device_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      device_name: data.device_name,
      device_code: data.device_code,
      device_type: data.device_type,
      store_id: data.store_id,
      ip_address: data.ip_address,
      mac_address: data.mac_address,
      version: data.version,
      location: data.location,
      remark: data.remark,
    };
  } catch (error) {
    console.error('加载设备详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    device_name: '',
    device_code: '',
    device_type: 'POS',
    store_id: 0,
    ip_address: '',
    mac_address: '',
    version: '',
    location: '',
    remark: '',
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
      await createStoreDeviceApi(submitData as StoreDeviceCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateStoreDeviceApi({
        ...submitData,
        device_id: drawerData.value.id,
      } as StoreDeviceModifyVO);
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
