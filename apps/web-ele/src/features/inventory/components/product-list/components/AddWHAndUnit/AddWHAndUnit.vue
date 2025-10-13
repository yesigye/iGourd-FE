<script setup lang="ts">
import type { FormInstance } from 'element-plus';

import { computed, onMounted, ref } from 'vue';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
  ElSwitch,
  useIgourdModal,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  createUnitApi,
  getUnitDetailApi,
  updateUnit,
  warehouseCreate,
  warehouseDetail,
  warehouseModify,
} from '@@/inventory/apis';

import { LoginService } from '#/apis/login';
import {
  validateChar,
  validateEmailAll,
  validatePhoneAll,
} from '#/utils/eleValidate';

const emit = defineEmits(['close-tkr', 'success']);

const [Modal, modalApi] = useIgourdModal();
const { t } = useI18n();
const visible = ref(false);
const warehouseFormRef = ref<FormInstance>();
const unitFormRef = ref<FormInstance>();

// 组件的类型 - 'warehouse' 或 'unit'
const type = ref<'unit' | 'warehouse'>('warehouse');
// 是否是编辑模式
const isEdit = ref(false);
// 状态（用于编辑模式）
const status = ref('OPEN');
// 当前编辑的ID
const currentId = ref('');

// 模态框标题
const modalTitle = computed(() => {
  if (type.value === 'warehouse') {
    return isEdit.value
      ? t('inventory.editWarehouse')
      : t('inventory.addWarehouse');
  } else {
    return isEdit.value ? t('inventory.editUnit') : t('inventory.addUnit');
  }
});

// 仓库表单数据
const warehouseForm = ref({
  address: '',
  contact_name: '',
  contact_telephone: '',
  country_id: null,
  creator_id: null,
  email: '',
  is_default: true,
  name: '',
  remark: '',
});

// 单位表单数据
const unitForm = ref({
  name: '',
});

// 仓库表单验证规则
const warehouseRules = computed(() => {
  return {
    name: [
      {
        required: true,
        message: t('inventory.pleaseInputWarehouseName'),
        trigger: 'blur',
      },
      {
        validator: validateChar(64),
        trigger: 'blur',
      },
    ],
    contact_telephone: [
      {
        validator: validatePhoneAll(),
        trigger: 'blur',
      },
    ],
    email: [
      {
        validator: validateEmailAll,
        trigger: 'blur',
      },
    ],
  };
});

// 单位表单验证规则
const unitRules = computed(() => {
  return {
    name: [
      {
        required: true,
        message: t('inventory.unitNameNotEmpty'),
        trigger: 'blur',
      },
      {
        validator: validateChar(64),
        trigger: 'blur',
      },
    ],
  };
});

// 国家列表
const countrys = ref([]);

// 获取国家列表
const getCountryAreas = async () => {
  try {
    const data = await LoginService.countryAreas();
    countrys.value = data;
  } catch (error) {
    console.error('Failed to fetch country areas:', error);
  }
};

// 关闭弹窗
const handleClose = () => {
  visible.value = false;
  modalApi.close();
  resetForms();
  emit('close-tkr');
};

// 重置表单
const resetForms = () => {
  if (type.value === 'warehouse') {
    if (warehouseFormRef.value) {
      warehouseFormRef.value.resetFields();
    }
    warehouseForm.value = {
      address: '',
      contact_name: '',
      contact_telephone: '',
      country_id: null,
      creator_id: null,
      email: '',
      is_default: true,
      name: '',
      remark: '',
    };
  } else {
    if (unitFormRef.value) {
      unitFormRef.value.resetFields();
    }
    unitForm.value = {
      name: '',
    };
  }
};

// 提交表单
const handleSubmit = async () => {
  const formRef =
    type.value === 'warehouse' ? warehouseFormRef.value : unitFormRef.value;
  if (!formRef) return;

  try {
    await formRef.validate(async (valid) => {
      if (valid) {
        await (type.value === 'warehouse' ? submitWarehouse() : submitUnit());
      }
    });
  } catch (error) {
    console.error('Form validation error:', error);
  }
};

// 提交并继续添加
const handleSubmitAndAdd = async () => {
  const formRef =
    type.value === 'warehouse' ? warehouseFormRef.value : unitFormRef.value;
  if (!formRef) return;

  try {
    await formRef.validate(async (valid) => {
      if (valid) {
        await (type.value === 'warehouse'
          ? submitWarehouse(false)
          : submitUnit(false));
        resetForms();
      }
    });
  } catch (error) {
    console.error('Form validation error:', error);
  }
};

// 提交仓库表单
const submitWarehouse = async (closeOnSuccess = true) => {
  try {
    const response = await (isEdit.value
      ? warehouseModify({
          id: currentId.value,
          ...warehouseForm.value,
        })
      : warehouseCreate(warehouseForm.value));

    emit('success', {
      type: 'warehouse',
      action: isEdit.value ? 'edit' : 'add',
      data: response.data,
    });
    if (closeOnSuccess) {
      handleClose();
    }
    return true;
  } catch (error) {
    console.error('Failed to submit warehouse:', error);
    ElMessage.error(t('common.submitFailed'));
  }
  return false;
};

