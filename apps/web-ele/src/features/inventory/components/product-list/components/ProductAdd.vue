<script setup>
import { computed, h, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ElButton,
  ElDialog,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElLink,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSelect,
  ElUpload,
} from '@igourd/common-ui';

import { FileService, UnitService } from '@/apis';
import { SystemConfigurationService } from '@/apis/settings/SystemConfiguration';
import { getMerchantInfo } from '@/common/functions';
import AddWHAndUnit from '@/components/AddWHAndUnit/AddWHAndUnit.vue';
import useUserStore from '@/store/modules/useUserStore';
import { Refresh } from '@element-plus/icons-vue';
import { debounce } from 'lodash';
import { storeToRefs } from 'pinia';

import { validateSharedStock } from '../product.config';
import FormRow from './FormRow.vue';
import FormSection from './FormSection.vue';
import DeleteUnitWarn from './SKU/DeleteUnitWarn.vue';
import ProductSKUForm from './SKU/ProductSKUForm.vue';
import { useProductAdd } from './useProductAdd';

const props = defineProps({
  productShow: {
    type: Boolean,
    default: false,
  },
  productTitle: {
    type: String,
    default: '这是默认标题',
  },
  currentDataId: {
    type: Number,
    default: 0,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  currentData: {
    type: Object,
    default: () => ({}),
  },
  // 判断添加还是编辑
  mode: {
    type: String,
    default: 'add',
  },
});
const emit = defineEmits(['close-tkr', 'saved', 'reset-form-mode']);
// 规格列表
const userStore = useUserStore();
const { merchantInfo, merchantId, userModel } = storeToRefs(userStore);
const { getCurrency_symbol } = getMerchantInfo();
const { t } = useI18n();

// 使用商品添加钩子
const {
  forms,
  rules,
  statusList,
  isReturnShow,
  showAllFiles,
  isShowStock,
  isNew,
  newDisabled,
  fileList,
  dialogImageUrl,
  dialogVisible,
  ruleFormRef,
  vendorListName,
  unitList,
  warehouseList,
  productGroupList,
  productLabelList,
  vatList,
  otherTaxList,
  taxRate,
  otherTaxRate,
  taxExciseRate,
  res_options,
  chunkedOptions,
  sharedStockParams,
  sharedStockKeys,
  addOptionDialogVisible,
  newOption,
  currentItem,
  formMode,

  // Methods
  parseOptions,
  updateDynamicData,
  handleVendorSearch,
  handleUnitSearch,
  handleProductGroupSearch,
  fetchData,
  refreshCode,
  resetForm,
  handleInputChange,
  openAddOptionDialog,
  addOption,
  closeAddOptionDialog,
  onSubmit,
  openDrawer,
  handleSwitchFiles,
} = useProductAdd();
// 弹窗打开时
const handleDrawerOpen = async () => {
  try {
    const res = await UnitService.getUnitList({
      merchant_id: merchantId.value,
      page_num: 1,
      page_size: 500,
    });
    if (res && res.data && res.data.list) {
      unitList.value = res.data.list;
    }
  } catch (error) {
    console.error('Failed to get unit list:', error);
    return [];
  }
};
// 添加共享库存验证
rules.basic_product_id = [
  { required: true, validator: validateSharedStock(t), trigger: 'submit' },
];
const isShowSKU = ref(false);
// 获取SKU表单组件的多规格多单位状态
const isMultiSpecsOrUnits = ref(false);
const isMultiUnitsEnabled = ref(false); // Add this line to track multi-units state

const specBundleGenerated = ref(false);
const hasMultipleSpecs = ref(false);

const shouldDisableInitialStock = computed(() => {
  return (
    (specBundleGenerated.value && hasMultipleSpecs.value) || newDisabled.value
  );
});

// SKU表单组件引用
const productSKUFormRef = ref(null);

const addWHAndUnitRef = ref(null);

// 增加更新规格组合状态的方法
const updateSpecBundleStatus = (status) => {
  specBundleGenerated.value = status.generated;
  hasMultipleSpecs.value = status.multipleSpecs;
};

const getFieldRequiredStatus = (field) => {
  if (
    formMode.value === 'edit' &&
    (field.prop === 'selling_price' || field.prop === 'cost_price')
  ) {
    return false;
  }
  return field.required;
};
// 基础信息部分表单字段
const basicInfoFields = reactive({
  row1: [
    {
      labelKey: 'inventory.product-name-major',
      prop: 'major_name',
      component: 'el-input',
      required: true,
      placeholderKey: 'inventory.please-input-product-major-name',
    },
    // {
    //   labelKey: 'inventory.barcode',
    //   prop: 'product_barcode',
    //   component: 'el-input',
    //   required: true,
    //   placeholderKey: 'inventory.please-input-barcode',
    //   props: { maxlength: 23 }
    // },
    {
      labelKey: 'inventory.product-code',
      prop: 'product_code',
      component: 'el-input',
      required: true,
      placeholderKey: 'inventory.please-input-product-code',
      suffix: true,
      props: { maxlength: 23 },
    },
    {
      labelKey: 'inventory.status',
      prop: 'status',
      component: 'el-radio-group',
      required: false,
      options: statusList.value,
      optionComponent: 'el-radio',
      onChange: (status) => {
        if (productSKUFormRef.value) {
          productSKUFormRef.value.updateAllSkuStatus(status);
        }
      },
    },
  ],
  // row2: [
  //   {
  //     labelKey: 'inventory.cost-price',
  //     prop: 'cost_price',
  //     component: ThousandsInput,
  //     required: true,
  //     placeholderKey: 'inventory.please-enter-cost-price',
  //     prefix: 'currency',
  //     props: { maxLength: 15 },
  //     onChange: val => handleInputChange('cost_price', val)
  //   },
  //   {
  //     labelKey: 'inventory.profit-rate',
  //     prop: 'profit_rate',
  //     component: 'el-input',
  //     props: { type: 'number' },
  //     placeholderKey: 'inventory.please-enter-profit-rate',
  //     prefix: '% ',
  //     onChange: val => handleInputChange('profit_rate', val)
  //   },
  //   {
  //     labelKey: 'inventory.selling-price',
  //     prop: 'selling_price',
  //     component: ThousandsInput,
  //     required: true,
  //     placeholderKey: 'inventory.please-enter-selling-price',
  //     prefix: 'currency',
  //     props: { maxLength: 15 },
  //     onChange: val => handleInputChange('selling_price', val)
  //   }
  // ],
  // row3: [
  //   {
  //     labelKey: 'inventory.status',
  //     prop: 'status',
  //     component: 'el-radio-group',
  //     required: false,
  //     options: statusList.value,
  //     optionComponent: 'el-radio',
  //     onChange: status => {
  //       if (productSKUFormRef.value) {
  //         productSKUFormRef.value.updateAllSkuStatus(status);
  //       }
  //     }
  //   }
  // ]
});

// 处理图片上传和预览
const handleUploadSuccess = (response) => {
  // if (response.code === 'SUCCESS') {
  ElMessage.success(t('inventory.upload-success'));
  forms.value.profile_photo = response.url;
  fileList.value = [{ name: 'profile', url: response.url }];
  // } else {
  //   ElMessage.error(response.message || t('inventory.upload-failed'));
  // }
};

const handleUploadError = (error) => {
  ElMessage.error(error.message || t('inventory.upload-failed'));
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error(t('inventory.upload-image-only'));
    return false;
  }
  if (!isLt2M) {
    ElMessage.error(t('inventory.image-size-should-be-less-than2-mb'));
    return false;
  }
  return true;
};

