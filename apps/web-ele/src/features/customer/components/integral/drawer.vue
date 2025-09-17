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
        <!-- 客户选择 -->
        <FormItem
          name="customer_id"
          :label="t('customer.customerName')"
          :rules="[
            { required: true, message: t('customer.please_select_customer') },
          ]"
        >
          <Select
            v-model:value="formData.customer_id"
            :placeholder="t('customer.please_select_customer')"
            :options="customerOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 积分类型 -->
        <FormItem
          name="integral_type"
          :label="t('customer.integralType')"
          :rules="[
            {
              required: true,
              message: t('customer.please_select_integral_type'),
            },
          ]"
        >
          <Select
            v-model:value="formData.integral_type"
            :placeholder="t('customer.please_select_integral_type')"
            :options="integralTypeOptions"
          />
        </FormItem>

        <!-- 积分数量 -->
        <FormItem
          name="points"
          :label="t('customer.points')"
          :rules="[
            { required: true, message: t('customer.please_enter_points') },
          ]"
        >
          <InputNumber
            v-model:value="formData.points"
            :min="0"
            :precision="0"
            style="width: 100%"
            :placeholder="t('customer.please_enter_points')"
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

        <!-- 获得日期 -->
        <FormItem
          name="earn_date"
          :label="t('customer.earnDate')"
          :rules="[
            { required: true, message: t('customer.please_select_earn_date') },
          ]"
        >
          <DatePicker
            v-model:value="formData.earn_date"
            :placeholder="t('customer.please_select_earn_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 过期日期 -->
        <FormItem name="expire_date" :label="t('customer.expireDate')">
          <DatePicker
            v-model:value="formData.expire_date"
            :placeholder="t('customer.please_select_expire_date')"
            style="width: 100%"
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
import { useIgourdDrawer } from '@igourd/common-ui';
import {
  Form,
  FormItem,
  Select,
  InputNumber,
  DatePicker,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  CustomerIntegralCreateVO,
  CustomerIntegralModifyVO,
  IntegralType,
} from '@@/customer/types';

import {
  createCustomerIntegralApi,
  updateCustomerIntegralApi,
  getCustomerIntegralDetailApi,
} from '@@/customer/apis';

defineOptions({
  name: 'CustomerIntegralDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const customerOptions = ref([]);

// 积分类型选项
const integralTypeOptions = [
  { label: t('customer.integralType.earn'), value: 'EARN' },
  { label: t('customer.integralType.spend'), value: 'SPEND' },
  { label: t('customer.integralType.expire'), value: 'EXPIRE' },
  { label: t('customer.integralType.adjust'), value: 'ADJUST' },
  { label: t('customer.integralType.refund'), value: 'REFUND' },
];

// 表单数据
const formData = ref<CustomerIntegralCreateVO | CustomerIntegralModifyVO>({
  customer_id: 0,
  integral_type: 'EARN',
  points: 0,
  description: '',
  earn_date: '',
  expire_date: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  customer_id: [
    { required: true, message: t('customer.please_select_customer') },
  ],
  integral_type: [
    { required: true, message: t('customer.please_select_integral_type') },
  ],
  points: [{ required: true, message: t('customer.please_enter_points') }],
  earn_date: [
    { required: true, message: t('customer.please_select_earn_date') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('customer.addCustomerIntegral');
  } else if (type === 'edit') {
    return t('customer.editCustomerIntegral');
  } else if (type === 'detail') {
    return t('customer.customerIntegralDetail');
  } else {
    return t('customer.customerIntegral');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadCustomerOptions();

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

// 加载客户选项
const loadCustomerOptions = async () => {
  try {
    // 这里应该调用获取客户列表的 API
    // 暂时使用空数组
    customerOptions.value = [];
  } catch (error) {
    console.error('加载客户选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getCustomerIntegralDetailApi({
      integral_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      customer_id: data.customer_id,
      integral_type: data.integral_type,
      points: data.points,
      description: data.description,
      earn_date: data.earn_date,
      expire_date: data.expire_date,
    };
  } catch (error) {
    console.error('加载客户积分详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    customer_id: 0,
    integral_type: 'EARN',
    points: 0,
    description: '',
    earn_date: '',
    expire_date: '',
    merchant_id: userStore.merchantId,
  };
};

// 客户选项过滤
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
      await createCustomerIntegralApi(submitData as CustomerIntegralCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateCustomerIntegralApi({
        ...submitData,
        integral_id: drawerData.value.id,
      } as CustomerIntegralModifyVO);
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
