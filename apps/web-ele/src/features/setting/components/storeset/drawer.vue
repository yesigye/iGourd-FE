<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="drawerTitle"
    :width="800"
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
        <!-- 设置名称 -->
        <FormItem
          name="setting_name"
          :label="t('setting.settingName')"
          :rules="[{ required: true, message: t('setting.please_enter_setting_name') }]"
        >
          <Input
            v-model:value="formData.setting_name"
            :placeholder="t('setting.please_enter_setting_name')"
          />
        </FormItem>

        <!-- 设置键 -->
        <FormItem
          name="setting_key"
          :label="t('setting.settingKey')"
          :rules="[{ required: true, message: t('setting.please_enter_setting_key') }]"
        >
          <Input
            v-model:value="formData.setting_key"
            :placeholder="t('setting.please_enter_setting_key')"
          />
        </FormItem>

        <!-- 设置值 -->
        <FormItem
          name="setting_value"
          :label="t('setting.settingValue')"
          :rules="[{ required: true, message: t('setting.please_enter_setting_value') }]"
        >
          <Input
            v-model:value="formData.setting_value"
            :placeholder="t('setting.please_enter_setting_value')"
          />
        </FormItem>

        <!-- 设置类型 -->
        <FormItem
          name="setting_type"
          :label="t('setting.settingType')"
          :rules="[{ required: true, message: t('setting.please_select_setting_type') }]"
        >
          <Select
            v-model:value="formData.setting_type"
            :placeholder="t('setting.please_select_setting_type')"
            :options="settingTypeOptions"
          />
        </FormItem>

        <!-- 分组名称 -->
        <FormItem
          name="group_name"
          :label="t('setting.groupName')"
          :rules="[{ required: true, message: t('setting.please_select_group_name') }]"
        >
          <Select
            v-model:value="formData.group_name"
            :placeholder="t('setting.please_select_group_name')"
            :options="groupNameOptions"
          />
        </FormItem>

        <!-- 描述 -->
        <FormItem
          name="description"
          :label="t('setting.description')"
          :rules="[{ required: true, message: t('setting.please_enter_description') }]"
        >
          <Textarea
            v-model:value="formData.description"
            :placeholder="t('setting.please_enter_description')"
            :rows="3"
          />
        </FormItem>

        <!-- 排序 -->
        <FormItem
          name="sort_order"
          :label="t('setting.sortOrder')"
          :rules="[{ required: true, message: t('setting.please_enter_sort_order') }]"
        >
          <InputNumber
            v-model:value="formData.sort_order"
            :min="0"
            style="width: 100%"
            :placeholder="t('setting.please_enter_sort_order')"
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
  InputNumber,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  SettingStoresetCreateVO,
  SettingStoresetModifyVO,
} from '@@/setting/types';

import {
  createSettingStoresetApi,
  updateSettingStoresetApi,
  getSettingStoresetDetailApi,
} from '@@/setting/apis';

defineOptions({
  name: 'SettingStoresetDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 设置类型选项
const settingTypeOptions = [
  { label: t('setting.settingType.boolean'), value: 'boolean' },
  { label: t('setting.settingType.string'), value: 'string' },
  { label: t('setting.settingType.number'), value: 'number' },
  { label: t('setting.settingType.json'), value: 'json' },
];

// 分组名称选项
const groupNameOptions = [
  { label: t('setting.group.basic'), value: 'basic' },
  { label: t('setting.group.business'), value: 'business' },
  { label: t('setting.group.display'), value: 'display' },
  { label: t('setting.group.policy'), value: 'policy' },
];

// 表单数据
const formData = ref<SettingStoresetCreateVO | SettingStoresetModifyVO>({
  setting_name: '',
  setting_key: '',
  setting_value: '',
  setting_type: 'string',
  description: '',
  group_name: 'basic',
  sort_order: 0,
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  setting_name: [{ required: true, message: t('setting.please_enter_setting_name') }],
  setting_key: [{ required: true, message: t('setting.please_enter_setting_key') }],
  setting_value: [{ required: true, message: t('setting.please_enter_setting_value') }],
  setting_type: [{ required: true, message: t('setting.please_select_setting_type') }],
  group_name: [{ required: true, message: t('setting.please_select_group_name') }],
  description: [{ required: true, message: t('setting.please_enter_description') }],
  sort_order: [{ required: true, message: t('setting.please_enter_sort_order') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('setting.addStoreset');
  } else if (type === 'edit') {
    return t('setting.editStoreset');
  } else if (type === 'detail') {
    return t('setting.storesetDetail');
  } else {
    return t('setting.storeset');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

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
  { immediate: true }
);

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getSettingStoresetDetailApi({
      storeset_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      setting_name: data.setting_name,
      setting_key: data.setting_key,
      setting_value: data.setting_value,
      setting_type: data.setting_type,
      description: data.description,
      group_name: data.group_name,
      sort_order: data.sort_order,
    };
  } catch (error) {
    console.error('加载店铺设置详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    setting_name: '',
    setting_key: '',
    setting_value: '',
    setting_type: 'string',
    description: '',
    group_name: 'basic',
    sort_order: 0,
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
      await createSettingStoresetApi(submitData as SettingStoresetCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateSettingStoresetApi({
        ...submitData,
        storeset_id: drawerData.value.id,
      } as SettingStoresetModifyVO);
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