const handleRemove = () => {
  forms.value.profile_photo = '';
  fileList.value = [];
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const customUpload = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await FileService.upload(formData);
    handleUploadSuccess(response);
  } catch (error) {
    console.error('上传失败:', error);
    handleUploadError(error);
  }
};

const handleClose = () => {
  isReturnShow.value = false;

  setTimeout(() => {
    resetAllData();
    emit('close-tkr');
  }, 50);
};

// 重制
const resetAllData = () => {
  // 重制sku
  if (productSKUFormRef.value) {
    productSKUFormRef.value.resetMultiStatus();
    productSKUFormRef.value.resetSKUForm();
  }

  // 基础
  resetForm();
  fileList.value = [];

  // 状态
  formMode.value = 'add';
  showAllFiles.value = false;

  // 动态数据
  if (forms.value.dynamic_data) {
    forms.value.dynamic_data = '';
  }

  // 共享库存
  if (sharedStockParams.value) {
    Object.keys(sharedStockParams.value).forEach((key) => {
      forms.value[key] = '';
    });
  }
};
const getSkuSet = async () => {
  const res = await SystemConfigurationService.getSystemConfigurationDetail({
    merchant_id: merchantId.value,
  });
  if (res.code === 'SUCCESS') {
    isShowSKU.value = res.data.use_product_specification_settings;
  }
};

