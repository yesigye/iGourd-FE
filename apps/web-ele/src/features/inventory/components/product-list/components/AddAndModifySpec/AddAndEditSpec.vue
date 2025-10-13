<!-- add spec 规格 -->
<script setup lang="ts">
import type { FormInstance } from 'element-plus';

import { computed, reactive, ref, toRefs } from 'vue';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElSwitch,
  useIgourdModal,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  findMinCode,
  productSpecCreate,
  productSpecModify,
  productSpecValueCreate,
  productSpecValueModify,
} from '@@/inventory/apis';

const emit = defineEmits(['close-tkr', 'success']);
const [Modal, modalApi] = useIgourdModal();
const { t } = useI18n();
const visible = ref(false);
const formRef = ref<FormInstance>();

const state = reactive({
  formData: {
    id: '',
    product_spec_name: '',
    product_spec_code: '',
    product_spec_value: '',
    product_spec_id: '',
    status: 'OPEN',
  },
  mode: 'add', // 'add' or 'edit'
  type: 'spec', // 'spec' or 'specValue'
  currentSpec: null,
});

const { formData, mode, type, currentSpec } = toRefs(state);

const isEdit = computed(() => mode.value === 'edit');
const isSpecValue = computed(() => type.value === 'specValue');
const modalTitle = computed(() => {
  if (isEdit.value) {
    return isSpecValue.value
      ? t('inventory.product_spec.edit_spec_value')
      : t('inventory.product_spec.edit_spec');
  } else {
    return isSpecValue.value
      ? t('inventory.product_spec.add_spec_value')
      : t('inventory.product_spec.add_spec');
  }
});

// 表单验证规则
const rules = computed(() => {
  const baseRules = {
    product_spec_name: [
      {
        required: true,
        message: t('inventory.product_spec.please_enter_spec_name'),
        trigger: 'blur',
      },
    ],
  };

  if (isSpecValue.value) {
    return {
      ...baseRules,
      product_spec_code: [
        {
          required: true,
          message: t('inventory.product_spec.please_enter_spec_code'),
          trigger: 'blur',
        },
        {
          validator: (rule, value, callback) => {
            if (
              value &&
              (value.toString().length > 2 || Number.parseInt(value) > 99)
            ) {
              callback(
                new Error(t('inventory.product_spec.code_max_two_digits')),
              );
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      product_spec_value: [
        {
          required: true,
          message: t('inventory.product_spec.please_enter_spec_value'),
          trigger: 'blur',
        },
      ],
    };
  }

  return baseRules;
});

const handleClose = () => {
  visible.value = false;
  modalApi.close();
  emit('close-tkr');
};

// 打开添加规格
const openAddSpec = () => {
  state.mode = 'add';
  state.type = 'spec';
  resetForm();
  visible.value = true;
  modalApi.open();
};

// 打开编辑规格
const openEditSpec = (spec) => {
  state.mode = 'edit';
  state.type = 'spec';
  resetForm();
  formData.value = {
    ...formData.value,
    id: spec.id,
    product_spec_name: spec.product_spec_name,
    status: spec.status || 'OPEN',
  };
  visible.value = true;
  modalApi.open();
};

// 打开添加规格值
const openAddSpecValue = async (specId, specName) => {
  state.mode = 'add';
  state.type = 'specValue';
  resetForm();
  formData.value.product_spec_id = specId;
  formData.value.product_spec_name = specName;
  state.currentSpec = { id: specId, name: specName };
  visible.value = true;
  modalApi.open();

  // 自动生成code填充
  await generateCode();
};

const openEditSpecValue = (specValue) => {
  state.mode = 'edit';
  state.type = 'specValue';
  resetForm();
  formData.value = {
    ...formData.value,
    id: specValue.id,
    product_spec_id: specValue.product_spec_id,
    product_spec_name: specValue.product_spec_name,
    product_spec_code: specValue.product_spec_code,
    product_spec_value: specValue.product_spec_value,
    status: specValue.status || 'OPEN',
  };
  visible.value = true;
  modalApi.open();
};

// 重制
const resetForm = () => {
  formData.value = {
    id: '',
    product_spec_name: '',
    product_spec_code: '',
    product_spec_value: '',
    product_spec_id: '',
    status: 'OPEN',
  };
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 保存
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isSpecValue.value) {
          // 如果是添加规格值且没有手动输入code，自动生成code
          if (!isEdit.value && !formData.value.product_spec_code) {
            await generateCode();
          }

          await (isEdit.value ? modifySpecValue() : createSpecValue());
        } else {
          await (isEdit.value ? modifySpec() : createSpec());
        }
        resetForm();
      } catch (error) {
        console.error('Form submission error:', error);
        ElMessage.error(t('common.submitFailed'));
      }
    }
  });
};

// 保存并继续添加
const handleSubmitAndAdd = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isSpecValue.value) {
          // 如果没有手动输入code，自动生成code
          if (!formData.value.product_spec_code) {
            await generateCode();
          }

          await createSpecValue(false);

          const specId = formData.value.product_spec_id;
          const specName = formData.value.product_spec_name;
          resetForm();
          formData.value.product_spec_id = specId;
          formData.value.product_spec_name = specName;

          // 为下一个规格值生成新的code
          await generateCode();
        } else {
          await createSpec();
          resetForm();
        }

        visible.value = true;
        modalApi.open();
      } catch (error) {
        console.error('Form submission error:', error);
        ElMessage.error(t('common.submitFailed'));
      }
    }
  });
};

