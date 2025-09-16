<script setup lang="ts">
import type {
  CreateAccountLedgerFormData,
  LedgerTransferData,
} from '@@/account/types';

import { computed, ref, watch } from 'vue';

import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  SelectOption,
  Space,
  Switch,
  TreeSelect,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createAccountLedgerApi,
  getAccountLedgerDetailApi,
  getLeafLedgersApi,
  modifyAccountLedgerApi,
} from '@@/account/apis';

defineOptions({
  name: 'ChartOfAccountsDrawer',
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
const parentLedgerOptions = ref([]);

// 表单数据
const formData = ref<CreateAccountLedgerFormData>({
  ledgerType: 'ledger',
  code: '',
  name: '',
  category: '',
  balance_direction: '',
  initial_balance: 0,
  is_enabled: true,
  parent_id: '',
  merchant_id: userStore.merchantId,
  features_type: {
    quantityAccounting: false,
  },
});

// 表单规则
const formRules = computed(() => ({
  code: [{ required: true, message: t('account.please_enter_account_code') }],
  name: [{ required: true, message: t('account.please_enter_account_name') }],
  category: [{ required: true, message: t('account.please_select_category') }],
  balance_direction: [
    { required: true, message: t('account.please_select_balance_direction') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;
  const ledgerType = drawerData.value?.ledgerType;

  if (type === 'add') {
    return ledgerType === 'ledger'
      ? t('account.add_account_ledger')
      : t('account.add_sub_ledger');
  } else if (type === 'edit') {
    return ledgerType === 'ledger'
      ? t('account.edit_account_ledger')
      : t('account.edit_sub_ledger');
  } else {
    return ledgerType === 'ledger'
      ? t('account.account_ledger_detail')
      : t('account.sub_ledger_detail');
  }
});

// 抽屉数据
const drawerData = ref<LedgerTransferData | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadParentLedgerOptions();

      if (newData.type === 'edit' && newData.row) {
        await loadFormData(newData.row);
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true },
);

// 加载父级科目选项
const loadParentLedgerOptions = async () => {
  try {
    const response = await getLeafLedgersApi({
      account_set_id: userStore.merchantInfo.account_set_id,
      merchant_id: userStore.merchantId,
    });
    parentLedgerOptions.value = response.data || [];
  } catch (error) {
    console.error('加载父级科目失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (row: any) => {
  try {
    const response = await getAccountLedgerDetailApi(row.id);
    const data = response.data;

    formData.value = {
      ...formData.value,
      code: data.code,
      name: data.name,
      category: data.category,
      balance_direction: data.balance_direction,
      initial_balance: data.initial_balance || 0,
      is_enabled: data.is_enabled,
      parent_id: data.parent_id || '',
    };
  } catch (error) {
    console.error('加载科目详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    ledgerType: drawerData.value?.ledgerType || 'ledger',
    code: '',
    name: '',
    category: '',
    balance_direction: '',
    initial_balance: 0,
    is_enabled: true,
    parent_id: '',
    merchant_id: userStore.merchantId,
    features_type: {
      quantityAccounting: false,
    },
  };
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const submitData = {
      ...formData.value,
      category: formData.value.category,
      balance_direction: formData.value.balance_direction,
    };

    if (drawerData.value?.type === 'add') {
      await createAccountLedgerApi(submitData);
    } else if (drawerData.value?.type === 'edit') {
      await modifyAccountLedgerApi({
        ...submitData,
        account_ledger_id: drawerData.value.row?.id,
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
  close();
};

// 成功回调
const handleSuccess = () => {
  close();
  emit('success');
};

// 设置抽屉数据
const setDrawerData = (data: LedgerTransferData) => {
  drawerData.value = data;
};

// 暴露方法
defineExpose({
  setDrawerData,
});
</script>

<template>
  <BasicDrawer v-bind="$attrs" :title="drawerTitle" @success="handleSuccess">
    <div class="p-4">
      <Form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- 科目类型选择 -->
        <FormItem
          v-if="drawerData?.type === 'add'"
          name="ledgerType"
          :label="t('account.ledger_type')"
        >
          <RadioGroup v-model:value="formData.ledgerType">
            <Radio value="ledger">{{ t('account.account_ledger') }}</Radio>
            <Radio value="subLedger">{{ t('account.sub_ledger') }}</Radio>
          </RadioGroup>
        </FormItem>

        <!-- 科目代码 -->
        <FormItem
          name="code"
          :label="t('account.account_code')"
          :rules="[
            { required: true, message: t('account.please_enter_account_code') },
          ]"
        >
          <Input
            v-model:value="formData.code"
            :placeholder="t('account.please_enter_account_code')"
            :disabled="drawerData?.type === 'edit'"
          />
        </FormItem>

        <!-- 科目名称 -->
        <FormItem
          name="name"
          :label="t('account.account_name')"
          :rules="[
            { required: true, message: t('account.please_enter_account_name') },
          ]"
        >
          <Input
            v-model:value="formData.name"
            :placeholder="t('account.please_enter_account_name')"
          />
        </FormItem>

        <!-- 科目类别 -->
        <FormItem
          name="category"
          :label="t('account.category')"
          :rules="[
            { required: true, message: t('account.please_select_category') },
          ]"
        >
          <Select
            v-model:value="formData.category"
            :placeholder="t('account.please_select_category')"
          >
            <SelectOption value="ASSET">{{ t('account.asset') }}</SelectOption>
            <SelectOption value="LIABILITY">
              {{ t('account.liability') }}
            </SelectOption>
            <SelectOption value="EQUITY">
              {{ t('account.equity') }}
            </SelectOption>
            <SelectOption value="REVENUE">
              {{ t('account.revenue') }}
            </SelectOption>
            <SelectOption value="EXPENSE">
              {{ t('account.expense') }}
            </SelectOption>
          </Select>
        </FormItem>

        <!-- 余额方向 -->
        <FormItem
          name="balance_direction"
          :label="t('account.balance_direction')"
          :rules="[
            {
              required: true,
              message: t('account.please_select_balance_direction'),
            },
          ]"
        >
          <Select
            v-model:value="formData.balance_direction"
            :placeholder="t('account.please_select_balance_direction')"
          >
            <SelectOption value="DEBIT">{{ t('account.debit') }}</SelectOption>
            <SelectOption value="CREDIT">
              {{ t('account.credit') }}
            </SelectOption>
          </Select>
        </FormItem>

        <!-- 期初余额 -->
        <FormItem name="initial_balance" :label="t('account.opening_balance')">
          <InputNumber
            v-model:value="formData.initial_balance"
            :placeholder="t('account.please_enter_opening_balance')"
            :precision="2"
            style="width: 100%"
          />
        </FormItem>

        <!-- 是否启用 -->
        <FormItem name="is_enabled" :label="t('account.is_enabled')">
          <Switch v-model:checked="formData.is_enabled" />
        </FormItem>

        <!-- 父级科目 -->
        <FormItem
          v-if="formData.ledgerType === 'subLedger'"
          name="parent_id"
          :label="t('account.parent_ledger')"
        >
          <TreeSelect
            v-model:value="formData.parent_id"
            :placeholder="t('account.please_select_parent_ledger')"
            :tree-data="parentLedgerOptions"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
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
