<template>
  <div>
    <Form
      :form="form"
      :schema="formSchema"
      :loading="loading"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Form } from '@formily/element-plus';
import { createForm } from '@formily/core';
import { useMarketingForm } from '../hooks';

interface Props {
  data?: any;
  mode?: 'add' | 'edit' | 'view';
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  mode: 'add',
});

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const { formSchema, getDetail, save, loading } = useMarketingForm();

const form = createForm({
  initialValues: props.data,
});

// 处理提交
const handleSubmit = async (values: any) => {
  const result = await save(values);
  if (result.success) {
    emit('success');
  }
};

// 处理取消
const handleCancel = () => {
  emit('cancel');
};

// 初始化
onMounted(async () => {
  if (props.mode === 'edit' && props.data.id) {
    await getDetail(props.data.id);
  }
});

// 暴露方法
defineExpose({
  handleCancel,
});
</script>
