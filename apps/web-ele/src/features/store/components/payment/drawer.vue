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
        <!-- 支付方式名称 -->
        <FormItem
          name="payment_name"
          :label="t('store.paymentName')"
          :rules="[
            { required: true, message: t('store.please_enter_payment_name') },
          ]"
        >
          <Input
            v-model:value="formData.payment_name"
            :placeholder="t('store.please_enter_payment_name')"
          />
        </FormItem>

        <!-- 支付方式编码 -->
        <FormItem
          name="payment_code"
          :label="t('store.paymentCode')"
          :rules="[
            { required: true, message: t('store.please_enter_payment_code') },
          ]"
        >
          <Input
            v-model:value="formData.payment_code"
            :placeholder="t('store.please_enter_payment_code')"
          />
        </FormItem>

        <!-- 支付方式类型 -->
        <FormItem
          name="payment_type"
          :label="t('store.paymentType')"
          :rules="[
            { required: true, message: t('store.please_select_payment_type') },
          ]"
        >
          <Select
            v-model:value="formData.payment_type"
            :placeholder="t('store.please_select_payment_type')"
            :options="paymentTypeOptions"
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

        <!-- 账户名称 -->
        <FormItem
          name="account_name"
          :label="t('store.accountName')"
          :rules="[
            { required: true, message: t('store.please_enter_account_name') },
          ]"
        >
          <Input
            v-model:value="formData.account_name"
            :placeholder="t('store.please_enter_account_name')"
          />
        </FormItem>

        <!-- 账户号码 -->
        <FormItem
          name="account_number"
          :label="t('store.accountNumber')"
          :rules="[
            { required: true, message: t('store.please_enter_account_number') },
          ]"
        >
          <Input
            v-model:value="formData.account_number"
            :placeholder="t('store.please_enter_account_number')"
          />
        </FormItem>

        <!-- 费率 -->
        <FormItem
          name="fee_rate"
          :label="t('store.feeRate')"
          :rules="[
            { required: true, message: t('store.please_enter_fee_rate') },
          ]"
        >
          <InputNumber
            v-model:value="formData.fee_rate"
            :min="0"
            :max="100"
            :precision="2"
            style="width: 100%"
            :placeholder="t('store.please_enter_fee_rate')"
          />
        </FormItem>

        <!-- 最小金额 -->
        <FormItem
          name="min_amount"
          :label="t('store.minAmount')"
          :rules="[
            { required: true, message: t('store.please_enter_min_amount') },
          ]"
        >
          <InputNumber
            v-model:value="formData.min_amount"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('store.please_enter_min_amount')"
          />
        </FormItem>

        <!-- 最大金额 -->
        <FormItem
          name="max_amount"
          :label="t('store.maxAmount')"
          :rules="[
            { required: true, message: t('store.please_enter_max_amount') },
          ]"
        >
          <InputNumber
            v-model:value="formData.max_amount"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('store.please_enter_max_amount')"
          />
        </FormItem>

        <!-- 日限额 -->
        <FormItem
          name="daily_limit"
          :label="t('store.dailyLimit')"
          :rules="[
            { required: true, message: t('store.please_enter_daily_limit') },
          ]"
        >
          <InputNumber
            v-model:value="formData.daily_limit"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('store.please_enter_daily_limit')"
          />
        </FormItem>

        <!-- 月限额 -->
        <FormItem
          name="monthly_limit"
          :label="t('store.monthlyLimit')"
          :rules="[
            { required: true, message: t('store.please_enter_monthly_limit') },
          ]"
        >
          <InputNumber
            v-model:value="formData.monthly_limit"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('store.please_enter_monthly_limit')"
          />
        </FormItem>

        <!-- 配置信息 -->
        <FormItem name="config" :label="t('store.config')">
          <Textarea
            v-model:value="configJson"
            :placeholder="t('store.please_enter_config')"
            :rows="4"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem name="remark" :label="t('store.remark')">
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
  InputNumber,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  StorePaymentCreateVO,
  StorePaymentModifyVO,
  PaymentType,
} from '@@igourd/stores/types';

