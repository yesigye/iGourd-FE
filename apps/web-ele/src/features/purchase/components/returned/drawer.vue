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
        <!-- 供应商选择 -->
        <FormItem
          name="supplier_id"
          :label="t('purchase.supplierName')"
          :rules="[{ required: true, message: t('purchase.please_select_supplier') }]"
        >
          <Select
            v-model:value="formData.supplier_id"
            :placeholder="t('purchase.please_select_supplier')"
            :options="supplierOptions"
            show-search
            :filter-option="filterOption"
          />
        </FormItem>

        <!-- 退货类型 -->
        <FormItem
          name="returned_type"
          :label="t('purchase.returnedType')"
          :rules="[{ required: true, message: t('purchase.please_select_returned_type') }]"
        >
          <Select
            v-model:value="formData.returned_type"
            :placeholder="t('purchase.please_select_returned_type')"
            :options="returnedTypeOptions"
          />
        </FormItem>

        <!-- 退货日期 -->
        <FormItem
          name="returned_date"
          :label="t('purchase.returnedDate')"
          :rules="[{ required: true, message: t('purchase.please_select_returned_date') }]"
        >
          <DatePicker
            v-model:value="formData.returned_date"
            :placeholder="t('purchase.please_select_returned_date')"
            style="width: 100%"
          />
        </FormItem>

        <!-- 退货原因 -->
        <FormItem
          name="reason"
          :label="t('purchase.reason')"
          :rules="[{ required: true, message: t('purchase.please_enter_reason') }]"
        >
          <Textarea
            v-model:value="formData.reason"
            :placeholder="t('purchase.please_enter_reason')"
            :rows="3"
          />
        </FormItem>

        <!-- 备注 -->
        <FormItem
          name="remark"
          :label="t('purchase.remark')"
        >
          <Textarea
            v-model:value="formData.remark"
            :placeholder="t('purchase.please_enter_remark')"
            :rows="3"
          />
        </FormItem>
      </Form>

      <!-- 产品列表 -->
      <div v-if="drawerData?.type !== 'detail'" class="mt-6">
        <div class="flex justify-between items-center mb-4">
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
            <template v-else-if="column.key === 'returned_reason'">
              <Input
                v-model:value="record.returned_reason"
                :placeholder="t('purchase.please_enter_returned_reason')"
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
        <h3 class="text-lg font-medium mb-4">{{ t('purchase.products') }}</h3>
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
import { useIgourdDrawer } from '@igourd/common-ui';;
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
  Input,
} from '@igourd/common-ui';

import type {
  PurchaseReturnedCreateVO,
  PurchaseReturnedModifyVO,
  ReturnedType,
  PurchaseReturnedProductVO,
} from '@@/purchase/types';

import {
  createPurchaseReturnedApi,
  updatePurchaseReturnedApi,
  getPurchaseReturnedDetailApi,
} from '@@/purchase/apis';

defineOptions({
  name: 'PurchaseReturnedDrawer',
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

// 退货类型选项
const returnedTypeOptions = [
  { label: t('purchase.returnedType.qualityIssue'), value: 'QUALITY_ISSUE' },
  { label: t('purchase.returnedType.damaged'), value: 'DAMAGED' },
  { label: t('purchase.returnedType.wrongItem'), value: 'WRONG_ITEM' },
  { label: t('purchase.returnedType.excessStock'), value: 'EXCESS_STOCK' },
  { label: t('purchase.returnedType.other'), value: 'OTHER' },
];

// 表单数据
const formData = ref<PurchaseReturnedCreateVO | PurchaseReturnedModifyVO>({
  supplier_id: 0,
  returned_type: 'QUALITY_ISSUE',
  returned_date: '',
  reason: '',
  remark: '',
  products: [],
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  supplier_id: [{ required: true, message: t('purchase.please_select_supplier') }],
  returned_type: [{ required: true, message: t('purchase.please_select_returned_type') }],
  returned_date: [{ required: true, message: t('purchase.please_select_returned_date') }],
  reason: [{ required: true, message: t('purchase.please_enter_reason') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('purchase.addPurchaseReturned');
  } else if (type === 'edit') {
    return t('purchase.editPurchaseReturned');
  } else if (type === 'detail') {
    return t('purchase.purchaseReturnedDetail');
  } else {
    return t('purchase.purchaseReturned');
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
    title: t('purchase.quantity'),
    key: 'quantity',
    width: 100,
  },
  {
    title: t('purchase.unitPrice'),
    key: 'unit_price',
    width: 120,
  },
  {
    title: t('purchase.returnedReason'),
    key: 'returned_reason',
    width: 150,
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
    title: t('purchase.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: t('purchase.unitPrice'),
    dataIndex: 'unit_price',
    key: 'unit_price',
  },
  {
    title: t('purchase.returnedReason'),
    dataIndex: 'returned_reason',
    key: 'returned_reason',
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
  { immediate: true }
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
    const response = await getPurchaseReturnedDetailApi({
      returned_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      supplier_id: data.supplier_id,
      returned_type: data.returned_type,
      returned_date: data.returned_date,
      reason: data.reason,
      remark: data.remark,
      products: data.products.map((product: any) => ({
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price: product.unit_price,
        returned_reason: product.returned_reason,
        remark: product.remark,
      })),
    };
  } catch (error) {
    console.error('加载退货单详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    supplier_id: 0,
    returned_type: 'QUALITY_ISSUE',
    returned_date: '',
    reason: '',
    remark: '',
    products: [],
    merchant_id: userStore.merchantId,
  };
};

// 供应商选项过滤
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
    returned_reason: '',
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
      await createPurchaseReturnedApi(submitData as PurchaseReturnedCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updatePurchaseReturnedApi({
        ...submitData,
        returned_id: drawerData.value.id,
      } as PurchaseReturnedModifyVO);
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