let handleInputDebounced;
onMounted(() => {
  getSkuSet();
  handleInputDebounced = debounce(async () => {
    debugger;
    console.log('获取预警信息', productSKUFormRef.value);
    // 提交前sku检查
    if (productSKUFormRef.value) {
      const confirmed = await productSKUFormRef.value.checkSKUChanges();
      if (!confirmed) {
        return;
      }
    }
    const skuData = productSKUFormRef.value
      ? productSKUFormRef.value.submitSKU()
      : null;
    const ismerge = productSKUFormRef.value.handleMergeForm();
    // skuData.deletedProductTable 根据id去重
    let response = null;
    if (props.mode === 'edit') {
      if (skuData.deletedProductTable.length > 0) {
        skuData.deletedProductTable = skuData.deletedProductTable.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );
        ElMessageBox.confirm('', {
          title: t('common.tips'),
          message: h(DeleteUnitWarn, {
            tableData: skuData.deletedProductTable,
          }),
          callback: async (event) => {
            if (event === 'confirm') {
              response = await onSubmit(skuData.skuList, ismerge);
              if (response?.code === 'SUCCESS') {
                handleClose();
                emit('saved');
              }
            }
          },
        });
      } else {
        response = await onSubmit(skuData.skuList, ismerge);
      }
    } else {
      response = await onSubmit(skuData.skuList, ismerge);
    }
    if (response?.code === 'SUCCESS') {
      handleClose();
      emit('saved');
    }
  }, 500);
});

watch(
  () => forms.value.tax_excise_id,
  (newVal) => {
    if (newVal) {
      const selectedTax = otherTaxList.value.find((item) => item.id === newVal);
      if (selectedTax) {
        nextTick(() => {
          taxExciseRate.value = `${selectedTax.percentage}%`;
        });
      }
    } else {
      taxExciseRate.value = null;
    }
  },
);

watch(
  () => forms.value.tax_vat_id,
  (newVal) => {
    if (newVal) {
      const selectedTax = vatList.value.find((item) => item.id === newVal);
      if (selectedTax) {
        nextTick(() => {
          taxRate.value = `${selectedTax.percentage}%`;
        });
      }
    } else {
      taxRate.value = null;
    }
  },
);

watch(
  () => forms.value.tax_other_id,
  (newVal) => {
    if (newVal) {
      const selectedTax = otherTaxList.value.find((item) => item.id === newVal);
      if (selectedTax) {
        nextTick(() => {
          otherTaxRate.value = `${selectedTax.percentage}%`;
        });
      }
    } else {
      otherTaxRate.value = null;
    }
  },
);

watch(
  () => props.productShow,
  (val) => {
    if (val) {
      isReturnShow.value = true;
      fetchData();
    }
  },
);

const handleEdit = async (currentData, type) => {
  if (!currentData) {
    ElMessage.error(t('inventory.noProductDataProvided'));
    return;
  }

  try {
    formMode.value = type;
    // 1. 初始化基础表单数据
    await openDrawer(currentData, false, false, merchantId.value, type);

    // 2. 准备SKU表单数据
    const skuFormData = {
      // 基础信息
      major_name: currentData.major_name,
      minor_name: currentData.minor_name,
      major_unit_id: currentData.major_unit_id,
      major_unit_name: currentData.major_unit_name,
      cost_price: currentData.cost_price?.toFixed(2),
      selling_price: currentData.selling_price?.toFixed(2),
      product_code: currentData.product_code,
      profile_photo: currentData.profile_photo,
      product_barcode: currentData.product_barcode,
      status: currentData.status,
      is_enabled_multi_spec: currentData.is_enabled_multi_spec,
      is_enabled_multi_unit: currentData.is_enabled_multi_unit,
      // SKU配置信息
      product_profile_unit_radio_list:
        currentData.product_profile_unit_radio_list || [],
      product_profile_unit_info: currentData.product_profile_unit_info || {},
      product_profile_spec_list: currentData.product_profile_spec_list || [],
      product_info_list: currentData.product_info_list || [],

      // 附加信息
      id: currentData.id,
      product_profile_id: currentData.product_profile_id,
      merchant_id: merchantId.value,
      is_update_config: currentData.is_update_config,
    };
    forms.value.id = currentData.id;
    forms.value.status = currentData.status;

    // 3. 更新ProductSKUForm组件
    nextTick(() => {
      if (productSKUFormRef.value) {
        productSKUFormRef.value.initEditData(skuFormData);
      }
    });

    // 4. 处理文件列表显示
    if (currentData.profile_photo) {
      fileList.value = [{ name: 'profile', url: currentData.profile_photo }];
    }
  } catch (error) {
    console.error('Error initializing edit data:', error);
    ElMessage.error(t('inventory.failedToInitializeEditForm'));
  }
};

