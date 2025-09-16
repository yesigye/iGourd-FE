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
          :rules="[{ required: true, message: t('customer.please_select_customer') }]"
        >
          <Select
            v-model:value="formData.customer_id"
            :placeholder="t('customer.please_select_customer')"
            :options="customerOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 权益类型 -->
        <FormItem
          name="equity_type"
          :label="t('customer.equityType')"
          :rules="[{ required: true, message: t('customer.please_select_equity_type') }]"
        >
          <Select
            v-model:value="formData.equity_type"
            :placeholder="t('customer.please_select_equity_type')"
            :options="equityTypeOptions"
          />
        </FormItem>

        <!-- 权益值 -->
        <FormItem
          name="equity_value"
          :label="t('customer.equityValue')"
          :rules="[{ required: true, message: t('customer.please_enter_equity_value') }]"
        >
          <InputNumber
            v-model:value="formData.equity_value"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('customer.please_enter_equity_value')"
          />
        </FormItem>

        <!-- 权益单位 -->
        <FormItem
          name="equity_unit"
          :label="t('customer.equityUnit')"
          :rules="[{ required: true, message: t('customer.please_enter_equity_unit') }]"
        >
          <Input
            v-model:value="formData.equity_unit"
            :placeholder="t('customer.please_enter_equity_unit')"
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

        <!-- 授予日期 -->
        <FormItem
          name="granted_date"
          :label="t('customer.grantedDate')"
          :rules="[{ required: true, message: t('customer.please_select_granted_date') }]"
        >
          <DatePicker
            v-model:value="formData.granted_date"
            :placeholder="t('customer.please_select_granted_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 过期日期 -->
        <FormItem
          name="expiry_date"
          :label="t('customer.expiryDate')"
        >
          <DatePicker
            v-model:value="formData.expiry_date"
            :placeholder="t('customer.please_select_expiry_date')"
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
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import {
  Form,
  FormItem,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  CustomerEquityCreateVO,
  CustomerEquityModifyVO,
  EquityType,
} from '@@/customer/types';

import {
  createCustomerEquityApi,
  updateCustomerEquityApi,
  getCustomerEquityDetailApi,
} from '@@/customer/apis';

defineOptions({
  name: 'CustomerEquityDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const customerOptions = ref([]);

// 权益类型选项
const equityTypeOptions = [
  { label: t('customer.equityType.vipLevel'), value: 'VIP_LEVEL' },
  { label: t('customer.equityType.discount'), value: 'DISCOUNT' },
  { label: t('customer.equityType.point'), value: 'POINT' },
  { label: t('customer.equityType.cashback'), value: 'CASHBACK' },
  { label: t('customer.equityType.gift'), value: 'GIFT' },
  { label: t('customer.equityType.other'), value: 'OTHER' },
];

// 表单数据
const formData = ref<CustomerEquityCreateVO | CustomerEquityModifyVO>({
  customer_id: 0,
  equity_type: 'VIP_LEVEL',
  equity_value: 0,
  equity_unit: '',
  description: '',
  granted_date: '',
  expiry_date: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  customer_id: [{ required: true, message: t('customer.please_select_customer') }],
  equity_type: [{ required: true, message: t('customer.please_select_equity_type') }],
  equity_value: [{ required: true, message: t('customer.please_enter_equity_value') }],
  equity_unit: [{ required: true, message: t('customer.please_enter_equity_unit') }],
  granted_date: [{ required: true, message: t('customer.please_select_granted_date') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('customer.addCustomerEquity');
  } else if (type === 'edit') {
    return t('customer.editCustomerEquity');
  } else if (type === 'detail') {
    return t('customer.customerEquityDetail');
  } else {
    return t('customer.customerEquity');
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
  { immediate: true }
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
    const response = await getCustomerEquityDetailApi({
      equity_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      customer_id: data.customer_id,
      equity_type: data.equity_type,
      equity_value: data.equity_value,
      equity_unit: data.equity_unit,
      description: data.description,
      granted_date: data.granted_date,
      expiry_date: data.expiry_date,
    };
  } catch (error) {
    console.error('加载客户股权详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    customer_id: 0,
    equity_type: 'VIP_LEVEL',
    equity_value: 0,
    equity_unit: '',
    description: '',
    granted_date: '',
    expiry_date: '',
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
      await createCustomerEquityApi(submitData as CustomerEquityCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateCustomerEquityApi({
        ...submitData,
        equity_id: drawerData.value.id,
      } as CustomerEquityModifyVO);
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
