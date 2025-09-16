import { ref, computed } from 'vue'
import { useI18n } from '@igourd/locales'
import { useIgourdModal } from '@igourd/common-ui'
import { listPageOrder } from '@/apis'
import { useUserStore } from '@igourd/stores'
import { OrderQueryVO } from '@/apis/sale/type'

export function useDebtModal() {
  const { t } = useI18n()
  const userStore = useUserStore()

  const searchParams = ref<OrderQueryVO>({
    page_num: 0,
    page_size: 10,
    customer_id: '',
  })

  const orderDetail = ref({
    id: '',
  })

  const openOrderDetail = (id: string) => {
    orderDetail.value.id = id
  }

  const closeOrderDetail = () => {
    orderDetail.value.id = ''
  }

  const [Modal, modalApi] = useIgourdModal({
    title: t('sales.orderDetails'),
    class: 'w-90%',
    confirmText: t('inventory.close'),
    onConfirm: () => {
      modalApi.close()
    },
  })

  const { data } = useRequest(
    () => {
      if (!searchParams.value?.customer_id) return
      return listPageOrder({
        ...searchParams.value,
        status_list: ['NO_REPAID', 'PARTIAL_REPAID'],
        payment_type: 'CREDIT',
        merchant_id: userStore.merchantId,
      })
    },
    {
      refreshDeps: [searchParams],
    },
  )

  const pagination = computed(() => {
    return {
      total: +data.value?.data?.total || 0,
      page_num: searchParams.value.page_num || 1,
      page_size: searchParams.value.page_size || 10,
      onChange(page: number, size: number) {
        searchParams.value = {
          ...searchParams.value,
          page_num: page,
          page_size: size,
        }
      },
    }
  })

  const openModal = (customerId: string) => {
    searchParams.value = {
      ...searchParams.value,
      customer_id: customerId,
    }
    modalApi.open()
  }

  return {
    Modal,
    modalApi,
    openModal,
    data,
    pagination,
    orderDetail,
    openOrderDetail,
    closeOrderDetail,
  }
}
