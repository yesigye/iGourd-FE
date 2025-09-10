<template>
  <div class="inventory-count-drawer">
    <div class="drawer-header">
      <h3>{{ title }}</h3>
      <el-button type="text" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </el-button>
    </div>
    <div class="drawer-content">
      <Form
        :form="form"
        :schema="formSchema"
        @submit="handleSubmit"
      >
        <FormButtonGroup>
          <Submit>{{ t('common.save') }}</Submit>
          <Reset>{{ t('common.reset') }}</Reset>
        </FormButtonGroup>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from '@igourd/locales';
import { Form, FormItem, FormButtonGroup, Submit, Reset } from '@formily/element-plus';
import { createForm } from '@formily/core';
import { ElMessage } from 'element-plus';
import { inventoryApi } from '../apis/inventory';

const { t } = useI18n();

const props = defineProps<{
  title: string;
  formSchema: any;
  formData: any;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: any];
}>();

// 表单实例
const form = createForm({
  values: props.formData,
});

// 提交表单
const handleSubmit = (values: any) => {
  emit('submit', values);
};

// 关闭抽屉
const handleClose = () => {
  emit('close');
};

// 监听表单数据变化
watch(() => props.formData, (newData) => {
  if (newData) {
    form.setValues(newData);
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.inventory-count-drawer {
  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    h3 {
      margin: 0;
      font-size: 24px;
    }
  }
  
  .drawer-content {
    padding: 20px;
  }
}
</style>

