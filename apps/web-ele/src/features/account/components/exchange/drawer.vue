<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="drawerTitle"
    :width="800"
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
        <!-- 卖出货币 -->
        <FormItem
          name="sell_currency_id"
          :label="t('account.sellCurrency')"
          :rules="[
            {
              required: true,
              message: t('account.please_select_sell_currency'),
            },
          ]"
        >
          <Select
            v-model:value="formData.sell_currency_id"
            :placeholder="t('account.please_select_sell_currency')"
            :options="currencyOptions"
            @change="handleSellCurrencyChange"
          />
        </FormItem>

        <!-- 买入货币 -->
        <FormItem
          name="buy_currency_id"
          :label="t('account.buyCurrency')"
          :rules="[
            {
              required: true,
              message: t('account.please_select_buy_currency'),
            },
          ]"
        >
          <Select
            v-model:value="formData.buy_currency_id"
            :placeholder="t('account.please_select_buy_currency')"
            :options="currencyOptions"
            @change="handleBuyCurrencyChange"
          />
        </FormItem>

        <!-- 卖出金额 -->
        <FormItem
          name="sell_amount"
          :label="t('account.sellAmount')"
          :rules="[
            { required: true, message: t('account.please_enter_sell_amount') },
          ]"
        >
          <InputNumber
            v-model:value="formData.sell_amount"
            :placeholder="t('account.please_enter_sell_amount')"
            :precision="2"
            :min="0"
            style="width: 100%"
            @change="calculateBuyAmount"
          />
        </FormItem>

        <!-- 买入金额 -->
        <FormItem
          name="buy_amount"
          :label="t('account.buyAmount')"
          :rules="[
            { required: true, message: t('account.please_enter_buy_amount') },
          ]"
        >
          <InputNumber
            v-model:value="formData.buy_amount"
            :placeholder="t('account.please_enter_buy_amount')"
            :precision="2"
            :min="0"
            style="width: 100%"
            @change="calculateSellAmount"
          />
        </FormItem>

        <!-- 汇率 -->
        <FormItem
          name="exchange_rate"
          :label="t('account.exchangeRate')"
          :rules="[
            {
              required: true,
              message: t('account.please_enter_exchange_rate'),
            },
          ]"
        >
          <InputNumber
            v-model:value="formData.exchange_rate"
            :placeholder="t('account.please_enter_exchange_rate')"
            :precision="4"
            :min="0"
            style="width: 100%"
            @change="calculateBuyAmount"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem name="remark" :label="t('account.remark')">
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('account.please_enter_remark')"
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
import { useIgourdDrawer } from '@igourd/common-ui';
import {
  Form,
  FormItem,
  Select,
  InputNumber,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type { CurrencyExchangeForm } from '@@/account/types';

import {
  createCurrencyExchangeApi,
  updateCurrencyExchangeApi,
  getCurrencyExchangeDetailApi,
} from '@@/account/apis';

defineOptions({
  name: 'ExchangeDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const currencyOptions = ref([]);

// 表单数据
const formData = ref<CurrencyExchangeForm>({
  sell_currency_id: 0,
  buy_currency_id: 0,
  sell_amount: 0,
  buy_amount: 0,
  exchange_rate: 1,
  remark: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  sell_currency_id: [
    { required: true, message: t('account.please_select_sell_currency') },
  ],
  buy_currency_id: [
    { required: true, message: t('account.please_select_buy_currency') },
  ],
  sell_amount: [
    { required: true, message: t('account.please_enter_sell_amount') },
  ],
  buy_amount: [
    { required: true, message: t('account.please_enter_buy_amount') },
  ],
  exchange_rate: [
    { required: true, message: t('account.please_enter_exchange_rate') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('account.addCurrencyExchange');
  } else if (type === 'edit') {
    return t('account.editCurrencyExchange');
  } else {
    return t('account.currencyExchangeDetail');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadCurrencyOptions();

      if (newData.type === 'edit' && newData.id) {
        await loadFormData(newData.id);
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true },
);

// 加载货币选项
const loadCurrencyOptions = async () => {
  try {
    // 这里应该调用获取货币列表的 API
    // 暂时使用空数组
    currencyOptions.value = [];
  } catch (error) {
    console.error('加载货币选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getCurrencyExchangeDetailApi({
      currency_exchange_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      sell_currency_id: data.sell_currency_id,
      buy_currency_id: data.buy_currency_id,
      sell_amount: data.sell_amount,
      buy_amount: data.buy_amount,
      exchange_rate: data.exchange_rate,
      remark: data.remark,
    };
  } catch (error) {
    console.error('加载货币兑换详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    sell_currency_id: 0,
    buy_currency_id: 0,
    sell_amount: 0,
    buy_amount: 0,
    exchange_rate: 1,
    remark: '',
    merchant_id: userStore.merchantId,
  };
};

// 处理卖出货币变化
const handleSellCurrencyChange = (currencyId: number) => {
  // 根据卖出货币更新汇率
  console.log('卖出货币变化:', currencyId);
};

// 处理买入货币变化
const handleBuyCurrencyChange = (currencyId: number) => {
  // 根据买入货币更新汇率
  console.log('买入货币变化:', currencyId);
};

// 计算买入金额
const calculateBuyAmount = () => {
  if (formData.value.sell_amount && formData.value.exchange_rate) {
    formData.value.buy_amount =
      formData.value.sell_amount * formData.value.exchange_rate;
  }
};

// 计算卖出金额
const calculateSellAmount = () => {
  if (formData.value.buy_amount && formData.value.exchange_rate) {
    formData.value.sell_amount =
      formData.value.buy_amount / formData.value.exchange_rate;
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
      await createCurrencyExchangeApi(submitData);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateCurrencyExchangeApi({
        ...submitData,
        currency_exchange_id: drawerData.value.id,
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
