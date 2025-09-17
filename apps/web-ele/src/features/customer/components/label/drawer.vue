<script setup lang="ts">
import type {
  CustomerLabelCreateVO,
  CustomerLabelModifyVO,
  LabelColor,
} from '@@/customer/types';

import { computed, ref, watch } from 'vue';

import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Space,
  Textarea,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createCustomerLabelApi,
  getCustomerLabelDetailApi,
  updateCustomerLabelApi,
} from '@@/customer/apis';

defineOptions({
  name: 'CustomerLabelDrawer',
});

const emit = defineEmits<{
  success: [];
}>();
const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 标签类型选项
const labelTypeOptions = [
  { label: t('customer.labelType.category'), value: 'CATEGORY' },
  { label: t('customer.labelType.status'), value: 'STATUS' },
  { label: t('customer.labelType.level'), value: 'LEVEL' },
  { label: t('customer.labelType.behavior'), value: 'BEHAVIOR' },
  { label: t('customer.labelType.preference'), value: 'PREFERENCE' },
  { label: t('customer.labelType.other'), value: 'OTHER' },
];

// 颜色选项
const colorOptions = [
  { label: t('customer.color.red'), value: 'RED' },
  { label: t('customer.color.orange'), value: 'ORANGE' },
  { label: t('customer.color.yellow'), value: 'YELLOW' },
  { label: t('customer.color.green'), value: 'GREEN' },
  { label: t('customer.color.blue'), value: 'BLUE' },
  { label: t('customer.color.purple'), value: 'PURPLE' },
  { label: t('customer.color.pink'), value: 'PINK' },
  { label: t('customer.color.gray'), value: 'GRAY' },
];

// 获取颜色值
const getColorValue = (color: LabelColor) => {
  const colorMap = {
    RED: '#f56565',
    ORANGE: '#ed8936',
    YELLOW: '#ecc94b',
    GREEN: '#48bb78',
    BLUE: '#4299e1',
    PURPLE: '#9f7aea',
    PINK: '#f687b3',
    GRAY: '#a0aec0',
  };
  return colorMap[color] || '#a0aec0';
};

// 表单数据
const formData = ref<CustomerLabelCreateVO | CustomerLabelModifyVO>({
  label_name: '',
  label_code: '',
  label_type: 'CATEGORY',
  color: 'RED',
  sort_order: 0,
  description: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  label_name: [
    { required: true, message: t('customer.please_enter_label_name') },
  ],
  label_code: [
    { required: true, message: t('customer.please_enter_label_code') },
  ],
  label_type: [
    { required: true, message: t('customer.please_select_label_type') },
  ],
  color: [{ required: true, message: t('customer.please_select_color') }],
  sort_order: [
    { required: true, message: t('customer.please_enter_sort_order') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  switch (type) {
    case 'add': {
      return t('customer.addCustomerLabel');
    }
    case 'detail': {
      return t('customer.customerLabelDetail');
    }
    case 'edit': {
      return t('customer.editCustomerLabel');
    }
    default: {
      return t('customer.customerLabel');
    }
  }
});

// 抽屉数据
const drawerData = ref<null | { id?: number; type: string }>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      if (newData.type === 'edit' || newData.type === 'detail') {
        if (newData.id) {
          await loadFormData(newData.id);
        }
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true },
);

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getCustomerLabelDetailApi({
      label_id: id,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      label_name: data.label_name,
      label_code: data.label_code,
      label_type: data.label_type,
      color: data.color,
      sort_order: data.sort_order,
      description: data.description,
    };
  } catch (error) {
    console.error('加载客户标签详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    label_name: '',
    label_code: '',
    label_type: 'CATEGORY',
    color: 'RED',
    sort_order: 0,
    description: '',
    merchant_id: userStore.merchantId,
  };
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
      await createCustomerLabelApi(submitData as CustomerLabelCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateCustomerLabelApi({
        ...submitData,
        label_id: drawerData.value.id,
      } as CustomerLabelModifyVO);
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
const setDrawerData = (data: { id?: number; type: string }) => {
  drawerData.value = data;
};

// 暴露方法
defineExpose({
  setDrawerData,
});
</script>

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
        <!-- 标签名称 -->
        <FormItem
          name="label_name"
          :label="t('customer.labelName')"
          :rules="[
            { required: true, message: t('customer.please_enter_label_name') },
          ]"
        >
          <Input
            v-model:value="formData.label_name"
            :placeholder="t('customer.please_enter_label_name')"
          />
        </FormItem>

        <!-- 标签编码 -->
        <FormItem
          name="label_code"
          :label="t('customer.labelCode')"
          :rules="[
            { required: true, message: t('customer.please_enter_label_code') },
          ]"
        >
          <Input
            v-model:value="formData.label_code"
            :placeholder="t('customer.please_enter_label_code')"
          />
        </FormItem>

        <!-- 标签类型 -->
        <FormItem
          name="label_type"
          :label="t('customer.labelType')"
          :rules="[
            { required: true, message: t('customer.please_select_label_type') },
          ]"
        >
          <Select
            v-model:value="formData.label_type"
            :placeholder="t('customer.please_select_label_type')"
            :options="labelTypeOptions"
          />
        </FormItem>

        <!-- 标签颜色 -->
        <FormItem
          name="color"
          :label="t('customer.color')"
          :rules="[
            { required: true, message: t('customer.please_select_color') },
          ]"
        >
          <Select
            v-model:value="formData.color"
            :placeholder="t('customer.please_select_color')"
            :options="colorOptions"
          >
            <template #option="{ label, value }">
              <div class="flex items-center">
                <div
                  class="mr-2 h-4 w-4 rounded"
                  :style="{ backgroundColor: getColorValue(value) }"
                ></div>
                <span>{{ label }}</span>
              </div>
            </template>
          </Select>
        </FormItem>

        <!-- 排序 -->
        <FormItem
          name="sort_order"
          :label="t('customer.sortOrder')"
          :rules="[
            { required: true, message: t('customer.please_enter_sort_order') },
          ]"
        >
          <InputNumber
            v-model:value="formData.sort_order"
            :min="0"
            :precision="0"
            style="width: 100%"
            :placeholder="t('customer.please_enter_sort_order')"
          />
        </FormItem>

        <!-- 描述 -->
        <FormItem name="description" :label="t('customer.description')">
          <Textarea
            v-model:value="formData.description"
            :placeholder="t('customer.please_enter_description')"
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