// 提交单位表单
const submitUnit = async (closeOnSuccess = true) => {
  try {
    const response = await (isEdit.value
      ? updateUnit({
          product_unit_id: currentId.value,
          ...unitForm.value,
        })
      : createUnitApi(unitForm.value));

    ElMessage.success(response.message);
    emit('success', {
      type: 'unit',
      action: isEdit.value ? 'edit' : 'add',
      data: response.data,
    });
    if (closeOnSuccess) {
      handleClose();
    }
    return true;
  } catch (error) {
    console.error('Failed to submit unit:', error);
    ElMessage.error(t('common.submitFailed'));
  }
  return false;
};

// 获取仓库详情
const getWarehouseDetail = async (id) => {
  try {
    const response = await warehouseDetail({
      id,
    });
    warehouseForm.value = { ...response };
  } catch (error) {
    console.error('Failed to fetch warehouse detail:', error);
    ElMessage.error(t('common.fetchFailed'));
  }
};

// 获取单位详情
const getUnitDetail = async (id) => {
  try {
    const response = await getUnitDetailApi({
      product_unit_id: id,
    });

    unitForm.value = response;
  } catch (error) {
    console.error('Failed to fetch unit detail:', error);
    ElMessage.error(t('common.fetchFailed'));
  }
};

// 打开添加仓库弹窗
const openAddWarehouse = () => {
  type.value = 'warehouse';
  isEdit.value = false;
  currentId.value = '';
  resetForms();
  visible.value = true;
  modalApi.open();
};

// 打开编辑仓库弹窗
const openEditWarehouse = (id) => {
  type.value = 'warehouse';
  isEdit.value = true;
  currentId.value = id;
  resetForms();
  visible.value = true;
  modalApi.open();
  getWarehouseDetail(id);
};

// 打开添加单位弹窗
const openAddUnit = () => {
  type.value = 'unit';
  isEdit.value = false;
  currentId.value = '';
  resetForms();
  visible.value = true;
  modalApi.open();
};

// 打开编辑单位弹窗
const openEditUnit = (id) => {
  type.value = 'unit';
  isEdit.value = true;
  currentId.value = id;
  resetForms();
  visible.value = true;
  modalApi.open();
  getUnitDetail(id);
};

onMounted(() => {
  getCountryAreas();
});

// 对外暴露方法
defineExpose({
  openAddWarehouse,
  openEditWarehouse,
  openAddUnit,
  openEditUnit,
});
</script>

<template>
  <Modal
    v-model="visible"
    :title="modalTitle"
    width="500px"
    :destroy-on-close="false"
    :draggable="true"
    :close-on-click-modal="false"
    @cancel="handleClose"
    @close="handleClose"
  >
    <!-- 仓库表单 -->
    <ElForm
      v-if="type === 'warehouse'"
      ref="warehouseFormRef"
      :rules="warehouseRules"
      :model="warehouseForm"
      label-position="right"
      label-width="170px"
      @submit.native.prevent
    >
      <div class="form-wrapper-content">
        <ElFormItem
          :label="`${$t('purchase.warehouseName')}：`"
          required
          prop="name"
        >
          <ElInput v-model="warehouseForm.name" />
        </ElFormItem>
        <ElFormItem :label="`${$t('purchase.country')}：`">
          <ElSelect
            v-model="warehouseForm.country_id"
            :placeholder="$t('login.selectHolder')"
            filterable
          >
            <ElOption
              v-for="item in countrys"
              :key="item.name"
              :label="item.name"
              :value="item.country_id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; font-size: 13px; color: #8492a6">{{
                item.code
              }}</span>
            </ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem :label="`${$t('purchase.address')}：`">
          <ElInput v-model="warehouseForm.address" v-rpSymbol maxlength="256" />
        </ElFormItem>
        <ElFormItem :label="`${$t('purchase.name')}：`">
          <ElInput
            v-model="warehouseForm.contact_name"
            v-rpSymbol
            maxlength="64"
          />
        </ElFormItem>
        <ElFormItem
          :label="`${$t('purchase.phone')}：`"
          prop="contact_telephone"
        >
          <ElInput
            v-model.number="warehouseForm.contact_telephone"
            maxlength="11"
          />
        </ElFormItem>
        <ElFormItem :label="`${$t('purchase.email')}：`" prop="email">
          <ElInput v-model="warehouseForm.email" />
        </ElFormItem>
        <ElFormItem :label="`${$t('purchase.remark')}：`">
          <ElInput v-model="warehouseForm.remark" v-rpSymbol maxlength="256" />
        </ElFormItem>
      </div>
    </ElForm>

    <!-- 单位表单 -->
    <ElForm
      v-if="type === 'unit'"
      ref="unitFormRef"
      :model="unitForm"
      :rules="unitRules"
      size="default"
      label-position="right"
      label-width="100px"
      @submit.native.prevent
    >
      <div class="form-wrapper-content">
        <ElFormItem :label="$t('inventory.unitName')" required prop="name">
          <ElInput
            v-model="unitForm.name"
            :placeholder="$t('inventory.pleaseInputName')"
          />
        </ElFormItem>
      </div>
    </ElForm>

    <template #footer>
      <span class="dialog-footer">
        <div class="footer-container">
          <div class="left-actions" v-if="isEdit">
            <ElSwitch
              v-model="status"
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
              $t('common.cancelBtn')
            }}</ElButton>
            <ElButton type="primary" @click="handleSubmit">{{
              $t('common.submit')
            }}</ElButton>
            <ElButton type="primary" @click="handleSubmitAndAdd" v-if="!isEdit">
              {{ $t('common.submit_and_add') }}
            </ElButton>
          </div>
        </div>
      </span>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.form-wrapper-content {
  padding: 0 10px;
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
