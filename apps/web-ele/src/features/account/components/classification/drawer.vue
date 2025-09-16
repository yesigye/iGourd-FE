<script setup lang="ts">
import type {
  FinanceCategoryDrawer,
  FinanceCategoryPayload,
} from '@@/account/types';

import { computed, ref, watch } from 'vue';

import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Space,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createFinanceCategoryApi,
  getFinanceCategoryDetailApi,
  updateFinanceCategoryApi,
} from '@@/account/apis';

defineOptions({
  name: 'ClassificationDrawer',
});

const emit = defineEmits<{
  success: [];
}>();
const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const ledgerOptions = ref([]);

// 表单数据
const formData = ref<FinanceCategoryPayload>({
  name: '',
  type: '',
  ledger_names: [],
  target_ledger_name: '',
  remark: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  name: [
    { required: true, message: t('account.please_enter_classification_name') },
  ],
  type: [{ required: true, message: t('account.please_select_type') }],
  ledger_names: [
    { required: true, message: t('account.please_select_debit_ledger') },
  ],
  target_ledger_name: [
    { required: true, message: t('account.please_select_credit_ledger') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('account.add_classification');
  } else if (type === 'edit') {
    return t('account.edit_classification');
  } else {
    return t('account.classification_detail');
  }
});

// 抽屉数据
const drawerData = ref<FinanceCategoryDrawer | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadLedgerOptions();

      if (newData.type === 'edit' && newData.id) {
        await loadFormData(newData.id);
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true },
);

// 加载科目选项
const loadLedgerOptions = async () => {
  try {
    // 这里应该调用获取科目列表的 API
    // 暂时使用空数组
    ledgerOptions.value = [];
  } catch (error) {
    console.error('加载科目选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: string) => {
  try {
    const response = await getFinanceCategoryDetailApi({ id });
    const data = response.data;

    formData.value = {
      ...formData.value,
      name: data.name,
      type: data.type,
      ledger_names: data.ledger_names || [],
      target_ledger_name: data.target_ledger_name,
      remark: data.remark,
    };
  } catch (error) {
    console.error('加载财务分类详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    name: '',
    type: '',
    ledger_names: [],
    target_ledger_name: '',
    remark: '',
    merchant_id: userStore.merchantId,
  };
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    if (drawerData.value?.type === 'add') {
      await createFinanceCategoryApi(formData.value);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateFinanceCategoryApi({
        ...formData.value,
        id: drawerData.value.id,
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
const setDrawerData = (data: FinanceCategoryDrawer) => {
  drawerData.value = data;
};

// 暴露方法
defineExpose({
  setDrawerData,
});
</script>

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
        <!-- 分类名称 -->
        <FormItem
          name="name"
          :label="t('account.classification_name')"
          :rules="[
            {
              required: true,
              message: t('account.please_enter_classification_name'),
            },
          ]"
        >
          <Input
            v-model:value="formData.name"
            :placeholder="t('account.please_enter_classification_name')"
          />
        </FormItem>

        <!-- 收支类型 -->
        <FormItem
          name="type"
          :label="t('account.revenue_and_expenditure')"
          :rules="[
            { required: true, message: t('account.please_select_type') },
          ]"
        >
          <Select
            v-model:value="formData.type"
            :placeholder="t('account.please_select_type')"
          >
            <SelectOption value="REVENUE">
              {{ t('account.revenue') }}
            </SelectOption>
            <SelectOption value="EXPENSE">
              {{ t('account.expense') }}
            </SelectOption>
          </Select>
        </FormItem>

        <!-- 借方科目 -->
        <FormItem
          name="ledger_names"
          :label="t('account.classification_form.debit')"
          :rules="[
            {
              required: true,
              message: t('account.please_select_debit_ledger'),
            },
          ]"
        >
          <Select
            v-model:value="formData.ledger_names"
            :placeholder="t('account.please_select_debit_ledger')"
            mode="multiple"
            :options="ledgerOptions"
          />
        </FormItem>

        <!-- 贷方科目 -->
        <FormItem
          name="target_ledger_name"
          :label="t('account.classification_form.credit')"
          :rules="[
            {
              required: true,
              message: t('account.please_select_credit_ledger'),
            },
          ]"
        >
          <Select
            v-model:value="formData.target_ledger_name"
            :placeholder="t('account.please_select_credit_ledger')"
            :options="ledgerOptions"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem name="remark" :label="t('account.remark')">
          <Input.Textarea
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
