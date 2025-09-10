import { ref, watch } from 'vue'
import { useI18n } from '@igourd/locales'
import { useIgourdDrawer } from '@igourd/common-ui'
import { customerApi } from '../apis'
import { Local } from '@/utils'

export function useBalanceDetail() {
  const { t } = useI18n()
  const userInfo = Local.get('userinfo') || {}
  const merchant_id = userInfo?.current_login_user_app?.owner_id

  const activeName = ref('RECHARGE')
  const balanceId = ref(0)

  // 获取余额参数
  const balance_params = ref({
    change_type: '',
    customer_id: null,
    end_date: '',
    keywords: '',
    merchant_id: merchant_id,
    name: '',
    page_num: 1,
    page_size: 10,
    start_date: '',
  })

  // 余额数据
  const balanceData = ref([])

  // 切换tab
  const handleTabChange = (tabName: string) => {
    balance_params.value.change_type = tabName
    refreshBalanceList()
  }

  // 获取余额明细
  const refreshBalanceList = async () => {
    balance_params.value.change_type = activeName.value
    const res = await CustomerService.getBalanceDetail({
      ...balance_params.value,
      customer_id: balanceId.value,
    })
    balanceData.value = res?.data
  }

  // 处理分页变化
  const handlePaginationChange = (val: number) => {
    if (typeof val === 'number') {
      balance_params.value.page_num = val
    }
    refreshBalanceList()
  }

  // 处理每页数量变化
  const handleSizeChange = (val: number) => {
    balance_params.value.page_size = val
    balance_params.value.page_num = 1
    refreshBalanceList()
  }

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('customers.balance_detail')}}",
    onOpenChange(isOpen) {
      if (isOpen) {
        const data = drawerApi.getData()
        if (data) {
          balanceId.value = data.balance_id
          refreshBalanceList()
        }
      }
    },
  })

  const openDrawer = (data: any) => {
    balanceId.value = data.balance_id
    drawerApi.setData(data).open()
  }

  return {
    Drawer,
    drawerApi,
    openDrawer,
    activeName,
    balance_params,
    balanceData,
    handleTabChange,
    refreshBalanceList,
    handlePaginationChange,
    handleSizeChange,
  }
}