const handleDetail = async (currentData) => {
  if (!currentData) {
    ElMessage.error(t('inventory.noProductDataProvided'));
    return;
  }

  try {
    formMode.value = 'view';

    await openDrawer(currentData, false, true, merchantId.value);

    const skuFormData = {
      major_name: currentData.major_name,
      minor_name: currentData.minor_name,
      major_unit_id: currentData.major_unit_id,
      major_unit_name: currentData.major_unit_name,
      cost_price: currentData.cost_price,
      selling_price: currentData.selling_price,
      product_code: currentData.product_code,
      profile_photo: currentData.profile_photo,
      product_barcode: currentData.product_barcode,
      status: currentData.status,

      product_profile_unit_radio_list:
        currentData.product_profile_unit_radio_list || [],
      product_profile_unit_info: currentData.product_profile_unit_info || {},
      product_profile_spec_list: currentData.product_profile_spec_list || [],
      product_info_list: currentData.product_info_list || [],

      id: currentData.id,
      product_profile_id: currentData.product_profile_id,
      merchant_id: merchantId.value,
      is_update_config: currentData.is_update_config,
    };
    forms.value.id = currentData.id;
    forms.value.status = currentData.status;
    nextTick(() => {
      if (productSKUFormRef.value) {
        productSKUFormRef.value.initEditData(skuFormData);
      }
    });
    if (currentData.profile_photo) {
      fileList.value = [{ name: 'profile', url: currentData.profile_photo }];
    }

    showAllFiles.value = true;
  } catch (error) {
    console.error('Error loading product details:', error);
    ElMessage.error(t('inventory.failedToLoadProductDetails'));
  }
};

const handleResetFormMode = () => {
  if (formMode.value === 'copy') {
    formMode.value = 'add';
    emit('reset-form-mode');
  }
};

const handleProductCodesUpdate = ({ barcode, productCode }) => {
  nextTick(() => {
    forms.value.product_barcode = barcode;
    forms.value.product_code = productCode;
    if (ruleFormRef.value) {
      ruleFormRef.value.validateField('product_code');
    }
  });
};

const handleAddUnit = () => {
  if (addWHAndUnitRef.value) {
    addWHAndUnitRef.value.openAddUnit();
  }
};

const handleAddWarehouse = () => {
  if (addWHAndUnitRef.value) {
    addWHAndUnitRef.value.openAddWarehouse();
  }
};

const handleWHUnitSuccess = ({ type, action, data }) => {
  if (type === 'unit') {
    fetchData();
  } else if (type === 'warehouse') {
    fetchData();
  }
};

