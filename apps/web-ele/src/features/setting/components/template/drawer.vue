<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="drawerTitle"
    :width="1000"
    @register="register"
    @success="handleSuccess"
  >
    <div class="p-4">
      <Form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <!-- 模板名称 -->
        <FormItem
          name="template_name"
          :label="t('setting.templateName')"
          :rules="[{ required: true, message: t('setting.please_enter_template_name') }]"
        >
          <Input
            v-model:value="formData.template_name"
            :placeholder="t('setting.please_enter_template_name')"
          />
        </FormItem>

        <!-- 模板类型 -->
        <FormItem
          name="template_type"
          :label="t('setting.templateType')"
          :rules="[{ required: true, message: t('setting.please_select_template_type') }]"
        >
          <Select
            v-model:value="formData.template_type"
            :placeholder="t('setting.please_select_template_type')"
            :options="templateTypeOptions"
          />
        </FormItem>

        <!-- 描述 -->
        <FormItem
          name="description"
          :label="t('setting.description')"
          :rules="[{ required: true, message: t('setting.please_enter_description') }]"
        >
          <Textarea
            v-model:value="formData.description"
            :placeholder="t('setting.please_enter_description')"
            :rows="3"
          />
        </FormItem>

        <!-- 模板内容 -->
        <FormItem
          name="content"
          :label="t('setting.templateContent')"
          :rules="[{ required: true, message: t('setting.please_enter_template_content') }]"
        >
          <div class="template-editor">
            <div class="editor-toolbar mb-2">
              <Button size="small" @click="insertField('store_name')">
                {{ t('setting.insertField') }}: {{ t('setting.storeName') }}
              </Button>
              <Button size="small" @click="insertField('order_no')">
                {{ t('setting.insertField') }}: {{ t('setting.orderNo') }}
              </Button>
              <Button size="small" @click="insertField('total_amount')">
                {{ t('setting.insertField') }}: {{ t('setting.totalAmount') }}
              </Button>
              <Button size="small" @click="insertField('date')">
                {{ t('setting.insertField') }}: {{ t('setting.date') }}
              </Button>
              <Button size="small" @click="insertField('time')">
                {{ t('setting.insertField') }}: {{ t('setting.time') }}
              </Button>
            </div>
            <Textarea
              v-model:value="formData.content"
              :placeholder="t('setting.please_enter_template_content')"
              :rows="15"
              class="template-content"
            />
          </div>
        </FormItem>

        <!-- 是否默认 -->
        <FormItem
          name="is_default"
          :label="t('setting.isDefault')"
        >
          <Switch
            v-model:checked="formData.is_default"
          />
        </FormItem>

        <!-- 排序 -->
        <FormItem
          name="sort_order"
          :label="t('setting.sortOrder')"
          :rules="[{ required: true, message: t('setting.please_enter_sort_order') }]"
        >
          <InputNumber
            v-model:value="formData.sort_order"
            :min="0"
            style="width: 100%"
            :placeholder="t('setting.please_enter_sort_order')"
          />
        </FormItem>
      </Form>
    </div>

    <template #footer>
      <Space>
        <Button @click="handleCancel">
          {{ t('common.cancel') }}
        </Button>
        <Button @click="handlePreview">
          {{ t('setting.preview') }}
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
  Input,
  Select,
  InputNumber,
  Textarea,
  Button,
  Space,
  Switch,
} from '@igourd/common-ui';

import type {
  SettingTemplateCreateVO,
  SettingTemplateModifyVO,
  TemplateType,
} from '@@/setting/types';

import {
  createSettingTemplateApi,
  updateSettingTemplateApi,
  getSettingTemplateDetailApi,
} from '@@/setting/apis';

defineOptions({
  name: 'SettingTemplateDrawer',
});

const { t } = useI18n();
const userStore = useUserStore();

const [BasicDrawer, { close: closeDrawer }] = useIgourdDrawer({
  appendToMain: true,
});

const formRef = ref();
const loading = ref(false);

// 模板类型选项
const templateTypeOptions = [
  { label: t('setting.templateType.receipt'), value: 'RECEIPT' },
  { label: t('setting.templateType.barcodeLabel'), value: 'BARCODE_LABEL' },
  { label: t('setting.templateType.scanLabel'), value: 'SCAN_LABEL' },
  { label: t('setting.templateType.scanReceipt'), value: 'SCAN_RECEIPT' },
  { label: t('setting.templateType.scanTag'), value: 'SCAN_TAG' },
];

// 表单数据
const formData = ref<SettingTemplateCreateVO | SettingTemplateModifyVO>({
  template_name: '',
  template_type: 'RECEIPT',
  description: '',
  content: '',
  is_default: false,
  sort_order: 0,
  merchant_id: userStore.merchantId,
});

// 表单规则
const formRules = computed(() => ({
  template_name: [{ required: true, message: t('setting.please_enter_template_name') }],
  template_type: [{ required: true, message: t('setting.please_select_template_type') }],
  description: [{ required: true, message: t('setting.please_enter_description') }],
  content: [{ required: true, message: t('setting.please_enter_template_content') }],
  sort_order: [{ required: true, message: t('setting.please_enter_sort_order') }],
}));

// 抽屉标题
const drawerTitle = computed(() => {
  const type = drawerData.value?.type;

  if (type === 'add') {
    return t('setting.addTemplate');
  } else if (type === 'edit') {
    return t('setting.editTemplate');
  } else if (type === 'detail') {
    return t('setting.templateDetail');
  } else {
    return t('setting.template');
  }
});

// 抽屉数据
const drawerData = ref<{ type: string; id?: number } | null>(null);

// 监听抽屉数据变化
watch(
  () => drawerData.value,
  async (newData) => {
    if (newData) {
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

// 加载表单数据
const loadFormData = async (id: number) => {
  try {
    const response = await getSettingTemplateDetailApi({
      template_id: id,
      merchant_id: userStore.merchantId,
    });
    const data = response.data;

    formData.value = {
      ...formData.value,
      template_name: data.template_name,
      template_type: data.template_type,
      description: data.description,
      content: data.content,
      is_default: data.is_default,
      sort_order: data.sort_order,
    };
  } catch (error) {
    console.error('加载模板设置详情失败:', error);
  }
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    template_name: '',
    template_type: 'RECEIPT',
    description: '',
    content: '',
    is_default: false,
    sort_order: 0,
    merchant_id: userStore.merchantId,
  };
};

// 插入字段
const insertField = (field: string) => {
  const fieldTag = `{{${field}}}`;
  formData.value.content += fieldTag;
};

// 预览模板
const handlePreview = () => {
  // 这里可以打开预览窗口或跳转到预览页面
  console.log('预览模板:', formData.value.content);
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
      await createSettingTemplateApi(submitData as SettingTemplateCreateVO);
    } else if (drawerData.value?.type === 'edit' && drawerData.value?.id) {
      await updateSettingTemplateApi({
        ...submitData,
        template_id: drawerData.value.id,
      } as SettingTemplateModifyVO);
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

<style scoped>
.template-editor {
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-content {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
}
</style>
