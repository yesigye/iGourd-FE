import { useSaleOrder } from '@@/sale/hooks';
import { useAccountNotes } from '../notes';

export function useModalConfig() {
  // 加载订单列
  const { columns: orderColumns } = useSaleOrder();

  const { columns: accountNotes } = useAccountNotes();
}
