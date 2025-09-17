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
        <!-- 客户选择 -->
        <FormItem
          name="customer_id"
          :label="t('customers.customerName')"
          :rules="[{ required: true, message: t('customers.please_select_customer') }]"
        >
          <Select
            v-model:value="formData.customer_id"
            :placeholder="t('customers.please_select_customer')"
            :options="customerOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 收入金额 -->
        <FormItem
          name="amount"
          :label="t('customers.amount')"
          :rules="[{ required: true, message: t('customers.please_enter_amount') }]"
        >
          <InputNumber
            v-model:value="formData.amount"
            :placeholder="t('customers.please_enter_amount')"
            :precision="2"
            :min="0"
            style="width: 100%"
          />
        </FormItem>

        <!-- 日期 -->
        <FormItem
          name="date"
          :label="t('customers.date')"
          :rules="[{ required: true, message: t('customers.please_select_date') }]"
        >
          <DatePicker
            v-model:value="formData.date"
            :placeholder="t('customers.please_select_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 交易单号 -->
        <FormItem
          name="transaction_number"
          :label="t('customers.transactionNumber')"
        >
          <Input
            v-model:value="formData.transaction_number"
            :placeholder="t('customers.please_enter_transaction_number')"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem
          name="remark"
          :label="t('customers.remark')"
        >
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('customers.please_enter_remark')"
            :rows="4"
          />
        </FormItem>
      </Form>
    </div>

    <template #footer>
      <Space>
        <Button @click="handleCancel">
          {{ t('common.cancel') }}
        </Button>
        <Button type="primary" @click="handleSubmit" :loading="loading">
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
  Select,
  InputNumber,
  DatePicker,
  Input,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  CustomerAccountCreateVO,
  AccountType,
} from '@@/customer/types';

import {
  addCustomerRevenueApi,
  addCustomerExpenditureApi,
} from '@@/customer/apis';

defineOptions({
  name: 'CustomerRevenueDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const customerOptions = ref([]);

// 表单数据
const formData = ref<CustomerAccountCreateVO>({
  customer_id: 0,
  type: 'REVENUE',
  amount: 0,
  date: '',
  remark: '',
  transaction_number: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  customer_id: [{ required: true, message: t('customers.please_select_customer') }],
  amount: [{ required: true, message: t('customers.please_enter_amount') }],
  date: [{ required: true, message: t('customers.please_select_date') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'REVENUE') {
    return t('customers.addRevenue');
  } else if (type === 'EXPENDITURE') {
    return t('customers.addExpenditures');
  } else {
    return t('customers.accountManagement');
  }
});

// 抽屉数据
const drawerData = ref<{ type: AccountType } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadCustomerOptions();
      formData.value.type = newData.type;
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

    if (formData.value.type === 'REVENUE') {
      await addCustomerRevenueApi(submitData);
    } else if (formData.value.type === 'EXPENDITURE') {
      await addCustomerExpenditureApi(submitData);
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
const setDrawerData = (data: { type: AccountType }) => {
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
