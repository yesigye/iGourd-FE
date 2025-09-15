<script setup lang="ts">
import type { PurchaseOrderForm, Vendor } from '../../../types';

import {
  ElCol,
  ElDatePicker,
  ElFormItem,
  ElOption,
  ElRow,
  ElSelect,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { CurrencySelect, ThousandsInput } from '#/components';

defineProps<{
  form: PurchaseOrderForm;
  vatList: { id: string; name: string }[];
  warehouseOptions: Vendor[]; // warehouses
}>();

const emits = defineEmits<{
  (e: 'filterWarehouse', q: string): void;
  (e: 'vatChange', v: any): void;
  (e: 'currencyChange', v: any): void;
  (e: 'depositChange', v: null | number): void;
}>();

const { t } = useI18n();

function onFilterWarehouse(q: string) {
  emits('filterWarehouse', q);
}
function onVat(v: any) {
  emits('vatChange', v);
}
function onCurrency(v: any) {
  emits('currencyChange', v);
}
function onDeposit(v: null | number) {
  emits('depositChange', v);
}
</script>

<template>
  <ElRow :gutter="20">
    <ElCol :span="8">
      <ElFormItem
        :label="t('purchase.selectWarehouse')"
        required
        prop="warehouse_id"
      >
        <ElSelect
          v-model="form.warehouse_id"
          filterable
          clearable
          :filter-method="onFilterWarehouse"
          :placeholder="t('purchase.pleaseSelectWarehouse')"
        >
          <ElOption
            v-for="(item, index) in warehouseOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
    </ElCol>

    <ElCol :span="8">
      <ElFormItem :label="t('purchase.date')" required prop="purchase_date">
        <ElDatePicker
          v-model="form.purchase_date"
          class="commonHeight"
          style="width: 100% !important; height: 32px !important"
          type="date"
          format="YYYY-MM-DD "
          :placeholder="t('purchase.pleaseSelectDate')"
          value-format="YYYY-MM-DD"
        />
      </ElFormItem>
    </ElCol>

    <ElCol :span="8">
      <ElFormItem :label="t('purchase.vat')" required prop="vat_configuration">
        <ElSelect
          v-model="form.vat_configuration"
          filterable
          clearable
          placeholder=""
          @change="onVat"
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
      <ElFormItem :label="t('purchase.currency')" required prop="currency_code">
        <CurrencySelect
          :default-value="form.currency_code"
          :default-input-value="form.display_exchange_rate"
          :disabled-input="true"
          @change="onCurrency"
        />
      </ElFormItem>
    </ElCol>

    <ElCol :span="8">
      <ElFormItem
        class="deposit"
        :label="t('purchase.deposit')"
        prop="deposit_amount"
      >
        <ThousandsInput
          v-model="form.deposit_amount"
          class="commonHeight"
          clearable
          :placeholder="t('purchase.inputDeposit')"
          @change="onDeposit"
        />
      </ElFormItem>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.commonHeight {
  height: 32px !important;
}
</style>
