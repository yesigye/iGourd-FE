<template>
  <div class="count-box">
    <p>
      {{ t('purchase.subtotal') }}:
      {{ formatNumber(Number(form.subtotal_amount) || 0) }}
    </p>
    <p>
      {{ `${t('purchase.VAT')}` }}:
      {{ formatNumber(Number(form.vat_amount) || 0) }}
    </p>
    <p>
      {{ `${t('purchase.other_tax')}` }}:
      {{ formatNumber(Number(form.other_tax_amount) || 0) }}
    </p>
    <p>
      {{ t('purchase.total') }}:
      {{ formatNumber(Number(form.total_amount) || 0) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseOrderForm } from '../../../types';
import { useI18n } from '@igourd/locales';
import { formatNumber } from '#/utils/functions';

const { t } = useI18n();

defineProps<{ form: PurchaseOrderForm }>();
</script>

<style scoped>
.count-box {
  display: grid;
  gap: 6px;
}
</style>
