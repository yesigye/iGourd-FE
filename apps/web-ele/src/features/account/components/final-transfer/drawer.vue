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
        <!-- 结转期间 -->
        <FormItem
          name="period_id"
          :label="t('account.transfer_period')"
          :rules="[{ required: true, message: t('account.please_select_transfer_period') }]"
        >
          <Select
            v-model:value="formData.period_id"
            :placeholder="t('account.please_select_transfer_period')"
            :options="periodOptions"
            :disabled="drawerData?.type === 'edit'"
          />
        </FormItem>

        <!-- 结转日期 -->
        <FormItem
          name="transfer_date"
          :label="t('account.transfer_date')"
          :rules="[{ required: true, message: t('account.please_select_transfer_date') }]"
        >
          <DatePicker
            v-model:value="formData.transfer_date"
            :placeholder="t('account.please_select_transfer_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem
          name="remark"
          :label="t('account.remark')"
        >
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
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import {
  Form,
  FormItem,
  Select,
  DatePicker,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  FinalTransferForm,
} from '@@/account/types';

import {
  executeFinalTransferApi,
  reverseFinalTransferApi,
} from '@@/account/apis';

defineOptions({
  name: 'FinalTransferDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const periodOptions = ref([]);

// 表单数据
const formData = ref<FinalTransferForm>({
  period_id: 0,
  transfer_date: '',
  remark: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  period_id: [{ required: true, message: t('account.please_select_transfer_period') }],
  transfer_date: [{ required: true, message: t('account.please_select_transfer_date') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'execute') {
    return t('account.execute_transfer');
  } else if (type === 'reverse') {
    return t('account.reverse_transfer');
  } else {
    return t('account.transfer_detail');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; periodId?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadPeriodOptions();

      if (newData.type === 'reverse' && newData.periodId) {
        await loadFormData(newData.periodId);
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true }
);

// 加载期间选项
const loadPeriodOptions = async () => {
  try {
    // 这里应该调用获取期间列表的 API
    // 暂时使用空数组
    periodOptions.value = [];
  } catch (error) {
    console.error('加载期间选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (periodId: number) => {
  try {
    // 这里应该调用获取结转详情的 API
    formData.value = {
      ...formData.value,
      period_id: periodId,
      transfer_date: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('加载结转详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    period_id: 0,
    transfer_date: new Date().toISOString().split('T')[0],
    remark: '',
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

    if (drawerData.value?.type === 'execute') {
      await executeFinalTransferApi(submitData);
    } else if (drawerData.value?.type === 'reverse' && drawerData.value?.periodId) {
      await reverseFinalTransferApi({
        transfer_id: drawerData.value.periodId,
        merchant_id: userStore.merchantId,
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
const setDrawerData = (data: { type: string; periodId?: number }) => {
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