import {
  createStorePaymentApi,
  updateStorePaymentApi,
  getStorePaymentDetailApi,
} from '@@igourd/stores/apis';

defineOptions({
  name: 'StorePaymentDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const storeOptions = ref([]);

// 支付方式类型选项
const paymentTypeOptions = [
  { label: t('store.paymentType.alipay'), value: 'ALIPAY' },
  { label: t('store.paymentType.wechat'), value: 'WECHAT' },
  { label: t('store.paymentType.unionpay'), value: 'UNIONPAY' },
  { label: t('store.paymentType.cash'), value: 'CASH' },
  { label: t('store.paymentType.card'), value: 'CARD' },
  { label: t('store.paymentType.other'), value: 'OTHER' },
];

// 表单数据
const formData = ref<StorePaymentCreateVO | StorePaymentModifyVO>({
  payment_name: '',
  payment_code: '',
  payment_type: 'ALIPAY',
  store_id: 0,
  account_name: '',
  account_number: '',
  fee_rate: 0,
  min_amount: 0,
  max_amount: 0,
  daily_limit: 0,
  monthly_limit: 0,
  config: {},
  remark: '',
  merchant_id: userStore.merchantId,
});

// 配置JSON字符串
const configJson = ref('');

// 表单规则
const formRules = computed(() => ({
  payment_name: [
    { required: true, message: t('store.please_enter_payment_name') },
  ],
  payment_code: [
    { required: true, message: t('store.please_enter_payment_code') },
  ],
  payment_type: [
    { required: true, message: t('store.please_select_payment_type') },
  ],
  store_id: [{ required: true, message: t('store.please_select_store') }],
  account_name: [
    { required: true, message: t('store.please_enter_account_name') },
  ],
  account_number: [
    { required: true, message: t('store.please_enter_account_number') },
  ],
  fee_rate: [{ required: true, message: t('store.please_enter_fee_rate') }],
  min_amount: [{ required: true, message: t('store.please_enter_min_amount') }],
  max_amount: [{ required: true, message: t('store.please_enter_max_amount') }],
  daily_limit: [
    { required: true, message: t('store.please_enter_daily_limit') },
  ],
  monthly_limit: [
    { required: true, message: t('store.please_enter_monthly_limit') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('store.addPayment');
  } else if (type === 'edit') {
    return t('store.editPayment');
  } else if (type === 'detail') {
    return t('store.paymentDetail');
  } else {
    return t('store.payment');
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
  { immediate: true },
);

// 监听配置JSON变化
watch(configJson, (newValue) => {
  try {
    formData.value.config = JSON.parse(newValue || '{}');
  } catch (error) {
    // 忽略JSON解析错误
  }
});

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
    const response = await getStorePaymentDetailApi({
      payment_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      payment_name: data.payment_name,
      payment_code: data.payment_code,
      payment_type: data.payment_type,
      store_id: data.store_id,
      account_name: data.account_name,
      account_number: data.account_number,
      fee_rate: data.fee_rate,
      min_amount: data.min_amount,
      max_amount: data.max_amount,
      daily_limit: data.daily_limit,
      monthly_limit: data.monthly_limit,
      config: data.config,
      remark: data.remark,
    };

    configJson.value = JSON.stringify(data.config, null, 2);
  } catch (error) {
    console.error('加载支付方式详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    payment_name: '',
    payment_code: '',
    payment_type: 'ALIPAY',
    store_id: 0,
    account_name: '',
    account_number: '',
    fee_rate: 0,
    min_amount: 0,
    max_amount: 0,
    daily_limit: 0,
    monthly_limit: 0,
    config: {},
    remark: '',
    merchant_id: userStore.merchantId,
  };
  configJson.value = '{}';
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
      await createStorePaymentApi(submitData as StorePaymentCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateStorePaymentApi({
        ...submitData,
        payment_id: drawerData.value.id,
      } as StorePaymentModifyVO);
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
