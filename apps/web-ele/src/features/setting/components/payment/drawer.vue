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
          name="payment_method_name"
          :label="t('setting.paymentMethodName')"
          :rules="[{ required: true, message: t('setting.please_enter_payment_method_name') }]"
        >
          <Input
            v-model:value="formData.payment_method_name"
            :placeholder="t('setting.please_enter_payment_method_name')"
          />
        </FormItem>

        <!-- 支付方式类型 -->
        <FormItem
          name="payment_type"
          :label="t('setting.paymentType')"
          :rules="[{ required: true, message: t('setting.please_select_payment_type') }]"
        >
          <Select
            v-model:value="formData.payment_type"
            :placeholder="t('setting.please_select_payment_type')"
            :options="paymentTypeOptions"
          />
        </FormItem>

        <!-- 支付场景 -->
        <FormItem
          name="scenes"
          :label="t('setting.scenes')"
          :rules="[{ required: true, message: t('setting.please_select_scenes') }]"
        >
          <Select
            v-model:value="formData.scenes"
            :placeholder="t('setting.please_select_scenes')"
            :options="sceneOptions"
            mode="multiple"
          />
        </FormItem>

        <!-- 图标URL -->
        <FormItem
          name="icon_url"
          :label="t('setting.iconUrl')"
          :rules="[{ required: true, message: t('setting.please_enter_icon_url') }]"
        >
          <Input
            v-model:value="formData.icon_url"
            :placeholder="t('setting.please_enter_icon_url')"
          />
        </FormItem>

        <!-- 费率 -->
        <FormItem
          name="fee_rate"
          :label="t('setting.feeRate')"
          :rules="[{ required: true, message: t('setting.please_enter_fee_rate') }]"
        >
          <InputNumber
            v-model:value="formData.fee_rate"
            :min="0"
            :max="100"
            :precision="2"
            style="width: 100%"
            :placeholder="t('setting.please_enter_fee_rate')"
          />
        </FormItem>

        <!-- 最小金额 -->
        <FormItem
          name="min_amount"
          :label="t('setting.minAmount')"
          :rules="[{ required: true, message: t('setting.please_enter_min_amount') }]"
        >
          <InputNumber
            v-model:value="formData.min_amount"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('setting.please_enter_min_amount')"
          />
        </FormItem>

        <!-- 最大金额 -->
        <FormItem
          name="max_amount"
          :label="t('setting.maxAmount')"
          :rules="[{ required: true, message: t('setting.please_enter_max_amount') }]"
        >
          <InputNumber
            v-model:value="formData.max_amount"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('setting.please_enter_max_amount')"
          />
        </FormItem>

        <!-- 日限额 -->
        <FormItem
          name="daily_limit"
          :label="t('setting.dailyLimit')"
          :rules="[{ required: true, message: t('setting.please_enter_daily_limit') }]"
        >
          <InputNumber
            v-model:value="formData.daily_limit"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('setting.please_enter_daily_limit')"
          />
        </FormItem>

        <!-- 月限额 -->
        <FormItem
          name="monthly_limit"
          :label="t('setting.monthlyLimit')"
          :rules="[{ required: true, message: t('setting.please_enter_monthly_limit') }]"
        >
          <InputNumber
            v-model:value="formData.monthly_limit"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('setting.please_enter_monthly_limit')"
          />
        </FormItem>

        <!-- 配置信息 -->
        <FormItem
          name="config"
          :label="t('setting.config')"
        >
          <Textarea
            v-model:value="configJson"
            :placeholder="t('setting.please_enter_config')"
            :rows="4"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem
          name="remark"
          :label="t('setting.remark')"
        >
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('setting.please_enter_remark')"
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
  InputNumber,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  SettingPaymentCreateVO,
  SettingPaymentModifyVO,
  PaymentType,
  PaymentScene,
} from '@@/setting/types';

import {
  createSettingPaymentApi,
  updateSettingPaymentApi,
  getSettingPaymentDetailApi,
} from '@@/setting/apis';

defineOptions({
  name: 'SettingPaymentDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 支付方式类型选项
const paymentTypeOptions = [
  { label: t('setting.paymentType.alipay'), value: 'ALIPAY' },
  { label: t('setting.paymentType.wechat'), value: 'WECHAT' },
  { label: t('setting.paymentType.unionpay'), value: 'UNIONPAY' },
  { label: t('setting.paymentType.cash'), value: 'CASH' },
  { label: t('setting.paymentType.card'), value: 'CARD' },
  { label: t('setting.paymentType.other'), value: 'OTHER' },
];

// 支付场景选项
const sceneOptions = [
  { label: t('setting.scene.pos'), value: 'POS' },
  { label: t('setting.scene.online'), value: 'ONLINE' },
  { label: t('setting.scene.mobile'), value: 'MOBILE' },
  { label: t('setting.scene.all'), value: 'ALL' },
];

// 表单数据
const formData = ref<SettingPaymentCreateVO | SettingPaymentModifyVO>({
  payment_method_name: '',
  payment_type: 'ALIPAY',
  scenes: ['POS'],
  icon_url: '',
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
  payment_method_name: [{ required: true, message: t('setting.please_enter_payment_method_name') }],
  payment_type: [{ required: true, message: t('setting.please_select_payment_type') }],
  scenes: [{ required: true, message: t('setting.please_select_scenes') }],
  icon_url: [{ required: true, message: t('setting.please_enter_icon_url') }],
  fee_rate: [{ required: true, message: t('setting.please_enter_fee_rate') }],
  min_amount: [{ required: true, message: t('setting.please_enter_min_amount') }],
  max_amount: [{ required: true, message: t('setting.please_enter_max_amount') }],
  daily_limit: [{ required: true, message: t('setting.please_enter_daily_limit') }],
  monthly_limit: [{ required: true, message: t('setting.please_enter_monthly_limit') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('setting.addPayment');
  } else if (type === 'edit') {
    return t('setting.editPayment');
  } else if (type === 'detail') {
    return t('setting.paymentDetail');
  } else {
    return t('setting.payment');
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

// 监听配置JSON变化
watch(configJson, (newValue) => {
  try {
    formData.value.config = JSON.parse(newValue || '{}');
  } catch (error) {
    // 忽略JSON解析错误
  }
});

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getSettingPaymentDetailApi({
      payment_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      payment_method_name: data.payment_method_name,
      payment_type: data.payment_type,
      scenes: data.scenes,
      icon_url: data.icon_url,
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
    console.error('加载支付设置详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    payment_method_name: '',
    payment_type: 'ALIPAY',
    scenes: ['POS'],
    icon_url: '',
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
      await createSettingPaymentApi(submitData as SettingPaymentCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateSettingPaymentApi({
        ...submitData,
        payment_id: drawerData.value.id,
      } as SettingPaymentModifyVO);
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
