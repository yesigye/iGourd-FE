<template>
  <Modal>
    <IgourdElTable
      :el-table-prop="{
        i18n: t,
        columnCacheKey: 'debt_history',
        data: data?.data?.list || [],
      }"
      :columns="debtColumns({ i18n: t, openDetailModal: openOrderDetail })"
      :pagination="pagination"
    >
    </IgourdElTable>
    <!-- 订单详情 -->
    <SaleOrderDetail
      :show-dialog="!!orderDetail.id"
      :title="t('sales.salesOrderDetails')"
      :current-id="orderDetail.id"
      @close-tkr="closeOrderDetail"
    />
  </Modal>
</template>

<script setup lang="ts">
import { IgourdElTable } from '@igourd/common-ui'
import { useI18n } from '@igourd/locales'
import { debtColumns } from '../utils/debtColumns'
import { useDebtModal } from '../hooks/use-debt-modal'
import SaleOrderDetail from '@/views/sale/order/components/SaleOrderDetail.vue'

const { t } = useI18n()
const { Modal, data, pagination, orderDetail, openOrderDetail, closeOrderDetail } = useDebtModal()
</script>
