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
        <!-- 原订单选择 -->
        <FormItem
          name="original_order_id"
          :label="t('sale.originalOrderNo')"
          :rules="[{ required: true, message: t('sale.please_select_original_order') }]"
        >
          <Select
            v-model:value="formData.original_order_id"
            :placeholder="t('sale.please_select_original_order')"
            :options="orderOptions"
            show-search
            :filter-option="filterOption"
            @change="handleOrderChange"
          />
        </FormItem>

        <!-- 客户选择 -->
        <FormItem
          name="customer_id"
          :label="t('sale.customerName')"
          :rules="[{ required: true, message: t('sale.please_select_customer') }]"
        >
          <Select
            v-model:value="formData.customer_id"
            :placeholder="t('sale.please_select_customer')"
            :options="customerOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

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

        <!-- 退款金额 -->
        <FormItem
          name="refund_amount"
          :label="t('sale.refundAmount')"
          :rules="[{ required: true, message: t('sale.please_enter_refund_amount') }]"
        >
          <InputNumber
            v-model:value="formData.refund_amount"
            :min="0"
            :precision="2"
            style="width: 100%"
            :placeholder="t('sale.please_enter_refund_amount')"
          />
        </FormItem>

        <!-- 退款方式 -->
        <FormItem
          name="refund_method"
          :label="t('sale.refundMethod')"
          :rules="[{ required: true, message: t('sale.please_select_refund_method') }]"
        >
          <Select
            v-model:value="formData.refund_method"
            :placeholder="t('sale.please_select_refund_method')"
            :options="refundMethodOptions"
          />
        </FormItem>

        <!-- 退款原因 -->
        <FormItem
          name="refund_reason"
          :label="t('sale.refundReason')"
          :rules="[{ required: true, message: t('sale.please_enter_refund_reason') }]"
        >
          <Textarea
            v-model:value="formData.refund_reason"
            :placeholder="t('sale.please_enter_refund_reason')"
            :rows="3"
          />
        </FormItem>

        <!-- 退款日期 -->
        <FormItem
          name="refund_date"
          :label="t('sale.refundDate')"
          :rules="[{ required: true, message: t('sale.please_select_refund_date') }]"
        >
          <DatePicker
            v-model:value="formData.refund_date"
            :placeholder="t('sale.please_select_refund_date')"
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
            :rows="2"
          />
        </FormItem>
      </Form>

      <!-- 产品列表 -->
      <div v-if="drawerData?.type !== 'detail'" class="mt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">{{ t('sale.products') }}</h3>
          <Button type="primary" @click="handleAddProduct">
            {{ t('sale.addProduct') }}
          </Button>
        </div>

        <Table
          :data-source="formData.products"
          :columns="productColumns"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'product_name'">
              <Select
                v-model:value="record.product_id"
                :placeholder="t('sale.please_select_product')"
                :options="productOptions"
                show-search
                :filter-option="filterOption"
                @change="(value) => handleProductChange(value, index)"
              />
            </template>
            <template v-else-if="column.key === 'quantity'">
              <InputNumber
                v-model:value="record.quantity"
                :min="1"
                :precision="0"
                style="width: 100%"
                @change="calculateTotalPrice(index)"
              />
            </template>
            <template v-else-if="column.key === 'unit_price'">
              <InputNumber
                v-model:value="record.unit_price"
                :min="0"
                :precision="2"
                style="width: 100%"
                @change="calculateTotalPrice(index)"
              />
            </template>
            <template v-else-if="column.key === 'total_price'">
              <span>{{ record.quantity * record.unit_price }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <Button type="link" danger @click="handleRemoveProduct(index)">
                {{ t('common.delete') }}
              </Button>
            </template>
          </template>
        </Table>
      </div>

      <!-- 详情显示 -->
      <div v-else class="mt-6">
        <h3 class="text-lg font-medium mb-4">{{ t('sale.products') }}</h3>
        <Table
          :data-source="formData.products"
          :columns="productDetailColumns"
          :pagination="false"
          size="small"
        />
      </div>
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
  Table,
  InputNumber,
} from '@igourd/common-ui';

import type {
  SaleRefundOrderCreateVO,
  SaleRefundOrderModifyVO,
  RefundMethod,
  RefundOrderProductVO,
} from '@@/sale/types';

import {
  createSaleRefundOrderApi,
  updateSaleRefundOrderApi,
  getSaleRefundOrderDetailApi,
} from '@@/sale/apis';

