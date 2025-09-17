<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="drawerTitle"
    :width="800"
    @register="register"
    @success="handleSuccess"
  >
    <div class="p-4">
      <!-- 步骤指示器 -->
      <div v-if="drawerData?.type !== 'detail'" class="mb-6">
        <Steps :current="currentStep" :items="stepItems" />
      </div>

      <Form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- 基本信息步骤 -->
        <div v-if="currentStep === 0">
          <h3 class="text-lg font-medium mb-4">{{ t('store.basicInfo') }}</h3>

          <!-- 店铺名称 -->
          <FormItem
            name="store_name"
            :label="t('store.storeName')"
            :rules="[{ required: true, message: t('store.please_enter_store_name') }]"
          >
            <Input
              v-model:value="formData.store_name"
              :placeholder="t('store.please_enter_store_name')"
            />
          </FormItem>

          <!-- 店铺编码 -->
          <FormItem
            name="store_code"
            :label="t('store.storeCode')"
            :rules="[{ required: true, message: t('store.please_enter_store_code') }]"
          >
            <Input
              v-model:value="formData.store_code"
              :placeholder="t('store.please_enter_store_code')"
            />
          </FormItem>

          <!-- 店铺类型 -->
          <FormItem
            name="store_type"
            :label="t('store.storeType')"
            :rules="[{ required: true, message: t('store.please_select_store_type') }]"
          >
            <Select
              v-model:value="formData.store_type"
              :placeholder="t('store.please_select_store_type')"
              :options="storeTypeOptions"
            />
          </FormItem>

          <!-- 地址 -->
          <FormItem
            name="address"
            :label="t('store.address')"
            :rules="[{ required: true, message: t('store.please_enter_address') }]"
          >
            <Textarea
              v-model:value="formData.address"
              :placeholder="t('store.please_enter_address')"
              :rows="3"
            />
          </FormItem>

          <!-- 城市 -->
          <FormItem
            name="city"
            :label="t('store.city')"
            :rules="[{ required: true, message: t('store.please_enter_city') }]"
          >
            <Input
              v-model:value="formData.city"
              :placeholder="t('store.please_enter_city')"
            />
          </FormItem>

          <!-- 电话 -->
          <FormItem
            name="phone"
            :label="t('store.phone')"
            :rules="[{ required: true, message: t('store.please_enter_phone') }]"
          >
            <Input
              v-model:value="formData.phone"
              :placeholder="t('store.please_enter_phone')"
            />
          </FormItem>

          <!-- 店长选择 -->
          <FormItem
            name="manager_id"
            :label="t('store.managerName')"
            :rules="[{ required: true, message: t('store.please_select_manager') }]"
          >
            <Select
              v-model:value="formData.manager_id"
              :placeholder="t('store.please_select_manager')"
              :options="managerOptions"
              show-search
              :filter-option="filterOption"
            />
          </FormItem>

          <!-- 描述 -->
          <FormItem
            name="description"
            :label="t('store.description')"
          >
            <Textarea
              v-model:value="formData.description"
              :placeholder="t('store.please_enter_description')"
              :rows="3"
            />
          </FormItem>
        </div>

        <!-- 版本选择步骤 -->
        <div v-else-if="currentStep === 1">
          <h3 class="text-lg font-medium mb-4">{{ t('store.editionSelection') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="edition in editionOptions"
              :key="edition.value"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="{
                'border-blue-500 bg-blue-50': selectedEdition === edition.value,
                'border-gray-200 hover:border-gray-300': selectedEdition !== edition.value
              }"
              @click="selectedEdition = edition.value"
            >
              <h4 class="font-medium text-lg">{{ edition.label }}</h4>
              <p class="text-gray-600 text-sm mt-2">{{ edition.description }}</p>
              <div class="mt-4">
                <span class="text-2xl font-bold text-blue-600">¥{{ edition.price }}</span>
                <span class="text-gray-500 text-sm">/月</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 套餐选择步骤 -->
        <div v-else-if="currentStep === 2">
          <h3 class="text-lg font-medium mb-4">{{ t('store.packageSelection') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="pkg in packageOptions"
              :key="pkg.value"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="{
                'border-blue-500 bg-blue-50': selectedPackage === pkg.value,
                'border-gray-200 hover:border-gray-300': selectedPackage !== pkg.value
              }"
              @click="selectedPackage = pkg.value"
            >
              <h4 class="font-medium text-lg">{{ pkg.label }}</h4>
              <p class="text-gray-600 text-sm mt-2">{{ pkg.description }}</p>
              <div class="mt-4">
                <span class="text-2xl font-bold text-blue-600">¥{{ pkg.price }}</span>
                <span class="text-gray-500 text-sm">/月</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 支付步骤 -->
        <div v-else-if="currentStep === 3">
          <h3 class="text-lg font-medium mb-4">{{ t('store.payment') }}</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 class="font-medium mb-2">{{ t('store.orderSummary') }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>{{ t('store.edition') }}:</span>
                <span>{{ selectedEditionLabel }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ t('store.package') }}:</span>
                <span>{{ selectedPackageLabel }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>{{ t('store.total') }}:</span>
                <span>¥{{ totalPrice }}</span>
              </div>
            </div>
          </div>

          <FormItem
            name="payment_method"
            :label="t('store.paymentMethod')"
            :rules="[{ required: true, message: t('store.please_select_payment_method') }]"
          >
            <Select
              v-model:value="formData.payment_method"
              :placeholder="t('store.please_select_payment_method')"
              :options="paymentMethodOptions"
            />
          </FormItem>
        </div>

        <!-- 完成步骤 -->
        <div v-else-if="currentStep === 4">
          <div class="text-center py-8">
            <div class="text-6xl text-green-500 mb-4">✓</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ t('store.createSuccess') }}</h3>
            <p class="text-gray-600">{{ t('store.createSuccessMessage') }}</p>
          </div>
        </div>
      </Form>
    </div>

    <template #footer>
      <Space>
        <Button @click="handleCancel">
          {{ t('common.cancel') }}
        </Button>
        <Button
          v-if="currentStep > 0"
          @click="handlePrev"
        >
          {{ t('common.previous') }}
        </Button>
        <Button
          v-if="currentStep < 4 && drawerData?.type !== 'detail'"
          type="primary"
          @click="handleNext"
          :loading="loading"
        >
          {{ t('common.next') }}
        </Button>
        <Button
          v-if="currentStep === 4"
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
  Input,
  Select,
  Textarea,
  Button,
  Space,
  Steps,
} from '@igourd/common-ui';

