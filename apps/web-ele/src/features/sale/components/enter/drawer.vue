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

        <!-- 客户选择 -->
        <FormItem
          name="customer_id"
          :label="t('sale.customerName')"
        >
          <Select
            v-model:value="formData.customer_id"
            :placeholder="t('sale.please_select_customer')"
            :options="customerOptions"
            show-search
            :filter-option="filterOption"
            allow-clear
          />
        </FormItem>

        <!-- 销售日期 -->
        <FormItem
          name="enter_date"
          :label="t('sale.enterDate')"
          :rules="[{ required: true, message: t('sale.please_select_enter_date') }]"
        >
          <DatePicker
            v-model:value="formData.enter_date"
            :placeholder="t('sale.please_select_enter_date')"
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

      <!-- 金额汇总 -->
      <div v-if="drawerData?.type !== 'detail'" class="mt-6 p-4 bg-gray-50 rounded">
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">{{ t('sale.totalAmount') }}:</span>
          <span class="text-xl font-bold text-blue-600">{{ totalAmount }}</span>
        </div>
        <div class="mt-2">
          <InputNumber
            v-model:value="formData.paid_amount"
            :min="0"
            :max="totalAmount"
            :precision="2"
            style="width: 200px"
            :placeholder="t('sale.please_enter_paid_amount')"
          />
        </div>
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
  SaleEnterCreateVO,
  SaleEnterModifyVO,
  SaleEnterProductVO,
} from '@@/sale/types';

import {
  createSaleEnterApi,
  updateSaleEnterApi,
  getSaleEnterDetailApi,
} from '@@/sale/apis';

defineOptions({
  name: 'SaleEnterDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const staffOptions = ref([]);
const customerOptions = ref([]);
const productOptions = ref([]);

// 表单数据
const formData = ref<SaleEnterCreateVO | SaleEnterModifyVO>({
  staff_id: 0,
  customer_id: 0,
  total_amount: 0,
  paid_amount: 0,
  enter_date: '',
  remark: '',
  products: [],
  merchant_id: userStore.merchantId,
});

// 计算总金额
const totalAmount = computed(() => {
  return formData.value.products?.reduce((sum, product) => {
    return sum + (product.quantity * product.unit_price);
  }, 0) || 0;
});

// 表单规则
const formRules = computed(() => ({
  staff_id: [{ required: true, message: t('sale.please_select_staff') }],
  enter_date: [{ required: true, message: t('sale.please_select_enter_date') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('sale.addSaleEnter');
  } else if (type === 'edit') {
    return t('sale.editSaleEnter');
  } else if (type === 'detail') {
    return t('sale.saleEnterDetail');
  } else {
    return t('sale.saleEnter');
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
      await loadStaffOptions();
      await loadCustomerOptions();
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

// 监听总金额变化
watch(totalAmount, (newAmount) => {
  formData.value.total_amount = newAmount;
});

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
    const response = await getSaleEnterDetailApi({
      enter_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      staff_id: data.staff_id,
      customer_id: data.customer_id || 0,
      total_amount: data.total_amount,
      paid_amount: data.paid_amount,
      enter_date: data.enter_date,
      remark: data.remark,
      products: data.products.map((product: any) => ({
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price: product.unit_price,
        remark: product.remark,
      })),
    };
  } catch (error) {
    console.error('加载销售录入详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    staff_id: 0,
    customer_id: 0,
    total_amount: 0,
    paid_amount: 0,
    enter_date: '',
    remark: '',
    products: [],
    merchant_id: userStore.merchantId,
  };
};

// 选项过滤
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
      total_amount: totalAmount.value,
      merchant_id: userStore.merchantId,
    };

    if (drawerData.value?.type === 'add') {
      await createSaleEnterApi(submitData as SaleEnterCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateSaleEnterApi({
        ...submitData,
        enter_id: drawerData.value.id,
      } as SaleEnterModifyVO);
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
