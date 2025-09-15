<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRow,
  ElSelect,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { debounce } from '@igourd/utils';

import { PurchaseServiceOrder, WarehouseService } from '@@/purchase/apis';
import { useOrderForm } from '@@/purchase/hooks';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';

import {
  CurrencySelect,
  ProductTable,
  ThousandsInput,
  UploadFiles,
} from '#/components';
import { formatNumber, handleGlobalDownload } from '#/utils';

const props = defineProps({
  drawerAddShow: {
    type: Boolean,
    default: false,
  },
  returnAddTitleProp: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close-tkr', 'onSubmit']);
const { Drawer } = useOrderForm();
const { userModel, currencySymbol } = storeToRefs(useUserStore());
const { t } = useI18n();
const isReturnShow = ref(false);

const productTableRef = ref(null);
const handleDownload = (file) => {
  handleGlobalDownload(file);
};

const rules = computed(() => {
  return {
    warehouse_id: {
      required: true,
      message: t('purchase.pleaseWarehouse'),
      trigger: 'change',
    },
    purchase_date: {
      required: true,
      message: t('purchase.pleasePurchaseDate'),
      trigger: 'change',
    },
    vat_configuration: {
      required: true,
      message: t('purchase.pleaseVatConfiguration'),
      trigger: 'change',
    },
    currency_code: {
      required: true,
      message: t('purchase.pleaseCurrencyCode'),
      trigger: 'change',
    },
    deposit_amount: {
      required: true,
      message: t('purchase.inputDeposit'),
      trigger: 'change',
    },
  };
});

const ruleForm = ref();

const handleUploadFiles = (fileList) => {
  form.value.attachment_url = fileList.url;
};

const uploadFilesRef = ref();

// 保存提交
const onSubmit = async () => {
  const isValidate = await ruleForm.value.validate().catch(() => false);
  if (!isValidate) return;
  // 供应商必选
  if (!form.value.vendor_id) {
    ElMessage.warning(t('purchase.pleaseSelectMerchant'));
    return;
  }
  // 订金不能超过采购总金额
  if (form.value.deposit_amount > form.value.total_amount) {
    ElMessage.warning(t('purchase.despositAmountCannotGreaterThanTotalAmount'));
    return;
  }
  // 检查是否有重复商品
  const { hasDuplicates } = productTableRef?.value?.checkDuplicateProducts();
  if (hasDuplicates) {
    ElMessage.warning(t('common.product_repeat_exist'));
    return;
  }

  // 检查是否所有商品都已选择
  const hasUnselectedProduct = form.value.purchase_order_iterm_list.some(
    (item) => !item.product_id,
  );

  if (hasUnselectedProduct) {
    ElMessage.warning(t('inventory.pleaseSelectProduct'));
    return;
  }

  // 检查是否所有字段都已填写
  const hasEmptyFields =
    Array.isArray(form.value.purchase_order_iterm_list) &&
    form.value.purchase_order_iterm_list.some((item) => {
      return !item.quantity;
    });

  if (hasEmptyFields) {
    ElMessage.warning(t('inventory.pleaseFillInAllRequiredFields'));
    return;
  }

  const parms = { ...form.value };
  parms.purchase_order_iterm_list.forEach((item: any) => {
    item.subtotal_amount = (item.quantity * item.cost_price).toFixed(2);
  });
  const total = parms.purchase_order_iterm_list.reduce(
    (acc: any, item: any) => acc + item.quantity * item.cost_price,
    0,
  );
  parms.subtotal_amount = total.toFixed(2);
  parms.total_amount = total.toFixed(2);
  const api = await (props.id
    ? PurchaseServiceOrder.purchaseOrderUpdate(parms)
    : PurchaseServiceOrder.purchaseOrderCreate(parms));
  if (api.code === 'SUCCESS') {
    ElMessage.success(api.message);
    isReturnShow.value = false;
    resetForm();
    warehousActive.value = {};
    emit('onSubmit');
  } else if (api.code == 'ILLEGAL_ARGUMENT_ERROR') {
    ElMessage.error(api.message);
  }
};
// 选择仓库带出默认选项
const warehousActive: any = ref({});

const warehouseChange = (val: any) => {
  warehousActive.value = warehouseList?.value?.find(
    (warehouse: any) => warehouse.id === val,
  );
  form.value.currency_code = warehousActive.value.currency_code;
  form.value.exchange_rate = warehousActive.value.exchange_rate;
};

// 添加参数
const form: any = ref({
  currency_code: '',
  discount_amount: 0,
  discount_percentage: 0,
  attachment_url: '',
  exchange_rate: null,
  merchant_id: null,
  other_tax_amount: 0,
  purchase_date: '',
  deposit_amount: 0,
  attachment_name: '',
  purchase_order_iterm_list: [
    {
      cost_price: null,
      discount_amount: null,
      discount_percentage: 0,
      other_tax_amount: null,
      product_code: '',
      product_id: null,
      product_name: '',
      product_unit_name: '',
      product_unit_id: '',
      quantity: 0,
      remark: '',
      subtotal_amount: null,
      total_amount: null,
      vat_amount: null,
      sub_product_stock_search_models: [],
      display_product: {},
    },
  ],
  purchase_order_no: '',
  remark: '',
  subtotal_amount: 0,
  total_amount: 0,
  vat_amount: 0,
  vat_configuration: 'NOT_APPLICATION',
  vendor_id: null,
  warehouse_id: null,
});
const calculateDeposit = (val: null | number) => {
  if (val === null) {
    form.value.deposit_amount = null;
    return;
  }

  form.value.deposit_amount =
    form.value.total_amount && val > form.value.total_amount
      ? form.value.total_amount
      : val;
};
// Vat
const vatList = ref([
  {
    id: 'NOT_APPLICATION',
    name: 'not_applicable',
  },
  {
    id: 'VAT_INCLUSIVE',
    name: 'VAT_inclusive',
  },
  {
    id: 'VAT_EXCLUSIVE',
    name: 'VAT_exclusive',
  },
]);

// 货币查询
const currencyActive: any = ref({});
const currencyChange = (val: any) => {
  form.value.exchange_rate = 1; // Set fixed exchange rate to 1
  form.value.currency_code = val.code;
  form.value.display_currency = `${val.code} ${val.currencyData?.symbol || ''}`;
  form.value.display_exchange_rate = `${form.value.exchange_rate} ${val.currencyData?.symbol || ''}`;
};

// 获取全部的供应商列表
const warehouseParms = ref({
  page_num: 1,
  page_size: 30,
  keywords: '',
});
const warehouseList: any = ref([]);

const getPurchaseVendorPageList = () => {
  const parms = { ...warehouseParms.value };
  PurchaseServiceOrder.purchaseVendorPageList(parms).then((res) => {
    warehouseList.value = res.data.list;
  });
};

const filterVender = debounce((query: string) => {
  if (!query.trim()) return;
  warehouseParms.value.keywords = query;
  getPurchaseVendorPageList();
}, 300);

// 获取供应商列表
const venderParms: any = ref({
  keywords: '',
});
const venderList = ref([] as any);
const getInventoryWarehouse = () => {
  const parms = { ...venderParms.value };
  WarehouseService.warehouseList(parms).then((res) => {
    venderList.value = res.data;
  });
};
const filterWarehouse = debounce((query: string) => {
  if (!query.trim()) return;
  venderParms.value.keywords = query;
  getInventoryWarehouse();
}, 300);

const handleCalculationsUpdated = (calculations) => {
  // Update the form with the calculated values
  form.value.subtotal_amount = calculations.subtotal_amount;
  form.value.vat_amount = calculations.vat_amount;
  form.value.other_tax_amount = calculations.other_tax_amount;
  form.value.discount_amount = calculations.discount_amount;
  form.value.total_amount = calculations.total_amount;

  avertDepositErr();
};

const getVatConfiguration = (val: any) => {
  form.value.vat_configuration = val;
};

const avertDepositErr = debounce(() => {
  if (form.value.deposit_amount > form.value.total_amount) {
    form.value.deposit_amount = form.value.total_amount;
  }
}, 500);

const getDetail = () => {
  PurchaseServiceOrder.purchaseOrderDetail({
    purchase_order_no: props.id,
  }).then((res) => {
    form.value = res.data;
    form.value.currency_code = res.data.currency_code;
    form.value.remark = res.data.remark;

    currencyActive.value = res.data.currency_code;
    form.value.exchange_rate = currencyActive.value.exchange_rate;
    form.value.currency_code = currencyActive.value.code;
    form.value.display_currency = `${currencyActive.value.code} ${currencyActive.value?.symbol || ''}`;
    form.value.display_exchange_rate = `${form.value.exchange_rate} ${currencyActive.value?.symbol || ''}`;

    form.value.purchase_order_iterm_list =
      res.data.purchase_order_item_model_list;

    form.value.purchase_order_iterm_list.forEach((item: any, index: number) => {
      item.product_unit_code =
        res.data.purchase_order_item_model_list[index].product_unit_name;
      item.display_major_name = `${res.data.purchase_order_item_model_list[index].major_name}${res.data.purchase_order_item_model_list[index].product_spec_kvmessage ? `-${res.data.purchase_order_item_model_list[index].product_spec_kvmessage}` : ''}`;
      item.quantity = res.data.purchase_order_item_model_list[index].quantity;
    });

    form.value.total_amount =
      form.value.total_amount +
      form.value.vat_amount +
      form.value.other_tax_amount;

    // calculateTotals(form);
  });
};
// getDetail();
</script>

<template>
  <Drawer>
    <div class="purchase-order-add">
      <div class="drawer-top">
        <div class="content-form">
          <ElForm :inline="true">
            <ElFormItem :label="$t('common.creator')" prop="creator">
              <p class="text-scarlet">
                {{ userModel?.name }}
              </p>
            </ElFormItem>
          </ElForm>
        </div>
      </div>
      <div class="drawer-form">
        <div class="content-center">
          <ElRow :gutter="30">
            <ElCol :span="11">
              <div class="box-shaw">
                <div class="select-vender">
                  <div class="select-box">
                    <p>{{ $t('purchase.selectVendor') }}</p>
                    <ElSelect
                      v-model="form.vendor_id"
                      class="styleVariant"
                      filterable
                      clearable
                      :placeholder="$t('purchase.pleaseSelectVendor')"
                      popper-class="select-popper"
                      :filter-method="filterVender"
                      @change="warehouseChange"
                    >
                      <ElOption
                        v-for="(item, index) in warehouseList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </ElSelect>
                  </div>
                  <!-- <el-button class="outer-btn32 search-btn" @click="handleAddVendor">
                    <div class="outer">
                      <div class="inner-left">
                        <i class="iconfont icon-tianjia-dianpu"></i>
                      </div>
                      <div class="inner-right">
                        <span> {{ $t('employee.addButton') }}</span>
                      </div>
                    </div>
                  </el-button> -->
                </div>
                <!-- 选择的供应商详情 -->
                <div v-if="warehousActive?.name" class="active-warehouse-box">
                  <div>
                    <p>
                      {{ $t('purchase.venderName') }}：{{ warehousActive.name }}
                    </p>
                    <!-- <p>{{ $t('purchase.address') }}：{{ warehousActive.address }}</p> -->
                  </div>
                  <div>
                    <p>
                      {{ $t('purchase.contactName') }}：{{
                        warehousActive.contact_name
                      }}
                    </p>
                    <p>
                      {{ $t('purchase.phoneNumber') }}：{{
                        warehousActive.contact_telephone
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </ElCol>
            <ElCol :span="13">
              <ElForm
                ref="ruleForm"
                :model="form"
                label-width="140px"
                :rules="rules"
                label-position="top"
                :inline="true"
                @submit.prevent
              >
                <ElRow :gutter="20">
                  <ElCol :span="8">
                    <ElFormItem
                      :label="$t('purchase.selectWarehouse')"
                      required
                      prop="warehouse_id"
                    >
                      <ElSelect
                        v-model="form.warehouse_id"
                        filterable
                        clearable
                        :filter-method="filterWarehouse"
                        :placeholder="$t('purchase.pleaseSelectWarehouse')"
                      >
                        <ElOption
                          v-for="(item, index) in venderList"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="8">
                    <ElFormItem
                      :label="$t('purchase.date')"
                      required
                      prop="purchase_date"
                    >
                      <ElDatePicker
                        v-model="form.purchase_date"
                        class="commonHeight"
                        style="width: 100% !important; height: 32px !important"
                        type="date"
                        format="YYYY-MM-DD "
                        :placeholder="$t('purchase.pleaseSelectDate')"
                        value-format="YYYY-MM-DD"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="8">
                    <ElFormItem
                      :label="$t('purchase.vat')"
                      required
                      prop="vat_configuration"
                    >
                      <ElSelect
                        v-model="form.vat_configuration"
                        filterable
                        clearable
                        placeholder=""
                        @change="getVatConfiguration"
                      >
                        <ElOption
                          v-for="(item, index) in vatList"
                          :key="index"
                          :label="t(`purchase.${item.name}`)"
                          :value="item.id"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="8">
                    <ElFormItem
                      :label="$t('purchase.currency')"
                      required
                      prop="currency_code"
                    >
                      <!-- <el-input v-model="form.display_exchange_rate" clearable disabled> -->
                      <CurrencySelect
                        :default-value="form.currency_code"
                        :default-input-value="form.display_exchange_rate"
                        :disabled-input="true"
                        @change="currencyChange"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="8">
                    <ElFormItem
                      class="deposit"
                      :label="$t('purchase.deposit')"
                      required
                      prop="deposit_amount"
                    >
                      <!-- <el-input v-model="form.deposit_amount" class="commonHeight" clearable> -->
                      <ThousandsInput
                        v-model="form.deposit_amount"
                        class="commonHeight"
                        clearable
                        :placeholder="$t('purchase.inputDeposit')"
                        @change="calculateDeposit"
                      />
                      <!-- </el-input> -->
                    </ElFormItem>
                  </ElCol>
                  <!-- <el-col :span="8"
                    ><el-form-item label="Discount:" required>
                      <el-input v-model="form.discount_amount" /> </el-form-item
                  ></el-col> -->
                </ElRow>
              </ElForm>
            </ElCol>
          </ElRow>
        </div>
        <div class="content-btn">
          <p>{{ $t('purchase.products') }}</p>
        </div>
        <div class="content-table-list">
          <ProductTable
            ref="productTableRef"
            v-model:product-list="form.purchase_order_iterm_list"
            :vat-configuration="form.vat_configuration"
            type="purchase"
            @calculations-updated="handleCalculationsUpdated"
          />
        </div>
        <div class="content-textarea">
          <p class="content-textarea-remark-title">
            {{ $t('purchase.remark') }}
          </p>
          <div class="textarea-left">
            <ElInput
              v-model="form.remark"
              v-rpSymbol
              :rows="2"
              type="textarea"
              maxlength="128"
              show-word-limit
              :placeholder="$t('common.enterRemark')"
            />
            <div class="count-box">
              <p>
                {{ t('purchase.subtotal') }}:
                {{ formatNumber(Number(form.subtotal_amount) || 0) }}
              </p>
              <p>
                {{ `${t('purchase.VAT')}(${currencySymbol}): `
                }}{{ formatNumber(Number(form.vat_amount) || 0) }}
              </p>
              <p>
                {{ `${t('purchase.other_tax')}(${currencySymbol}): `
                }}{{ formatNumber(Number(form.other_tax_amount) || 0) }}
              </p>
              <p>
                {{ t('purchase.total') }}:
                {{ formatNumber(Number(form.total_amount) || 0) }}
              </p>
            </div>
          </div>
          <div class="textarea-right"></div>
        </div>
        <div class="content-output">
          <p class="content-textarea-remark-title">
            {{ t('common.Attachment') }}
          </p>
          <UploadFiles
            ref="uploadFilesRef"
            :limit="1"
            :disabled="props.isDisabled"
            @handle-upload-files="handleUploadFiles"
          />
          <div class="drawer-content-table-attachment">
            <div v-if="form.attachment_name" class="download-files">
              <span class="download-file-item"><i class="iconfont icon-icon_details icon-icon_details-red"></i>{{ form.attachment_name }}</span>
              <el-link type="primary" @click="handleDownload(form)">
                <i class="iconfont icon-import icon-icon_details-import"></i>
              </el-link>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box gap-2">
        <el-button class="cancel-btn" @click="handleClose">
          {{ $t('purchase.cancel') }}
        </el-button>
        <el-button :button-props="{ class: 'save-btn', onClick: onSubmit }">
          {{ $t('purchase.save') }}
        </el-button>
      </div>
    </div>
  </Drawer>
</template>
<style lang="scss" scoped>
.rate-option {
  min-width: 200px;
}

.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.barcode-input {
  display: flex;
  align-items: center;

  .el-input {
    flex: 1;
  }

  .el-button {
    margin-left: 10px;
  }
}

.content-output {
  width: 600px;
  padding: 3px;
}

.download-files {
  display: flex;
  justify-content: space-between;
  background-color: #f5f7fa;

  .download-file-item {
    color: skyblue;
  }

  .icon-icon_details-red {
    margin: 0 10px;
    font-size: 14px;
  }

  .icon-icon_details-import {
    margin: 0 10px;
  }
}

:deep(.el-select .el-input__validateIcon) {
  display: none !important;
}

.display-money {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

:deep(.el-select__wrapper.is-filterable) {
  height: 32px;
}

.commonHeight {
  height: 32px !important;
}
// :deep(el-input__wrapper)
.upload-document {
  width: 50%;

  .el-upload-dragger {
    background: #ecf5ff;
  }
}

.money-type {
  .el-select-dropdown__item {
    padding: 0 10px;
  }

  .money-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
    font-size: 14px;

    .iconfont {
      font-size: 14px;
    }
  }
}

.purchase-order-add {
  .el-date-editor.el-input,
  .el-date-editor.el-input__wrapper {
    width: 100%;
  }
}

.el-form--default.el-form--label-top .el-form-item .el-form-item__label {
  white-space: nowrap;
}

.el-input-group__prepend div.el-select .el-input__wrapper {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.content-textarea-remark-title {
  p {
    line-height: 32px;
  }
}

.product-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.box-shaw {
  padding: 10px;
  box-shadow:
    -1px -1px 10px 0 #f6f6f6,
    1px 2px 10px 0 #e3edff;
}

.active-warehouse-box {
  margin-top: 15px;
  font-size: 12px;

  div {
    display: flex;

    &:nth-of-type(1) {
      padding-bottom: 7px;
      margin-bottom: 7px;
      border-bottom: 1px dashed #eee;
    }

    p {
      flex: 1;
    }
  }
}

.textarea-left {
  display: flex;
  align-items: center;

  .el-textarea {
    flex: 1;
  }

  .count-box {
    width: 150px;
    margin-left: 17px;
    font-size: 12px;
  }
}

.el-form--inline.el-form--label-top .el-form-item {
  margin-right: 0;
}

.el-col-13 {
  .el-form--inline.el-form--label-top {
    display: block;
    width: 100%;
  }
}

.select-vender {
  display: flex;
  align-items: end;
  justify-content: space-between;

  .select-box {
    flex: 1;

    p {
      margin-bottom: 5px;
      color: #616367;
    }
  }

  :deep(.el-select__wrapper) {
    height: 32px;
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
  margin: 27px 0 0;

  .content-form {
    border-bottom: 1px solid #e2e7f5;
  }
}

.drawer-form {
  font-size: 16px;

  .content-btn {
    display: flex;
    justify-content: space-between;

    .field-btn {
      color: #fff;
      background-color: #005cff;
    }

    p {
      line-height: 32px;
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
  margin-left: 16px;
  color: #fff;
  background-color: #005cff;
}
</style>