const createSpecValue = async (closeDialogOnSuccess = true) => {
  if (!formData.value.product_spec_id) {
    ElMessage.error(t('inventory.product_spec.please_select_spec'));
    return false;
  }

  const data = await productSpecValueCreate({
    product_spec_code: formData.value.product_spec_code,
    product_spec_id: formData.value.product_spec_id,
    product_spec_name: formData.value.product_spec_name,
    product_spec_value: formData.value.product_spec_value,
  });
  ElMessage.success(t('common.addSuccess'));

  emit('success', {
    type: 'specValue',
    action: 'add',
    data: { ...formData.value, id: data.id },
  });

  if (closeDialogOnSuccess) {
    handleClose();
  }
  return true;
};

// 创建修改规格
const createSpec = async () => {
  try {
    const res = await productSpecCreate({
      product_spec_name: formData.value.product_spec_name,
    });
    ElMessage.success(t('common.addSuccess'));
    handleClose();
    emit('success', {
      type: 'spec',
      action: 'add',
      data: { ...formData.value },
    });
    return true;
  } catch (error) {
    console.error('Failed to create spec:', error);
    ElMessage.error(message);
    return false;
  }
};

const modifySpec = async () => {
  try {
    const res = await productSpecModify({
      id: formData.value.id,
      product_spec_name: formData.value.product_spec_name,
      status: formData.value.status,
    });
    ElMessage.success(t('common.modifySuccess'));
    handleClose();
    emit('success', {
      type: 'spec',
      action: 'edit',
      data: { ...formData.value },
    });
    return true;
  } catch (error) {
    console.error('Failed to modify spec:', error);
    ElMessage.error(error?.message || t('common.modifyFailed'));
    return false;
  }
};

const modifySpecValue = async () => {
  const res = await productSpecValueModify({
    id: formData.value.id,
    product_spec_code: formData.value.product_spec_code,
    product_spec_id: formData.value.product_spec_id,
    product_spec_name: formData.value.product_spec_name,
    product_spec_value: formData.value.product_spec_value,
    status: formData.value.status,
  });
  ElMessage.success(t('common.modifySuccess'));
  handleClose();
  emit('success', {
    type: 'specValue',
    action: 'edit',
    data: { ...formData.value },
  });
  return true;
};
// 生成code
const generateCode = async () => {
  try {
    if (!formData.value.product_spec_id) return;

    const response = await findMinCode({
      product_spec_id: formData.value.product_spec_id,
    });

    // if (response.code === 'SUCCESS' && response.data) {
    formData.value.product_spec_code = response;
    // }
  } catch (error) {
    console.error('Failed to generate code:', error);
  }
};

defineExpose({
  openAddSpec,
  openEditSpec,
  openAddSpecValue,
  openEditSpecValue,
});
</script>
<template>
  <Modal
    v-model="visible"
    width="500px"
    :title="modalTitle"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :draggable="true"
    @cancel="handleClose"
    @close="handleClose"
  >
    <ElForm
      ref="formRef"
      label-suffix="："
      label-position="top"
      :model="formData"
      :rules="rules"
      @submit.prevent
    >
      <div class="form-wrapper-content">
        <!-- 规格 -->
        <ElFormItem
          :label="$t('inventory.product_spec.product_spec_name')"
          prop="product_spec_name"
        >
          <ElInput
            v-model="formData.product_spec_name"
            maxlength="64"
            clearable
            :disabled="isSpecValue"
          />
        </ElFormItem>

        <!-- 规格值 -->
        <template v-if="isSpecValue">
          <ElFormItem
            :label="$t('inventory.product_spec.product_spec_code')"
            prop="product_spec_code"
          >
            <ElInput
              v-model="formData.product_spec_code"
              max="2"
              type="number"
              clearable
            />
          </ElFormItem>
          <ElFormItem
            :label="$t('inventory.product_spec.product_spec_value')"
            prop="product_spec_value"
          >
            <ElInput
              v-model="formData.product_spec_value"
              maxlength="64"
              clearable
            />
          </ElFormItem>
        </template>
      </div>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <div class="footer-container">
          <div v-if="isEdit" class="left-actions">
            <ElSwitch
              v-model="formData.status"
              active-value="OPEN"
              inactive-value="CLOSED"
              inline-prompt
              :active-text="$t('inventory.product_spec.OPEN')"
              :inactive-text="$t('inventory.product_spec.CLOSED')"
            />
          </div>
          <div v-else></div>
          <div class="right-actions">
            <ElButton @click="handleClose">{{
              t('common.cancelBtn')
            }}</ElButton>
            <ElButton type="primary" @click="handleSubmit">{{
              t('common.submit')
            }}</ElButton>
            <ElButton v-if="!isEdit" type="primary" @click="handleSubmitAndAdd">
              {{ t('common.submit_and_add') }}
            </ElButton>
          </div>
        </div>
      </span>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.form-wrapper-content {
  // padding: 0 20px;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .right-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}
</style>
