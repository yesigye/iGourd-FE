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
        <!-- 货币名称 -->
        <FormItem
          name="name"
          :label="t('account.currencySymbol')"
          :rules="[{ required: true, message: t('account.please_enter_currency_name') }]"
        >
          <Input
            v-model:value="formData.name"
            :placeholder="t('account.please_enter_currency_name')"
          />
        </FormItem>

        <!-- 货币代码 -->
        <FormItem
          name="code"
          :label="t('account.currencyCode')"
          :rules="[{ required: true, message: t('account.please_enter_currency_code') }]"
        >
          <Input
            v-model:value="formData.code"
            :placeholder="t('account.please_enter_currency_code')"
          />
        </FormItem>

        <!-- 汇率 -->
        <FormItem
          name="exchange_rate"
          :label="t('account.exchangeRate')"
          :rules="[{ required: true, message: t('account.please_enter_exchange_rate') }]"
        >
          <InputNumber
            v-model:value="formData.exchange_rate"
            :placeholder="t('account.please_enter_exchange_rate')"
            :precision="4"
            :min="0"
            style="width: 100%"
          />
        </FormItem>

        <!-- 货币符号 -->
        <FormItem
          name="symbol"
          :label="t('account.symbol')"
          :rules="[{ required: true, message: t('account.please_enter_symbol') }]"
        >
          <Input
            v-model:value="formData.symbol"
            :placeholder="t('account.please_enter_symbol')"
          />
        </FormItem>

        <!-- 小数位数 -->
        <FormItem
          name="decimal_places"
          :label="t('account.decimalPlaces')"
        >
          <InputNumber
            v-model:value="formData.decimal_places"
            :placeholder="t('account.please_enter_decimal_places')"
            :min="0"
            :max="6"
            style="width: 100%"
          />
        </FormItem>

        <!-- 是否默认 -->
        <FormItem
          name="is_default"
          :label="t('account.is_default')"
        >
          <Switch v-model:checked="formData.is_default" />
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
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  CurrencyForm,
} from '@@/account/types';

import {
  createCurrencyApi,
  updateCurrencyApi,
  getCurrencyDetailApi,
} from '@@/account/apis';

defineOptions({
  name: 'CurrencyDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 表单数据
const formData = ref<CurrencyForm>({
  name: '',
  code: '',
  exchange_rate: 1,
  symbol: '',
  decimal_places: 2,
  is_default: false,
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  name: [{ required: true, message: t('account.please_enter_currency_name') }],
  code: [{ required: true, message: t('account.please_enter_currency_code') }],
  exchange_rate: [{ required: true, message: t('account.please_enter_exchange_rate') }],
  symbol: [{ required: true, message: t('account.please_enter_symbol') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('account.add_currency');
  } else if (type === 'edit') {
    return t('account.edit_currency');
  } else {
    return t('account.currency_detail');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      if (newData.type === 'edit' && newData.id) {
        await loadFormData(newData.id);
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
    const response = await getCurrencyDetailApi(id);
    const data = response.data;

    formData.value = {
      ...formData.value,
      name: data.name,
      code: data.code,
      exchange_rate: data.exchange_rate,
      symbol: data.symbol,
      decimal_places: data.decimal_places || 2,
      is_default: data.is_default || false,
    };
  } catch (error) {
    console.error('加载货币详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    name: '',
    code: '',
    exchange_rate: 1,
    symbol: '',
    decimal_places: 2,
    is_default: false,
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
      await createCurrencyApi(submitData);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateCurrencyApi({
        ...submitData,
        currency_id: drawerData.value.id,
      });
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
