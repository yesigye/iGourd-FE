import { TREE_CHILDREN_KEY } from './const'

// 转换数据结构函数，专门处理损益科目的嵌套结构
export const transformDataToTableTree = (data: any) => {
  if (!Array.isArray(data)) return []

  const transform = (items: any[]): any[] => {
    return items.map(item => {
      const { account_ledger, sub_ledger_trees } = item

      // 基础科目信息
      const baseItem = {
        ...account_ledger,
        // 添加显示所需的字段
        id: account_ledger.id,
        code: account_ledger.code,
        name: account_ledger.name,
        level: account_ledger.level,
        balance_direction: account_ledger.balance_direction,
        category: account_ledger.category,
        // 余额相关字段
        initial_balance: account_ledger.initial_balance || 0,
        current_debit_amount: account_ledger.current_debit_amount || 0,
        current_credit_amount: account_ledger.current_credit_amount || 0,
        ending_balance: account_ledger.ending_balance || 0,
        cumulative_debit_amount: account_ledger.cumulative_debit_amount || 0,
        cumulative_credit_amount: account_ledger.cumulative_credit_amount || 0,
        node_type: account_ledger.node_type,
      }

      // 处理子科目
      if (sub_ledger_trees && sub_ledger_trees.length > 0) {
        // 有子科目，递归处理
        baseItem[TREE_CHILDREN_KEY] = transform(sub_ledger_trees)
      } else {
        // 没有子科目，检查是否有账户余额数据
        const accountBalances = account_ledger?.account_balances || []
        if (accountBalances.length > 0) {
          baseItem[TREE_CHILDREN_KEY] = accountBalances.map((balance: any) => ({
            ...balance,
            id: balance.id || `${account_ledger.id}_${balance.account_id}`,
            code: balance.account_code || account_ledger.code,
            name: balance.account_name || account_ledger.name,
            node_type: 'ACCOUNT',
          }))
        }
      }

      return baseItem
    })
  }

  return transform(data)
}