defineOptions({
  name: 'SaleRefundOrderDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const orderOptions = ref([]);
const customerOptions = ref([]);
const staffOptions = ref([]);
const productOptions = ref([]);

// 退款方式选项
const refundMethodOptions = [
  { label: t('sale.refundMethod.cash'), value: 'CASH' },
  { label: t('sale.refundMethod.card'), value: 'CARD' },
  { label: t('sale.refundMethod.transfer'), value: 'TRANSFER' },
  { label: t('sale.refundMethod.credit'), value: 'CREDIT' },
];

// 表单数据
const formData = ref<SaleRefundOrderCreateVO | SaleRefundOrderModifyVO>({
  original_order_id: 0,
  customer_id: 0,
  staff_id: 0,
  refund_amount: 0,
  refund_method: 'CASH',
  refund_reason: '',
  refund_date: '',
  remark: '',
  products: [],
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  original_order_id: [{ required: true, message: t('sale.please_select_original_order') }],
  customer_id: [{ required: true, message: t('sale.please_select_customer') }],
  staff_id: [{ required: true, message: t('sale.please_select_staff') }],
  refund_amount: [{ required: true, message: t('sale.please_enter_refund_amount') }],
  refund_method: [{ required: true, message: t('sale.please_select_refund_method') }],
  refund_reason: [{ required: true, message: t('sale.please_enter_refund_reason') }],
  refund_date: [{ required: true, message: t('sale.please_select_refund_date') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('sale.addSaleRefundOrder');
  } else if (type === 'edit') {
    return t('sale.editSaleRefundOrder');
  } else if (type === 'detail') {
    return t('sale.saleRefundOrderDetail');
  } else {
    return t('sale.saleRefundOrder');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 产品列定义
const productColumns = [
  {
    title: t('sale.productName'),
    key: 'product_name',
    width: 200,
  },
  {
    title: t('sale.quantity'),
    key: 'quantity',
    width: 100,
  },
  {
    title: t('sale.unitPrice'),
    key: 'unit_price',
    width: 120,
  },
  {
    title: t('sale.totalPrice'),
    key: 'total_price',
    width: 120,
  },
  {
    title: t('common.action'),
    key: 'action',
    width: 80,
  },
];

// 产品详情列定义
const productDetailColumns = [
  {
    title: t('sale.productName'),
    dataIndex: 'product_name',
    key: 'product_name',
  },
  {
    title: t('sale.productCode'),
    dataIndex: 'product_code',
    key: 'product_code',
  },
  {
    title: t('sale.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: t('sale.unitPrice'),
    dataIndex: 'unit_price',
    key: 'unit_price',
  },
  {
    title: t('sale.totalPrice'),
    dataIndex: 'total_price',
    key: 'total_price',
  },
];

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadOrderOptions();
      await loadCustomerOptions();
      await loadStaffOptions();
      await loadProductOptions();

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

// 加载订单选项
const loadOrderOptions = async () => {
  try {
    // 这里应该调用获取订单列表的 API
    // 暂时使用空数组
    orderOptions.value = [];
  } catch (error) {
    console.error('加载订单选项失败:', error);
  }
};

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

// 加载产品选项
const loadProductOptions = async () => {
  try {
    // 这里应该调用获取产品列表的 API
    // 暂时使用空数组
    productOptions.value = [];
  } catch (error) {
    console.error('加载产品选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getSaleRefundOrderDetailApi({
      refund_order_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      original_order_id: data.original_order_id,
      customer_id: data.customer_id,
      staff_id: data.staff_id,
      refund_amount: data.refund_amount,
      refund_method: data.refund_method,
      refund_reason: data.refund_reason,
      refund_date: data.refund_date,
      remark: data.remark,
      products: data.products.map((product: any) => ({
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price: product.unit_price,
        remark: product.remark,
      })),
    };
  } catch (error) {
    console.error('加载退款订单详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    original_order_id: 0,
    customer_id: 0,
    staff_id: 0,
    refund_amount: 0,
    refund_method: 'CASH',
    refund_reason: '',
    refund_date: '',
    remark: '',
    products: [],
    merchant_id: userStore.merchantId,
  };
};

// 选项过滤
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 处理订单变化
const handleOrderChange = (orderId: number) => {
  // 这里可以根据选择的订单加载相关信息
  console.log('选择订单:', orderId);
};

// 处理产品变化
const handleProductChange = (productId: number, index: number) => {
  const product = productOptions.value.find(p => p.value === productId);
  if (product) {
    formData.value.products[index].product_name = product.label;
  }
};

// 计算总价
const calculateTotalPrice = (index: number) => {
  const product = formData.value.products[index];
  product.total_price = product.quantity * product.unit_price;
};

// 添加产品
const handleAddProduct = () => {
  formData.value.products.push({
    product_id: 0,
    product_name: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    remark: '',
  });
};

// 删除产品
const handleRemoveProduct = (index: number) => {
  formData.value.products.splice(index, 1);
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
      await createSaleRefundOrderApi(submitData as SaleRefundOrderCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateSaleRefundOrderApi({
        ...submitData,
        refund_order_id: drawerData.value.id,
      } as SaleRefundOrderModifyVO);
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
