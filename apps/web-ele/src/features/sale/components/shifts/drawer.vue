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
        <!-- 员工选择 -->
        <FormItem
          name="staff_id"
          :label="t('sale.staffName')"
          :rules="[{ required: true, message: t('sale.please_select_staff') }]"
        >
          <Select
            v-model:value="formData.staff_id"
            :placeholder="t('sale.please_select_staff')"
            :options="staffOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 班次类型 -->
        <FormItem
          name="shift_type"
          :label="t('sale.shiftType')"
          :rules="[{ required: true, message: t('sale.please_select_shift_type') }]"
        >
          <Select
            v-model:value="formData.shift_type"
            :placeholder="t('sale.please_select_shift_type')"
            :options="shiftTypeOptions"
          />
        </FormItem>

        <!-- 开始时间 -->
        <FormItem
          name="start_time"
          :label="t('sale.startTime')"
          :rules="[{ required: true, message: t('sale.please_select_start_time') }]"
        >
          <DatePicker
            v-model:value="formData.start_time"
            :placeholder="t('sale.please_select_start_time')"
            show-time
            style="width: 100%"
          />
        </FormItem>

        <!-- 结束时间 -->
        <FormItem
          name="end_time"
          :label="t('sale.endTime')"
        >
          <DatePicker
            v-model:value="formData.end_time"
            :placeholder="t('sale.please_select_end_time')"
            show-time
            style="width: 100%"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem
          name="remark"
          :label="t('sale.remark')"
        >
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('sale.please_enter_remark')"
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
  Select,
  DatePicker,
  Textarea,
  Button,
  Space,
} from '@igourd/common-ui';

import type {
  SaleShiftsCreateVO,
  SaleShiftsModifyVO,
  ShiftType,
} from '@@/sale/types';

import {
  createSaleShiftsApi,
  updateSaleShiftsApi,
  getSaleShiftsDetailApi,
} from '@@/sale/apis';

defineOptions({
  name: 'SaleShiftsDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const staffOptions = ref([]);

// 班次类型选项
const shiftTypeOptions = [
  { label: t('sale.shiftType.morning'), value: 'MORNING' },
  { label: t('sale.shiftType.afternoon'), value: 'AFTERNOON' },
  { label: t('sale.shiftType.evening'), value: 'EVENING' },
  { label: t('sale.shiftType.night'), value: 'NIGHT' },
];

// 表单数据
const formData = ref<SaleShiftsCreateVO | SaleShiftsModifyVO>({
  staff_id: 0,
  shift_type: 'MORNING',
  start_time: '',
  end_time: '',
  remark: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  staff_id: [{ required: true, message: t('sale.please_select_staff') }],
  shift_type: [{ required: true, message: t('sale.please_select_shift_type') }],
  start_time: [{ required: true, message: t('sale.please_select_start_time') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('sale.addSaleShifts');
  } else if (type === 'edit') {
    return t('sale.editSaleShifts');
  } else if (type === 'detail') {
    return t('sale.saleShiftsDetail');
  } else {
    return t('sale.saleShifts');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadStaffOptions();

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

// 加载员工选项
const loadStaffOptions = async () => {
  try {
    // 这里应该调用获取员工列表的 API
    // 暂时使用空数组
    staffOptions.value = [];
  } catch (error) {
    console.error('加载员工选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getSaleShiftsDetailApi({
      shift_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      staff_id: data.staff_id,
      shift_type: data.shift_type,
      start_time: data.start_time,
      end_time: data.end_time,
      remark: data.remark,
    };
  } catch (error) {
    console.error('加载班次管理详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    staff_id: 0,
    shift_type: 'MORNING',
    start_time: '',
    end_time: '',
    remark: '',
    merchant_id: userStore.merchantId,
  };
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
      await createSaleShiftsApi(submitData as SaleShiftsCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateSaleShiftsApi({
        ...submitData,
        shift_id: drawerData.value.id,
      } as SaleShiftsModifyVO);
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