defineExpose({
  openDrawer: (data, isEdit, isDetail) =>
    openDrawer(data, isEdit, isDetail, merchantId.value),
  handleEdit,
  handleDetail,
});
onMounted(() => {
  fetchData();
});
</script>
<template>
  <div class="coupon-send">
    <ElDrawer
      v-model="isReturnShow"
      :with-header="false"
      direction="rtl"
      size="86%"
      custom-class="coupon-drawer-prevent-send"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      @open="handleDrawerOpen"
    >
      <!-- 关闭 -->
      <div class="close86" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <!-- 弹窗标题 -->
      <div class="drawer-title">
        <p class="title">{{ props.productTitle }}&nbsp;&nbsp;</p>
        <div class="right"></div>
      </div>

      <template v-if="props.productTitle !== 'Add Price Adjustment'">
        <div class="drawer-top">
          <div class="content-form">
            <ElForm :inline="true">
              <ElFormItem
                :label="`${t('inventory.creator')}:`"
                prop="creator_name"
              >
                <p style="color: #f00">
                  {{ userModel?.name }}
                </p>
              </ElFormItem>
            </ElForm>
          </div>
          <div class="drawer-top-buttons">
            <ElButton
              v-if="!newDisabled"
              type="primary"
              plain
              @click="handleSwitchFiles"
            >
              {{
                showAllFiles
                  ? $t('inventory.primary-files')
                  : $t('inventory.show-a-ll-files')
              }}
            </ElButton>
          </div>
        </div>
      </template>

      <div class="drawer-form" style="margin: 10px 75px 0">
        <ElForm
          ref="ruleFormRef"
          class="demo-ruleForm"
          style="min-width: 1100px"
          label-width="160px"
          :model="forms"
          :rules="rules"
          :validate-on-rule-change="false"
          @submit.prevent
        >
          <!-- 基础信息 -->
          <FormSection :title="t('purchase.basicInformaion')">
            <FormRow>
              <ElFormItem
                v-for="(field, index) in basicInfoFields.row1"
                :key="index"
                :label="`${t(field.labelKey)}:`"
                :prop="field.prop"
                :required="field.required"
              >
                <component
                  :is="field.component"
                  v-bind="field.props || {}"
                  v-if="field.prop != 'status'"
                  v-model="forms[field.prop]"
                  maxlength="80"
                  clearable
                  :disabled="newDisabled"
                  :placeholder="t(field.placeholderKey)"
                  @input="(val) => field?.onChange && field?.onChange(val)"
                >
                  <template v-if="field.suffix" #suffix>
                    <ElLink
                      :icon="Refresh"
                      :disabled="newDisabled"
                      @click="refreshCode"
                    />
                  </template>
                  <template v-if="field.prefix" #prefix>
                    {{ getCurrency_symbol }}
                  </template>
                </component>

                <component
                  :is="field.component"
                  v-else
                  v-bind="field.props || {}"
                  v-model="forms[field.prop]"
                  :disabled="
                    newDisabled ||
                    (field.prop === 'major_unit_id' && isMultiUnitsEnabled)
                  "
                  :placeholder="
                    field.placeholderKey ? t(field.placeholderKey) : ''
                  "
                  @change="(val) => field?.onChange && field?.onChange(val)"
                >
                  <template v-if="field.options" #default>
                    <component
                      :is="field.optionComponent || 'el-option'"
                      v-for="(option, i) in field.options"
                      :key="i"
                      :label="t(option.label)"
                      :value="option.value"
                    />
                  </template>
                  <template
                    v-if="
                      field.component === 'el-select' &&
                      field.prop === 'major_unit_id'
                    "
                    #footer
                  >
                    <div
                      style="
                        padding: 8px;
                        text-align: center;
                        cursor: pointer;
                        border-top: 1px solid #ebeef5;
                      "
                      @click="handleAddUnit"
                    >
                      <i class="iconfont icon-tianjia-dianpu"></i>
                      <span style="margin-left: 5px">{{
                        t('inventory.add-unit')
                      }}</span>
                    </div>
                  </template>
                </component>
              </ElFormItem>
            </FormRow>
            <!-- 弃用 -->
            <!-- <FormRow>
              <el-form-item
                :key="index"
                :label="t(field.labelKey) + ':'"
                :prop="field.prop"
                :style="{ display: formMode === 'edit' && field.special == 'warehouse-stock' ? 'none' : 'flex' }"
                :required="field.required"
                v-for="(field, index) in basicInfoFields.row3"
              >
                <template v-if="field.special === 'warehouse-stock' && formMode != 'edit'">
                  <el-select
                    style="width: 100px; background-color: white"
                    :placeholder="t('inventory.please-select-warehouse')"
                    :disabled="shouldDisableInitialStock"
                    v-model="forms.initial_stock_warehouse_id"
                  >
                    <el-option
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                      v-for="(item, index) in warehouseList"
                    />
                    <template #footer>
                      <div
                        style="padding: 8px; text-align: center; cursor: pointer; border-top: 1px solid #ebeef5"
                        @click="handleAddWarehouse"
                      >
                        <i class="iconfont icon-tianjia-dianpu"></i>
                        <span style="margin-left: 5px">{{ t('inventory.add-warehouse') }}</span>
                      </div>
                    </template>
                  </el-select>
                  <el-input
                    class="input-number-control"
                    :controls="false"
                    :disabled="shouldDisableInitialStock || (!isNew ? false : !forms.initial_stock_warehouse_id)"
                    :placeholder="t('inventory.please-enter-initial-stock')"
                    v-input-number="8"
                    v-model="forms.initial_stock_quantity"
                  >
                  </el-input>
                </template>

                <component
                  v-else
                  :is="field.component"
                  :disabled="newDisabled || (field.prop === 'major_unit_id' && isMultiUnitsEnabled)"
                  :placeholder="field.placeholderKey ? t(field.placeholderKey) : ''"
                  v-bind="field.props || {}"
                  v-model="forms[field.prop]"
                  @change="val => field?.onChange && field?.onChange(val)"
                >
                  <template v-if="field.options" #default>
                    <component
                      :is="field.optionComponent || 'el-option'"
                      :key="i"
                      :label="option.label"
                      :value="option.value"
                      v-for="(option, i) in field.options"
                    />
                  </template>
                  <template v-if="field.component === 'el-select' && field.prop === 'major_unit_id'" #footer>
                    <div
                      style="padding: 8px; text-align: center; cursor: pointer; border-top: 1px solid #ebeef5"
                      @click="handleAddUnit"
                    >
                      <i class="iconfont icon-tianjia-dianpu"></i>
                      <span style="margin-left: 5px">{{ t('inventory.add-unit') }}</span>
                    </div>
                  </template>
                </component>
              </el-form-item>
              <template v-if="formMode === 'edit'">
                <el-form-item></el-form-item>
                <el-form-item></el-form-item>
              </template>
              <el-form-item v-else></el-form-item>
            </FormRow> -->
          </FormSection>

          <!-- 隐藏的字段 特殊结构字段-->
          <template v-if="showAllFiles">
            <div class="form-row">
              <div class="el-form-item-two">
                <ElFormItem
                  :label="$t('customers.profile_photo')"
                  prop="profile_photo"
                  style="flex: 1; min-width: 280px"
                  class="profile-photo"
                >
                  <div class="upload-box upload-background">
                    <ElUpload
                      class="custom-upload"
                      list-type="picture-card"
                      :file-list="fileList"
                      :http-request="customUpload"
                      :before-upload="beforeUpload"
                      :on-remove="handleRemove"
                      :on-preview="handlePictureCardPreview"
                      :limit="1"
                      :headers="{
                        'Content-Type': 'multipart/form-data',
                      }"
                      :disabled="newDisabled"
                    >
                      <div v-if="!newDisabled" class="upload-content">
                        <span>{{ $t('inventory.upload-image') }}</span>
                      </div>
                    </ElUpload>
                    <ElDialog v-model="dialogVisible">
                      <img
                        w-full
                        :src="dialogImageUrl"
                        alt="Preview Image"
                        style="width: 90%; height: 90%; margin: 0 auto"
                      />
                    </ElDialog>
                  </div>
                </ElFormItem>
              </div>
              <div class="el-form-item-two">
                <ElFormItem
                  class="specific-el-form-item"
                  :label="`${t('inventory.product-name-minor')}:`"
                  prop="minor_name"
                >
                  <ElInput
                    v-model="forms.minor_name"
                    maxlength="80"
                    :disabled="newDisabled"
                    :placeholder="t('inventory.please-input-product-minor-name')"
                  />
                </ElFormItem>

                <ElFormItem
                  :label="`${t('inventory.product-lable')}:`"
                  prop="product_label_id_list"
                >
                  <div class="moveSelect_tag">
                    <ElSelect
                      v-model="forms.product_label_id_list"
                      multiple
                      clearable
                      collapse-tags
                      :disabled="newDisabled || formMode === 'view'"
                      :placeholder="t('inventory.please-select-product-lable')"
                      :max-collapse-tags="2"
                      popper-class="custom-header"
                    >
                      <ElOption
                        v-for="(item, index) in productLabelList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </ElSelect>
                  </div>
                </ElFormItem>
              </div>
              <div class="el-form-item-two">
                <ElFormItem
                  class="specific-el-form-item"
                  :label="`${t('inventory.vendor')}:`"
                  prop="vendor_id"
                >
                  <ElSelect
                    v-model="forms.vendor_id"
                    :placeholder="t('inventory.please-select-vendor')"
                    filterable
                    :filter-method="handleVendorSearch"
                    :disabled="newDisabled"
                  >
                    <ElOption
                      v-for="(item, index) in vendorListName"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </ElSelect>
                </ElFormItem>
                <ElFormItem
                  :label="`${t('inventory.spec')}:`"
                  prop="product_spec_model"
                  style="flex: 1; min-width: 280px"
                >
                  <ElInput
                    v-model="forms.product_spec_model"
                    v-rpSymbol
                    maxlength="64"
                    :disabled="newDisabled"
                    :placeholder="t('inventory.please-enter-spec')"
                  />
                </ElFormItem>
              </div>
            </div>

            <div class="form-row">
              <ElFormItem
                :label="`${t('inventory.product-group')}:`"
                prop="product_group_id"
              >
                <ElSelect
                  v-model="forms.product_group_id"
                  :placeholder="t('inventory.please-select-product-group')"
                  :disabled="newDisabled"
                  filterable
                  :filter-method="handleProductGroupSearch"
                >
                  <ElOption
                    v-for="(item, index) in productGroupList"
                    :key="index"
                    :label="item.major_name"
                    :value="item.id"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem :label="`${t('common.vat')}:`">
                <ElInput
                  v-model="taxRate"
                  class="group-resize"
                  :disabled="!forms.tax_vat_id || newDisabled"
                  :placeholder="t('inventory.please-enter-tax-rate')"
                >
                  <template #prepend>
                    <ElSelect
                      v-model="forms.tax_vat_id"
                      style="width: 100px"
                      :disabled="newDisabled"
                    >
                      <ElOption
                        v-for="(item, index) in vatList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </ElSelect>
                  </template>
                </ElInput>
              </ElFormItem>

              <ElFormItem :label="`${t('inventory.excis-duty')}:`">
                <ElInput
                  v-model="taxExciseRate"
                  :disabled="!forms.tax_excise_id || newDisabled"
                  :placeholder="t('inventory.please-enterxcis-duty')"
                >
                  <template #prepend>
                    <ElSelect
                      v-model="forms.tax_excise_id"
                      style="width: 100px"
                      :disabled="true"
                    >
                      <ElOption
                        v-for="(item, index) in otherTaxList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </ElSelect>
                  </template>
                </ElInput>
              </ElFormItem>
            </div>
          </template>

          <!--  共享库存-->
          <template v-if="showAllFiles">
            <div class="form-row">
              <ElFormItem :label="`${t('common.other-tax')}:`">
                <ElInput
                  v-model="otherTaxRate"
                  :disabled="!forms.tax_other_id || newDisabled"
                  :placeholder="t('inventory.please-enterother-tax')"
                >
                  <template #prepend>
                    <ElSelect
                      v-model="forms.tax_other_id"
                      style="width: 100px"
                      :disabled="true"
                    >
                      <ElOption
                        v-for="(item, index) in otherTaxList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </ElSelect>
                  </template>
                </ElInput>
              </ElFormItem>

              <ElFormItem />
              <ElFormItem />
            </div>
          </template>
          <!-- 单位配置&多规格 -->
          <ProductSKUForm
            ref="productSKUFormRef"
            :visible="isReturnShow"
            :show-units="isShowSKU"
            :product-data="forms"
            :warehouse-list="warehouseList"
            :unit-list="unitList"
            :mode="formMode"
            @update:multi-status="(status) => (isMultiSpecsOrUnits = status)"
            @update:multi-units="(status) => (isMultiUnitsEnabled = status)"
            @update:spec-bundle="updateSpecBundleStatus"
            @reset-form-mode="handleResetFormMode"
            @update:product-codes="handleProductCodesUpdate"
            @add-unit="handleAddUnit"
            @add-warehouse="handleAddWarehouse"
          />
          <!-- 动态字段 -->
          <FormSection
            v-if="res_options.length > 0"
            :title="t('product-list.customized-information')"
          >
            <div
              v-if="res_options.length > 0"
              class="list-box-content form-row"
            >
              <FormRow
                v-for="(chunk, chunkIndex) in chunkedOptions"
                :key="chunkIndex"
              >
                <template v-for="(item, itemIndex) in chunk" :key="itemIndex">
                  <ElFormItem
                    v-if="item.type === 'SELECT' && item.isSelect"
                    :label="`${item.label}:`"
                    :prop="item.prop"
                    :rules="rules[item.prop]"
                    :required="item.required"
                    :validate-on-blur="false"
                    :validate-on-change="false"
                  >
                    <div class="res_options_box" style="display: flex">
                      <ElSelect
                        v-model="forms[item.prop]"
                        :placeholder="`${t('common.select')} ${item.label}`"
                        :disabled="newDisabled"
                        style="width: 100%"
                        @change="(value) => updateDynamicData(item, value)"
                      >
                        <ElOption
                          v-for="(option, optionIndex) in parseOptions(
                            item.options,
                          )"
                          :key="optionIndex"
                          :label="option"
                          :value="option"
                        />
                      </ElSelect>
                      <ElButton
                        v-if="item.is_fixed_option && !newDisabled"
                        class="outer-btn right-box"
                        style="height: 32px; margin-right: 0; margin-left: 4px"
                        @click="openAddOptionDialog(item)"
                      >
                        <div class="outer">
                          <div class="inner-left">
                            <i class="iconfont icon-tianjia-dianpu"></i>
                          </div>
                          <div class="inner-right">
                            <span>{{ t('employee.addButton') }}</span>
                          </div>
                        </div>
                      </ElButton>
                    </div>
                  </ElFormItem>

                  <ElFormItem
                    v-if="item.type === 'INPUT' && item.isSelect"
                    :label="`${item.label}:`"
                    :prop="item.prop"
                    :rules="rules[item.prop]"
                    :required="item.required"
                    :validate-on-blur="false"
                    :validate-on-change="false"
                  >
                    <ElInput
                      v-model="forms[item.prop]"
                      v-rpSymbol
                      maxlength="64"
                      :disabled="newDisabled"
                      :placeholder="`${t('common.enter')} ${item.label}`"
                      @input="(value) => updateDynamicData(item, value)"
                    />
                  </ElFormItem>
                </template>
              </FormRow>
            </div>
          </FormSection>

          <!-- 其他信息 -->
          <template v-if="showAllFiles">
            <div class="list-box-title">
              {{ t('product-list.other-information') }}
            </div>

            <div class="form-row">
              <ElFormItem
                align="right"
                :label="`${t('inventory.product-description-major')}:`"
                prop="major_description"
              >
                <ElInput
                  v-model="forms.major_description"
                  v-rpSymbol
                  type="textarea"
                  show-word-limit
                  maxlength="256"
                  :disabled="newDisabled"
                  :placeholder="
                    t('inventory.please-enter-product-description-major')
                  "
                />
              </ElFormItem>

              <ElFormItem
                align="right"
                :label="`${t('inventory.product-description-minor')}:`"
                prop="minor_description"
              >
                <ElInput
                  v-model="forms.minor_description"
                  v-rpSymbol
                  type="textarea"
                  show-word-limit
                  maxlength="256"
                  :disabled="newDisabled"
                  :placeholder="
                    t('inventory.please-enter-product-description-minor')
                  "
                />
              </ElFormItem>

              <ElFormItem :label="`${t('inventory.remark')}:`" prop="remark">
                <ElInput
                  v-model="forms.remark"
                  v-rpSymbol
                  type="textarea"
                  show-word-limit
                  maxlength="128"
                  :disabled="newDisabled"
                  :placeholder="t('inventory.please-enter-remark')"
                />
              </ElFormItem>
            </div>
          </template>
        </ElForm>
      </div>

      <!-- 修改按钮容器，仅在非禁用模式显示保存按钮 -->
      <div class="btn-box">
        <ElButton class="cancel-btn" @click="handleClose">
          {{ t('inventory.cancel') }}
        </ElButton>
        <ElButton
          v-if="!newDisabled"
          class="save-btn"
          @click="handleInputDebounced"
        >
          {{ t('inventory.save') }}
        </ElButton>
      </div>
    </ElDrawer>

    <ElDialog
      v-model="addOptionDialogVisible"
      :title="t('purchase.addSelecctionOption')"
      width="500"
      align-center
      :before-close="closeAddOptionDialog"
    >
      <ElInput
        v-model="newOption"
        v-rpSymbol
        maxlength="64"
        :placeholder="t('purchase.enterNewOption')"
      />
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="closeAddOptionDialog">
            {{ t('inventory.cancel') }}
          </ElButton>
          <ElButton type="primary" @click="addOption">
            {{ t('inventory.save') }}
          </ElButton>
        </div>
      </template>
    </ElDialog>

    <AddWHAndUnit ref="addWHAndUnitRef" @success="handleWHUnitSuccess" />
  </div>
