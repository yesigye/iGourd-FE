<script setup lang="ts">
import type {
  CollectionVoucherDrawerType,
  CollectionVoucherForm,
} from '@@/account/types';

import { computed, ref, watch } from 'vue';

import {
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Space,
  Textarea,
  Upload,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createReceiptOrderApi,
  getReceiptOrderDetailApi,
  modifyReceiptOrderApi,
} from '@@/account/apis';
import { UploadOutlined } from '@igourd/icons';

defineOptions({
  name: 'CollectionVoucherDrawer',
});

const emit = defineEmits<{
  success: [];
}>();
const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const customerOptions = ref([]);

// 表单数据
const formData = ref<CollectionVoucherForm>({
  customer_id: 0,
  payer_name: '',
  receipt_time: '',
  receivable_balance: '0',
  last_debt: '0',
  formilySelectSourceOrder: {},
  remark: '',
  attachment_url: [],
});

// 表单规则
const formRules = computed(() => ({
  customer_id: [
    { required: true, message: t('account.please_select_customer') },
  ],
  payer_name: [
    { required: true, message: t('account.please_enter_payer_name') },
  ],
  receipt_time: [
    { required: true, message: t('account.please_select_receipt_time') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('account.add_collection_voucher');
  } else if (type === 'edit') {
    return t('account.edit_collection_voucher');
  } else {
    return t('account.collection_voucher_detail');
  }
});

// 抽屉数据
const drawerData = ref<CollectionVoucherDrawerType | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadCustomerOptions();

      if (newData.type === 'edit' && newData.id) {
        await loadFormData(newData.id);
      } else {
        resetFormData();
      }
    }
  },
  { immediate: true },
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

// 加载表单数据
const loadFormData = async (id: string) => {
  try {
    const response = await getReceiptOrderDetailApi({
      receipt_order_id: Number.parseInt(id),
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      receipt_order_no: data.receipt_order_no,
      customer_id: data.customer_id,
      payer_name: data.payer_name,
      receipt_time: data.receipt_time,
      receivable_balance: data.receivable_balance || '0',
      last_debt: data.last_debt || '0',
      remark: data.remark,
      attachment_url: data.attachment_url || [],
    };
  } catch (error) {
    console.error('加载收款单详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    customer_id: 0,
    payer_name: '',
    receipt_time: '',
    receivable_balance: '0',
    last_debt: '0',
    formilySelectSourceOrder: {},
    remark: '',
    attachment_url: [],
  };
};

// 处理客户变化
const handleCustomerChange = (customerId: number) => {
  // 根据客户ID加载相关信息
  console.log('客户变化:', customerId);
};

// 文件上传前处理
const beforeUpload = (file: File) => {
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    console.error('文件大小不能超过 10MB!');
    return false;
  }
  return true;
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
      await createReceiptOrderApi(submitData);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await modifyReceiptOrderApi({
        ...submitData,
        receipt_order_id: Number.parseInt(drawerData.value.id),
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
const setDrawerData = (data: CollectionVoucherDrawerType) => {
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
    :width="1200"
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
        <!-- 收款单号 -->
        <FormItem
          name="receipt_order_no"
          :label="t('account.receipt_order_no')"
        >
          <Input
            v-model:value="formData.receipt_order_no"
            :placeholder="t('account.please_enter_receipt_order_no')"
            :disabled="drawerData?.type === 'edit'"
          />
        </FormItem>

        <!-- 客户 -->
        <FormItem
          name="customer_id"
          :label="t('account.customer')"
          :rules="[
            { required: true, message: t('account.please_select_customer') },
          ]"
        >
          <Select
            v-model:value="formData.customer_id"
            :placeholder="t('account.please_select_customer')"
            :options="customerOptions"
            @change="handleCustomerChange"
          />
        </FormItem>

        <!-- 付款人姓名 -->
        <FormItem
          name="payer_name"
          :label="t('account.payer_name')"
          :rules="[
            { required: true, message: t('account.please_enter_payer_name') },
          ]"
        >
          <Input
            v-model:value="formData.payer_name"
            :placeholder="t('account.please_enter_payer_name')"
          />
        </FormItem>

        <!-- 收款时间 -->
        <FormItem
          name="receipt_time"
          :label="t('account.receipt_time')"
          :rules="[
            {
              required: true,
              message: t('account.please_select_receipt_time'),
            },
          ]"
        >
          <DatePicker
            v-model:value="formData.receipt_time"
            :placeholder="t('account.please_select_receipt_time')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 应收余额 -->
        <FormItem
          name="receivable_balance"
          :label="t('account.receivable_balance')"
        >
          <InputNumber
            v-model:value="formData.receivable_balance"
            :placeholder="t('account.please_enter_receivable_balance')"
            :precision="2"
            style="width: 100%"
          />
        </FormItem>

        <!-- 最后欠款 -->
        <FormItem name="last_debt" :label="t('account.last_debt')">
          <InputNumber
            v-model:value="formData.last_debt"
            :placeholder="t('account.please_enter_last_debt')"
            :precision="2"
            style="width: 100%"
          />
        </FormItem>

        <!-- 关联订单 -->
        <FormItem
          name="formilySelectSourceOrder"
          :label="t('account.related_orders')"
        >
          <div class="w-full">
            <!-- 这里应该实现订单选择组件 -->
            <div class="text-gray-500">
              {{ t('account.please_select_related_orders') }}
            </div>
          </div>
        </FormItem>

        <!-- 备注 -->
        <FormItem name="remark" :label="t('account.remark')">
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('account.please_enter_remark')"
            :rows="4"
          />
        </FormItem>

        <!-- 附件 -->
        <FormItem name="attachment_url" :label="t('account.attachments')">
          <Upload
            v-model:file-list="formData.attachment_url"
            :max-count="5"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            :before-upload="beforeUpload"
          >
            <Button type="dashed">
              <UploadOutlined />
              {{ t('account.upload_attachment') }}
            </Button>
          </Upload>
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
