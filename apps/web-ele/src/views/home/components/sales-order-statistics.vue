<script setup lang="ts">
import { ElCol, ElRow } from '@igourd/common-ui';
import { ArrayDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import actualTransactionOrderIcon from '#/assets/home/actual-transaction-order.svg';
import grossProfitIcon from '#/assets/home/gross-profit.svg';
import salesProductQtyIcon from '#/assets/home/sales-product-qty.svg';
import salesReceivedAmountIcon from '#/assets/home/sales-received-amount.svg';
import walletIcon from '#/assets/home/wallet.svg';
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
</script>
<template>
  <ElRow :gutter="10">
    <ElCol :lg="4" :xs="24" class="mb-2.5">
      <div
        class="bg-card mb-2.5 flex h-full items-center justify-center px-4 py-6"
      >
        <div class="w-full">
          <div class="flex items-center gap-1">
            <span>{{
              t('home.products-value-cost', { currency: props?.currencySymbol })
            }}</span>
            <ArrayDown />
          </div>
          <div class="flex justify-end">
            <div
              class="flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#D9ECFF]"
            >
              <img :src="walletIcon" alt="" />
            </div>
          </div>
          <div>
            {{
              thousandSeparator(
                props?.data?.total_value_of_cost_product_amount ?? 0,
              )
            }}
          </div>
        </div>
      </div>
    </ElCol>
    <ElCol :lg="10" :xs="24" class="mb-2.5">
      <div class="flex h-full flex-col gap-2.5">
        <div
          class="bg-card flex min-h-[82px] flex-1 items-center gap-4 px-4 py-5"
        >
          <div class="min-w-0 flex-1">
            <p class="text-[#606266]">
              {{
                t('home.sales-received-amount', {
                  currency: props?.currencySymbol,
                })
              }}
            </p>
            <p class="mt-2 font-bold text-[#303133]">
              {{
                thousandSeparator(
                  props?.data?.total_value_of_selling_product_amount ?? 0,
                )
              }}
            </p>
          </div>
          <div
            class="h-7 w-auto flex-shrink-0 border border-dashed border-[#9FCEFF]"
          ></div>
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <div class="min-w-0 flex-1">
              <p class="flex w-full items-center justify-between">
                <span class="text-secondary">{{ t('home.sales-amt') }}</span>
                <span class="font-bold text-[#303133]">{{
                  thousandSeparator(props?.data?.total_received_amount ?? 0)
                }}</span>
              </p>
              <p class="mt-2 flex w-full items-center justify-between">
                <span class="text-secondary">{{ t('home.includ-debt') }}</span>
                <span class="font-bold text-[#FC5C65]">({{
                    thousandSeparator(props?.data?.debt_total_amount ?? 0)
                  }})</span>
              </p>

              <p class="mt-2 flex w-full items-center justify-between">
                <span class="text-secondary">{{ t('home.refund-amt') }}</span>
                <span class="font-bold text-[#303133]">{{
                  thousandSeparator(props?.data?.refund_total_amount ?? 0)
                }}</span>
              </p>
            </div>
            <div class="flex-shrink-0">
              <div
                class="flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#D9ECFF]"
              >
                <img :src="salesReceivedAmountIcon" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-card flex min-h-[82px] flex-1 items-center gap-4 px-4 py-5"
        >
          <div class="min-w-0 flex-1">
            <p class="text-[#606266]">
              {{ t('home.actual-transaction-order') }}
            </p>
            <p class="mt-2 font-bold text-[#303133]">
              {{
                thousandSeparator(props?.data?.sales_order_total_quantity ?? 0)
              }}
            </p>
          </div>
          <div
            class="h-7 w-auto flex-shrink-0 border border-dashed border-[#9FCEFF]"
          ></div>
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <div class="min-w-0 flex-1">
              <p class="flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.sales-qty') }}</span>
                <span class="font-bold text-[#303133]">{{
                  thousandSeparator(
                    props?.data?.actual_sales_order_total_quantity ?? 0,
                  )
                }}</span>
              </p>
              <p class="mt-2 flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.includ-debt') }}</span>
                <span class="font-bold text-[#FC5C65]">{{
                  thousandSeparator(props?.data?.debt_order_total_quantity ?? 0)
                }}</span>
              </p>

              <p class="mt-2 flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.refund-qty') }}</span>
                <span class="font-bold text-[#303133]">{{
                  thousandSeparator(
                    props?.data?.returned_order_total_quantity ?? 0,
                  )
                }}</span>
              </p>
            </div>
            <div class="flex-shrink-0">
              <div
                class="flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#D9ECFF]"
              >
                <img :src="actualTransactionOrderIcon" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElCol>
    <ElCol :lg="10" :xs="24" class="mb-2.5">
      <div class="mb-2.5 flex h-full flex-col gap-2.5">
        <div
          class="bg-card flex min-h-[82px] flex-1 items-center gap-4 px-4 py-5"
        >
          <div class="min-w-0 flex-1">
            <p class="text-[#606266]">{{ t('home.sales-product-qty') }}</p>
            <p class="mt-2 font-bold text-[#303133]">
              {{
                thousandSeparator(
                  props?.data?.sales_product_total_quantity ?? 0,
                )
              }}
            </p>
          </div>
          <div
            class="h-7 w-auto flex-shrink-0 border border-dashed border-[#9FCEFF]"
          ></div>
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <div class="min-w-0 flex-1">
              <p class="flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.sales-qty') }}</span>
                <span class="font-bold text-[#303133]">{{
                  thousandSeparator(
                    props?.data?.sales_product_total_quantity ?? 0,
                  )
                }}</span>
              </p>
              <p
                class="mt-2 flex w-full items-center justify-between text-transparent"
              >
                <span class="">{{ t('home.sales-amt') }}</span>
                <span class="font-bold">8,500,768,989</span>
              </p>

              <p class="mt-2 flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.refund-qty') }}</span>
                <span class="font-bold text-[#303133]">{{
                  props?.data?.returned_product_total_quantity ?? 0
                }}</span>
              </p>
            </div>
            <div class="flex-shrink-0">
              <div
                class="flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#D9ECFF]"
              >
                <img :src="salesProductQtyIcon" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-card flex min-h-[82px] flex-1 items-center gap-4 px-4 py-5"
        >
          <div class="min-w-0 flex-1">
            <p class="text-[#606266]">
              {{ t('home.gross-profit', { currency: props?.currencySymbol }) }}
            </p>
            <p class="mt-2 font-bold text-[#303133]">
              {{ props?.data?.gross_margin ?? 0 }}
            </p>
          </div>
          <div
            class="h-7 w-auto flex-shrink-0 border border-dashed border-[#9FCEFF]"
          ></div>
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <div class="min-w-0 flex-1">
              <!-- <p class="flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.sales-qty') }}</span>
                <span class="font-bold text-[#303133]">8,500,768,989</span>
              </p> -->
              <p class="mt-2 flex w-full items-center justify-between">
                <span class="">{{ t('home.gross-profit-rate') }}</span>
                <span class="font-bold">{{
                  props?.data?.gross_profit_total_amount ?? 0
                }}</span>
              </p>

              <!-- <p class="mt-2 flex w-full items-center justify-between">
                <span class="text-[#666666]">{{ t('home.refund-qty') }}</span>
                <span class="font-bold text-[#303133]">8,500,768,989</span>
              </p> -->
            </div>
            <div class="flex-shrink-0">
              <div
                class="flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#D9ECFF]"
              >
                <img :src="grossProfitIcon" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>
