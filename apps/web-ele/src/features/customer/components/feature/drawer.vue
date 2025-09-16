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
        <!-- 特征名称 -->
        <FormItem
          name="feature_name"
          :label="t('customer.featureName')"
          :rules="[{ required: true, message: t('customer.please_enter_feature_name') }]"
        >
          <Input
            v-model:value="formData.feature_name"
            :placeholder="t('customer.please_enter_feature_name')"
          />
        </FormItem>

        <!-- 特征编码 -->
        <FormItem
          name="feature_code"
          :label="t('customer.featureCode')"
          :rules="[{ required: true, message: t('customer.please_enter_feature_code') }]"
        >
          <Input
            v-model:value="formData.feature_code"
            :placeholder="t('customer.please_enter_feature_code')"
          />
        </FormItem>

        <!-- 特征类型 -->
        <FormItem
          name="feature_type"
          :label="t('customer.featureType')"
          :rules="[{ required: true, message: t('customer.please_select_feature_type') }]"
        >
          <Select
            v-model:value="formData.feature_type"
            :placeholder="t('customer.please_select_feature_type')"
            :options="featureTypeOptions"
          />
        </FormItem>

        <!-- 是否必填 -->
        <FormItem
          name="is_required"
          :label="t('customer.isRequired')"
        >
          <Switch
            v-model:checked="formData.is_required"
          />
        </FormItem>

        <!-- 是否可搜索 -->
        <FormItem
          name="is_searchable"
          :label="t('customer.isSearchable')"
        >
          <Switch
            v-model:checked="formData.is_searchable"
          />
        </FormItem>

        <!-- 排序 -->
        <FormItem
          name="sort_order"
          :label="t('customer.sortOrder')"
          :rules="[{ required: true, message: t('customer.please_enter_sort_order') }]"
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
        <FormItem
          name="description"
          :label="t('customer.description')"
        >
          <Textarea
            v-model:value="formData.description"
            :placeholder="t('customer.please_enter_description')"
            :rows="3"
          />
        </FormItem>
      </Form>

      <!-- 选项配置 -->
      <div v-if="needOptions" class="mt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">{{ t('customer.options') }}</h3>
          <Button type="primary" @click="handleAddOption">
            {{ t('customer.addOption') }}
          </Button>
        </div>

        <Table
          :data-source="formData.options"
          :columns="optionColumns"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'option_label'">
              <Input
                v-model:value="record.option_label"
                :placeholder="t('customer.please_enter_option_label')"
              />
            </template>
            <template v-else-if="column.key === 'option_value'">
              <Input
                v-model:value="record.option_value"
                :placeholder="t('customer.please_enter_option_value')"
              />
            </template>
            <template v-else-if="column.key === 'sort_order'">
              <InputNumber
                v-model:value="record.sort_order"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </template>
            <template v-else-if="column.key === 'action'">
              <Button type="link" danger @click="handleRemoveOption(index)">
                {{ t('common.delete') }}
              </Button>
            </template>
          </template>
        </Table>
      </div>
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
  Switch,
  InputNumber,
  Textarea,
  Button,
  Space,
  Table,
} from '@igourd/common-ui';

import type {
  CustomerFeatureCreateVO,
  CustomerFeatureModifyVO,
  FeatureType,
  FeatureOption,
} from '@@/customer/types';

import {
  createCustomerFeatureApi,
  updateCustomerFeatureApi,
  getCustomerFeatureDetailApi,
} from '@@/customer/apis';

defineOptions({
  name: 'CustomerFeatureDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 特征类型选项
const featureTypeOptions = [
  { label: t('customer.featureType.text'), value: 'TEXT' },
  { label: t('customer.featureType.number'), value: 'NUMBER' },
  { label: t('customer.featureType.date'), value: 'DATE' },
  { label: t('customer.featureType.select'), value: 'SELECT' },
  { label: t('customer.featureType.multiSelect'), value: 'MULTI_SELECT' },
  { label: t('customer.featureType.boolean'), value: 'BOOLEAN' },
  { label: t('customer.featureType.other'), value: 'OTHER' },
];

// 表单数据
const formData = ref<CustomerFeatureCreateVO | CustomerFeatureModifyVO>({
  feature_name: '',
  feature_code: '',
  feature_type: 'TEXT',
  is_required: false,
  is_searchable: false,
  sort_order: 0,
  description: '',
  options: [],
  merchant_id: userStore.merchantId,
});

// 是否需要选项配置
const needOptions = computed(() => {
  return ['SELECT', 'MULTI_SELECT'].includes(formData.value.feature_type);
});

// 表单规则
const formRules = computed(() => ({
  feature_name: [{ required: true, message: t('customer.please_enter_feature_name') }],
  feature_code: [{ required: true, message: t('customer.please_enter_feature_code') }],
  feature_type: [{ required: true, message: t('customer.please_select_feature_type') }],
  sort_order: [{ required: true, message: t('customer.please_enter_sort_order') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('customer.addCustomerFeature');
  } else if (type === 'edit') {
    return t('customer.editCustomerFeature');
  } else if (type === 'detail') {
    return t('customer.customerFeatureDetail');
  } else {
    return t('customer.customerFeature');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 选项列定义
const optionColumns = [
  {
    title: t('customer.optionLabel'),
    key: 'option_label',
    width: 150,
  },
  {
    title: t('customer.optionValue'),
    key: 'option_value',
    width: 150,
  },
  {
    title: t('customer.sortOrder'),
    key: 'sort_order',
    width: 100,
  },
  {
    title: t('common.action'),
    key: 'action',
    width: 80,
  },
];

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

// 监听特征类型变化
watch(
  () => formData.value.feature_type,
  (newType) => {
    if (!needOptions.value) {
      formData.value.options = [];
    } else if (!formData.value.options || formData.value.options.length === 0) {
      formData.value.options = [];
    }
  }
);

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getCustomerFeatureDetailApi({
      feature_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      feature_name: data.feature_name,
      feature_code: data.feature_code,
      feature_type: data.feature_type,
      is_required: data.is_required,
      is_searchable: data.is_searchable,
      sort_order: data.sort_order,
      description: data.description,
      options: data.options || [],
    };
  } catch (error) {
    console.error('加载客户特征详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    feature_name: '',
    feature_code: '',
    feature_type: 'TEXT',
    is_required: false,
    is_searchable: false,
    sort_order: 0,
    description: '',
    options: [],
    merchant_id: userStore.merchantId,
  };
};

// 添加选项
const handleAddOption = () => {
  if (!formData.value.options) {
    formData.value.options = [];
  }
  formData.value.options.push({
    option_label: '',
    option_value: '',
    sort_order: formData.value.options.length + 1,
  });
};

// 删除选项
const handleRemoveOption = (index: number) => {
  if (formData.value.options) {
    formData.value.options.splice(index, 1);
  }
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
      await createCustomerFeatureApi(submitData as CustomerFeatureCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateCustomerFeatureApi({
        ...submitData,
        feature_id: drawerData.value.id,
      } as CustomerFeatureModifyVO);
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
