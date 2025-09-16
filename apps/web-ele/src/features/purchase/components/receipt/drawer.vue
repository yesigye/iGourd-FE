<template>
  <BasicDrawer v-bind="$attrs" :title="drawerTitle" class="w-full">
    <div class="p-4">
      <Form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- 供应商选择 -->
        <FormItem
          name="supplier_id"
          :label="t('purchase.supplierName')"
          :rules="[
            { required: true, message: t('purchase.please_select_supplier') },
          ]"
        >
          <Select
            v-model:value="formData.supplier_id"
            :placeholder="t('purchase.please_select_supplier')"
            :options="supplierOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 收货日期 -->
        <FormItem
          name="receipt_date"
          :label="t('purchase.receiptDate')"
          :rules="[
            {
              required: true,
              message: t('purchase.please_select_receipt_date'),
            },
          ]"
        >
          <DatePicker
            v-model:value="formData.receipt_date"
            :placeholder="t('purchase.please_select_receipt_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem name="remark" :label="t('purchase.remark')">
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('purchase.please_enter_remark')"
            :rows="3"
          />
        </FormItem>
      </Form>

      <!-- 产品列表 -->
      <div v-if="drawerData?.type !== 'detail'" class="mt-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ t('purchase.products') }}</h3>
          <Button type="primary" @click="handleAddProduct">
            {{ t('purchase.addProduct') }}
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
                :placeholder="t('purchase.please_select_product')"
                :options="productOptions"
                show-search
                :filter-option="filterOption"
                @change="(value) => handleProductChange(value, index)"
              />
            </template>
            <template v-else-if="column.key === 'ordered_quantity'">
              <InputNumber
                v-model:value="record.ordered_quantity"
                :min="0"
                :precision="0"
                style="width: 100%"
                @change="calculateTotalPrice(index)"
              />
            </template>
            <template v-else-if="column.key === 'received_quantity'">
              <InputNumber
                v-model:value="record.received_quantity"
                :min="0"
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
              <span>{{ record.received_quantity * record.unit_price }}</span>
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
        <h3 class="mb-4 text-lg font-medium">{{ t('purchase.products') }}</h3>
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
import { useIgourdDrawer } from '@igourd/common-ui';
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
  PurchaseReceiptCreateVO,
  PurchaseReceiptModifyVO,
  PurchaseReceiptProductVO,
} from '@@/purchase/types';

import {
  createPurchaseReceiptApi,
  updatePurchaseReceiptApi,
  getPurchaseReceiptDetailApi,
} from '@@/purchase/apis';

defineOptions({
  name: 'PurchaseReceiptDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const supplierOptions = ref([]);
const productOptions = ref([]);

// 表单数据
const formData = ref<PurchaseReceiptCreateVO | PurchaseReceiptModifyVO>({
  supplier_id: 0,
  receipt_date: '',
  remark: '',
  products: [],
});

// 表单规则
const formRules = computed(() => ({
  supplier_id: [
    { required: true, message: t('purchase.please_select_supplier') },
  ],
  receipt_date: [
    { required: true, message: t('purchase.please_select_receipt_date') },
  ],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('purchase.addPurchaseReceipt');
  } else if (type === 'edit') {
    return t('purchase.editPurchaseReceipt');
  } else if (type === 'detail') {
    return t('purchase.purchaseReceiptDetail');
  } else {
    return t('purchase.purchaseReceipt');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 产品列定义
const productColumns = [
  {
    title: t('purchase.productName'),
    key: 'product_name',
    width: 200,
  },
  {
    title: t('purchase.orderedQuantity'),
    key: 'ordered_quantity',
    width: 120,
  },
  {
    title: t('purchase.receivedQuantity'),
    key: 'received_quantity',
    width: 120,
  },
  {
    title: t('purchase.unitPrice'),
    key: 'unit_price',
    width: 120,
  },
  {
    title: t('purchase.totalPrice'),
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
    title: t('purchase.productName'),
    dataIndex: 'product_name',
    key: 'product_name',
  },
  {
    title: t('purchase.productCode'),
    dataIndex: 'product_code',
    key: 'product_code',
  },
  {
    title: t('purchase.orderedQuantity'),
    dataIndex: 'ordered_quantity',
    key: 'ordered_quantity',
  },
  {
    title: t('purchase.receivedQuantity'),
    dataIndex: 'received_quantity',
    key: 'received_quantity',
  },
  {
    title: t('purchase.unitPrice'),
    dataIndex: 'unit_price',
    key: 'unit_price',
  },
  {
    title: t('purchase.totalPrice'),
    dataIndex: 'total_price',
    key: 'total_price',
  },
];

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadSupplierOptions();
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
  { immediate: true },
);

// 加载供应商选项
const loadSupplierOptions = async () => {
  try {
    // 这里应该调用获取供应商列表的 API
    // 暂时使用空数组
    supplierOptions.value = [];
  } catch (error) {
    console.error('加载供应商选项失败:', error);
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
    const response = await getPurchaseReceiptDetailApi({
      receipt_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      supplier_id: data.supplier_id,
      receipt_date: data.receipt_date,
      remark: data.remark,
      products: data.products.map((product: any) => ({
        product_id: product.product_id,
        ordered_quantity: product.ordered_quantity,
        received_quantity: product.received_quantity,
        unit_price: product.unit_price,
        remark: product.remark,
      })),
    };
  } catch (error) {
    console.error('加载收货单详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    supplier_id: 0,
    receipt_date: '',
    remark: '',
    products: [],
  };
};

// 供应商选项过滤
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 处理产品变化
const handleProductChange = (productId: number, index: number) => {
  const product = productOptions.value.find((p) => p.value === productId);
  if (product) {
    formData.value.products[index].product_name = product.label;
  }
};

// 计算总价
const calculateTotalPrice = (index: number) => {
  const product = formData.value.products[index];
  product.total_price = product.received_quantity * product.unit_price;
};

// 添加产品
const handleAddProduct = () => {
  formData.value.products.push({
    product_id: 0,
    product_name: '',
    ordered_quantity: 0,
    received_quantity: 0,
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
      await createPurchaseReceiptApi(submitData as PurchaseReceiptCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updatePurchaseReceiptApi({
        ...submitData,
        receipt_id: drawerData.value.id,
      } as PurchaseReceiptModifyVO);
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
