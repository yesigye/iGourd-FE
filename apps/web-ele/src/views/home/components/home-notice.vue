<script setup lang="ts">
import { useRouter } from 'vue-router';

import {
  ElCol,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElRow,
} from '@igourd/common-ui';
import { ArrayDown, ArrowRight } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import warningIcon from '#/assets/home/warning.svg';
import { thousandSeparator } from '#/utils/sale';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  currencySymbol: {
    type: String,
    default: '',
  },
});
const { t } = useI18n();
const router = useRouter();
const handleGoHandle = (path: string) => {
  router.push(path);
};
</script>
<template>
  <ElRow :gutter="10">
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FEF0F0] p-4">
        <div class="min-w-0 flex-1">
          <ElDropdown>
            <div class="flex items-center gap-1">
              <span> {{ t('home.stock-alert-min-stock') }} </span>
              <div><ArrayDown /></div>
            </div>

            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  {{ t('home.stock-alert-min-stock') }}
                </ElDropdownItem>
                <ElDropdownItem>
                  {{ t('home.stock-alert-safety-stock') }}
                </ElDropdownItem>
                <ElDropdownItem>
                  {{ t('home.stock-alert-max-stock') }}
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>

          <div class="mt-2 font-bold">
            {{ thousandSeparator(props?.data?.warning_product_quantity ?? 0) }}
          </div>
          <div
            class="mt-3 flex cursor-pointer items-center gap-1 text-[#F56C6C]"
            @click="handleGoHandle('/inventory/stock-warning-table')"
          >
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FEF0F0] p-4">
        <div class="min-w-0 flex-1">
          <ElDropdown>
            <div class="flex items-center gap-1">
              <span> {{ t('home.warning-alert-expiring-soon') }} </span>
              <div><ArrayDown /></div>
            </div>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  {{ t('home.warning-alert-expiring-soon') }}
                </ElDropdownItem>
                <ElDropdownItem>
                  {{ t('home.warning-alert-expired') }}
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
          <div class="mt-2 font-bold">
            {{ thousandSeparator(props?.data?.warning_product_quantity ?? 0) }}
          </div>
          <div
            class="mt-3 flex items-center gap-1 text-[#F56C6C]"
            @click="handleGoHandle('/inventory/stock-warning-table')"
          >
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FCF6EC] p-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <span> {{ t('home.unpaid-sales-order') }} </span>
          </div>
          <div class="mt-2 font-bold">
            {{ thousandSeparator(props?.data?.warning_product_quantity ?? 0) }}
          </div>
          <div
            class="mt-3 flex items-center gap-1 text-[#E6A23C]"
            @click="handleGoHandle('/sale/order')"
          >
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FCF6EC] p-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <span> {{ t('home.goods-receipt-not-posted') }} </span>
          </div>
          <div class="mt-2 font-bold">
            {{ thousandSeparator(props?.data?.warning_product_quantity ?? 0) }}
          </div>
          <div
            class="mt-3 flex items-center gap-1 text-[#E6A23C]"
            @click="handleGoHandle('/purchase/order')"
          >
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>