import type {
  StoreCreateCreateVO,
  StoreCreateModifyVO,
} from '@@/store/types';

import {
  createStoreCreateApi,
  updateStoreCreateApi,
  getStoreCreateDetailApi,
} from '@@/store/apis';

defineOptions({
  name: 'StoreCreateDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);
const managerOptions = ref([]);
const currentStep = ref(0);
const selectedEdition = ref('');
const selectedPackage = ref('');

// 店铺类型选项
const storeTypeOptions = [
  { label: t('store.storeType.retail'), value: 'RETAIL' },
  { label: t('store.storeType.wholesale'), value: 'WHOLESALE' },
  { label: t('store.storeType.online'), value: 'ONLINE' },
  { label: t('store.storeType.hybrid'), value: 'HYBRID' },
];

// 版本选项
const editionOptions = [
  {
    label: t('store.edition.basic'),
    value: 'BASIC',
    description: t('store.edition.basicDesc'),
    price: 99,
  },
  {
    label: t('store.edition.standard'),
    value: 'STANDARD',
    description: t('store.edition.standardDesc'),
    price: 199,
  },
  {
    label: t('store.edition.premium'),
    value: 'PREMIUM',
    description: t('store.edition.premiumDesc'),
    price: 399,
  },
];

// 套餐选项
const packageOptions = [
  {
    label: t('store.package.starter'),
    value: 'STARTER',
    description: t('store.package.starterDesc'),
    price: 0,
  },
  {
    label: t('store.package.growth'),
    value: 'GROWTH',
    description: t('store.package.growthDesc'),
    price: 50,
  },
  {
    label: t('store.package.enterprise'),
    value: 'ENTERPRISE',
    description: t('store.package.enterpriseDesc'),
    price: 100,
  },
];

// 支付方式选项
const paymentMethodOptions = [
  { label: t('store.paymentMethod.alipay'), value: 'ALIPAY' },
  { label: t('store.paymentMethod.wechat'), value: 'WECHAT' },
  { label: t('store.paymentMethod.bank'), value: 'BANK' },
];

// 步骤项
const stepItems = [
  { title: t('store.step.basicInfo') },
  { title: t('store.step.edition') },
  { title: t('store.step.package') },
  { title: t('store.step.payment') },
  { title: t('store.step.complete') },
];

// 表单数据
const formData = ref<StoreCreateCreateVO | StoreCreateModifyVO>({
  store_name: '',
  store_code: '',
  store_type: 'RETAIL',
  address: '',
  city: '',
  phone: '',
  manager_id: 0,
  description: '',
  payment_method: '',
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  store_name: [{ required: true, message: t('store.please_enter_store_name') }],
  store_code: [{ required: true, message: t('store.please_enter_store_code') }],
  store_type: [{ required: true, message: t('store.please_select_store_type') }],
  address: [{ required: true, message: t('store.please_enter_address') }],
  city: [{ required: true, message: t('store.please_enter_city') }],
  phone: [{ required: true, message: t('store.please_enter_phone') }],
  manager_id: [{ required: true, message: t('store.please_select_manager') }],
  payment_method: [{ required: true, message: t('store.please_select_payment_method') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('store.addStoreCreate');
  } else if (type === 'edit') {
    return t('store.editStoreCreate');
  } else if (type === 'detail') {
    return t('store.storeCreateDetail');
  } else {
    return t('store.storeCreate');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 计算选中的版本标签
const selectedEditionLabel = computed(() => {
  const edition = editionOptions.find(e => e.value === selectedEdition.value);
  return edition ? edition.label : '';
});

// 计算选中的套餐标签
const selectedPackageLabel = computed(() => {
  const pkg = packageOptions.find(p => p.value === selectedPackage.value);
  return pkg ? pkg.label : '';
});

// 计算总价格
const totalPrice = computed(() => {
  const edition = editionOptions.find(e => e.value === selectedEdition.value);
  const pkg = packageOptions.find(p => p.value === selectedPackage.value);
  return (edition?.price || 0) + (pkg?.price || 0);
});

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
      await loadManagerOptions();

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

// 加载店长选项
const loadManagerOptions = async () => {
  try {
    // 这里应该调用获取店长列表的 API
    // 暂时使用空数组
    managerOptions.value = [];
  } catch (error) {
    console.error('加载店长选项失败:', error);
  }
};

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getStoreCreateDetailApi({
      create_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      store_name: data.store_name,
      store_code: data.store_code,
      store_type: data.store_type,
      address: data.address,
      city: data.city,
      phone: data.phone,
      manager_id: data.manager_id,
      description: data.description,
    };
  } catch (error) {
    console.error('加载店铺创建详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    store_name: '',
    store_code: '',
    store_type: 'RETAIL',
    address: '',
    city: '',
    phone: '',
    manager_id: 0,
    description: '',
    payment_method: '',
    merchant_id: userStore.merchantId,
  };
  currentStep.value = 0;
  selectedEdition.value = '';
  selectedPackage.value = '';
};

// 选项过滤
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 下一步
const handleNext = async () => {
  if (currentStep.value === 0) {
    // 验证基本信息
    try {
      await formRef.value?.validate();
    } catch (error) {
      return;
    }
  }

  if (currentStep.value < 4) {
    currentStep.value++;
  }
};

// 上一步
const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    loading.value = true;

    const submitData = {
      ...formData.value,
      merchant_id: userStore.merchantId,
    };

    if (drawerData.value?.type === 'add') {
      await createStoreCreateApi(submitData as StoreCreateCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateStoreCreateApi({
        ...submitData,
        create_id: drawerData.value.id,
      } as StoreCreateModifyVO);
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
