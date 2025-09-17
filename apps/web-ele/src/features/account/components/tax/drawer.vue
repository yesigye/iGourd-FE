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
        <!-- 税务名称 -->
        <FormItem
          name="name"
          :label="t('account.taxName')"
          :rules="[{ required: true, message: t('account.please_enter_tax_name') }]"
        >
          <Input
            v-model:value="formData.name"
            :placeholder="t('account.please_enter_tax_name')"
          />
        </FormItem>

        <!-- 税务类型 -->
        <FormItem
          name="tax_type"
          :label="t('account.taxType')"
          :rules="[{ required: true, message: t('account.please_select_tax_type') }]"
        >
          <Select
            v-model:value="formData.tax_type"
            :placeholder="t('account.please_select_tax_type')"
            :options="taxTypeOptions"
          />
        </FormItem>

        <!-- 计算类型 -->
        <FormItem
          name="calculation_type"
          :label="t('account.calculationType')"
          :rules="[{ required: true, message: t('account.please_select_calculation_type') }]"
        >
          <Select
            v-model:value="formData.calculation_type"
            :placeholder="t('account.please_select_calculation_type')"
            :options="calculationTypeOptions"
            @change="handleCalculationTypeChange"
          />
        </FormItem>

        <!-- 百分比 -->
        <FormItem
          v-if="formData.calculation_type === 'PERCENTAGE'"
          name="percentage"
          :label="t('account.percentage')"
          :rules="[{ required: true, message: t('account.please_enter_percentage') }]"
        >
          <InputNumber
            v-model:value="formData.percentage"
            :placeholder="t('account.please_enter_percentage')"
            :precision="2"
            :min="0"
            :max="100"
            style="width: 100%"
          />
        </FormItem>

        <!-- 固定金额 -->
        <FormItem
          v-if="formData.calculation_type === 'FIXED_AMOUNT'"
          name="tax_amount"
          :label="t('account.taxAmount')"
          :rules="[{ required: true, message: t('account.please_enter_tax_amount') }]"
        >
          <InputNumber
            v-model:value="formData.tax_amount"
            :placeholder="t('account.please_enter_tax_amount')"
            :precision="2"
            :min="0"
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
  Select,
  InputNumber,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  TaxForm,
  TaxType,
  CalculationType,
} from '@@/account/types';

import {
  createTaxApi,
  updateTaxApi,
  getTaxDetailApi,
} from '@@/account/apis';

defineOptions({
  name: 'TaxDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 表单数据
const formData = ref<TaxForm>({
  name: '',
  tax_type: 'VAT' as TaxType,
  calculation_type: 'PERCENTAGE' as CalculationType,
  percentage: 0,
  tax_amount: 0,
  merchant_id: userStore.merchantId,
});

// 税务类型选项
const taxTypeOptions = computed(() => [
  { label: t('account.vat'), value: 'VAT' },
  { label: t('account.income_tax'), value: 'INCOME_TAX' },
  { label: t('account.business_tax'), value: 'BUSINESS_TAX' },
  { label: t('account.customs_duty'), value: 'CUSTOMS_DUTY' },
]);

// 计算类型选项
const calculationTypeOptions = computed(() => [
  { label: t('account.percentage'), value: 'PERCENTAGE' },
  { label: t('account.fixed_amount'), value: 'FIXED_AMOUNT' },
]);

// 表单规则
const formRules = computed(() => ({
  name: [{ required: true, message: t('account.please_enter_tax_name') }],
  tax_type: [{ required: true, message: t('account.please_select_tax_type') }],
  calculation_type: [{ required: true, message: t('account.please_select_calculation_type') }],
  percentage: formData.value.calculation_type === 'PERCENTAGE'
    ? [{ required: true, message: t('account.please_enter_percentage') }]
    : [],
  tax_amount: formData.value.calculation_type === 'FIXED_AMOUNT'
    ? [{ required: true, message: t('account.please_enter_tax_amount') }]
    : [],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('account.addTax');
  } else if (type === 'edit') {
    return t('account.editTax');
  } else {
    return t('account.taxDetail');
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
    const response = await getTaxDetailApi({
      tax_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      name: data.name,
      tax_type: data.tax_type,
      calculation_type: data.calculation_type,
      percentage: data.percentage || 0,
      tax_amount: data.tax_amount || 0,
    };
  } catch (error) {
    console.error('加载税务详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    name: '',
    tax_type: 'VAT' as TaxType,
    calculation_type: 'PERCENTAGE' as CalculationType,
    percentage: 0,
    tax_amount: 0,
    merchant_id: userStore.merchantId,
  };
};

// 处理计算类型变化
const handleCalculationTypeChange = (value: CalculationType) => {
  // 清空相关字段
  if (value === 'PERCENTAGE') {
    formData.value.tax_amount = 0;
  } else {
    formData.value.percentage = 0;
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
      await createTaxApi(submitData);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateTaxApi({
        ...submitData,
        tax_id: drawerData.value.id,
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