</template>
<style lang="scss" scoped>
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  margin-bottom: 10px;

  .el-form-item {
    flex: 1;
    min-width: 280px;
    margin-bottom: 10px;
  }

  .specific-el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item-two {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}

@media screen and (max-width: 1150px) {
  .form-row {
    flex-direction: column;
    // width: 500px;
  }
}
</style>

<style lang="scss" scoped>
.res_options_box {
  width: 100%;
}

.group-resize {
  :deep(.el-input-group__prepend) {
    background-color: transparent;
  }
}

.drawer-title {
  height: 112px;
  padding-top: 25px;
  padding-left: 50px;
  text-align: left;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 24px;

    .icon-bangzhu {
      color: #7d90b2;
    }
  }
}

.drawer-top {
  display: flex;
  justify-content: space-between;
  margin: 27px 0 0;

  .drawer-top-buttons {
    padding-right: 20px;
  }
  //border-bottom: 1px solid #e2e7f5;
}

.drawer-content {
  margin-top: 28px;
  margin-left: 59px;
  font-size: 16px;

  .content-btn {
    display: flex;
    justify-content: space-between;

    .field-btn {
      color: #fff;
      background-color: #005cff;
    }
  }

  .content-table-list {
    margin-top: 7px;
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.drawer-title {
  font-size: 24px;
  font-weight: bold;
}

.returned-add {
  margin-bottom: 4px;
  margin-left: 16px;
  color: #fff;
  background-color: #005cff;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 85px;
}

:deep(.custom-upload .upload-content span) {
  font-size: 12px;
}

.profile-photo :deep(.el-upload-list__item) {
  width: 85px;
  height: 85px;
}
</style>
