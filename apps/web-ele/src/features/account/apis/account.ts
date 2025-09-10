import { requestClient } from '#/api/request'

// ==================== 账户管理 APIs ====================

// 获取账户分页列表
export function getAccountPageListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/page-list`, data)
}

// 获取账户列表
export function getAccountListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/list`, data)
}

// 获取账户详情
export function getAccountDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/${id}`)
}

// 创建账户
export function createAccountApi(data: any) {
  return requestClient.post(`/merchant/accounting/account`, data)
}

// 更新账户
export function updateAccountApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/${id}`, data)
}

// 删除账户
export function deleteAccountApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/${id}`)
}

// 批量删除账户
export function batchDeleteAccountApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/batch`, { data: { ids } })
}

// 创建或更新账户
export function createOrUpdateAccountApi(data: any) {
  if (data.id) {
    return updateAccountApi(data.id, data)
  } else {
    return createAccountApi(data)
  }
}

// ==================== 账户管理 APIs ====================

// 获取账户管理分页列表
export function getAccountManagementListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/management/page-list`, data)
}

// 获取账户管理详情
export function getAccountManagementDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/management/${id}`)
}

// 创建账户管理
export function createAccountManagementApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/management`, data)
}

// 更新账户管理
export function updateAccountManagementApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/management/${id}`, data)
}

// 删除账户管理
export function deleteAccountManagementApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/management/${id}`)
}

// 批量删除账户管理
export function batchDeleteAccountManagementApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/management/batch`, { data: { ids } })
}

// 创建或更新账户管理
export function createOrUpdateAccountManagementApi(data: any) {
  if (data.id) {
    return updateAccountManagementApi(data.id, data)
  } else {
    return createAccountManagementApi(data)
  }
}

// ==================== 会计科目表 APIs ====================

// 获取会计科目表分页列表
export function getChartOfAccountsListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/chart-of-accounts/page-list`, data)
}

// 获取会计科目表详情
export function getChartOfAccountsDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/chart-of-accounts/${id}`)
}

// 创建会计科目表
export function createChartOfAccountsApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/chart-of-accounts`, data)
}

// 更新会计科目表
export function updateChartOfAccountsApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/chart-of-accounts/${id}`, data)
}

// 删除会计科目表
export function deleteChartOfAccountsApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/chart-of-accounts/${id}`)
}

// 批量删除会计科目表
export function batchDeleteChartOfAccountsApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/chart-of-accounts/batch`, { data: { ids } })
}

// 创建或更新会计科目表
export function createOrUpdateChartOfAccountsApi(data: any) {
  if (data.id) {
    return updateChartOfAccountsApi(data.id, data)
  } else {
    return createChartOfAccountsApi(data)
  }
}

// ==================== 收款凭证 APIs ====================

// 获取收款凭证分页列表
export function getCollectionVoucherListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/collection-voucher/page-list`, data)
}

// 获取收款凭证详情
export function getCollectionVoucherDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/collection-voucher/${id}`)
}

// 创建收款凭证
export function createCollectionVoucherApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/collection-voucher`, data)
}

// 更新收款凭证
export function updateCollectionVoucherApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/collection-voucher/${id}`, data)
}

// 删除收款凭证
export function deleteCollectionVoucherApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/collection-voucher/${id}`)
}

// 批量删除收款凭证
export function batchDeleteCollectionVoucherApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/collection-voucher/batch`, { data: { ids } })
}

// 创建或更新收款凭证
export function createOrUpdateCollectionVoucherApi(data: any) {
  if (data.id) {
    return updateCollectionVoucherApi(data.id, data)
  } else {
    return createCollectionVoucherApi(data)
  }
}

// ==================== 货币管理 APIs ====================

// 获取货币分页列表
export function getCurrencyListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/currency/page-list`, data)
}

// 获取货币详情
export function getCurrencyDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/currency/${id}`)
}

// 创建货币
export function createCurrencyApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/currency`, data)
}

// 更新货币
export function updateCurrencyApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/currency/${id}`, data)
}

// 删除货币
export function deleteCurrencyApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/currency/${id}`)
}

// 批量删除货币
export function batchDeleteCurrencyApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/currency/batch`, { data: { ids } })
}

// 创建或更新货币
export function createOrUpdateAccountCurrencyApi(data: any) {
  if (data.id) {
    return updateCurrencyApi(data.id, data)
  } else {
    return createCurrencyApi(data)
  }
}

// ==================== 汇率管理 APIs ====================

// 获取汇率分页列表
export function getExchangeListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/exchange/page-list`, data)
}

// 获取汇率详情
export function getExchangeDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/exchange/${id}`)
}

// 创建汇率
export function createExchangeApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/exchange`, data)
}

// 更新汇率
export function updateExchangeApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/exchange/${id}`, data)
}

// 删除汇率
export function deleteExchangeApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/exchange/${id}`)
}

// 批量删除汇率
export function batchDeleteExchangeApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/exchange/batch`, { data: { ids } })
}

// 创建或更新汇率
export function createOrUpdateAccountExchangeApi(data: any) {
  if (data.id) {
    return updateExchangeApi(data.id, data)
  } else {
    return createExchangeApi(data)
  }
}

// ==================== 期末转账 APIs ====================

// 获取期末转账分页列表
export function getFinalTransferListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/final-transfer/page-list`, data)
}

// 获取期末转账详情
export function getFinalTransferDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/final-transfer/${id}`)
}

// 创建期末转账
export function createFinalTransferApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/final-transfer`, data)
}

// 更新期末转账
export function updateFinalTransferApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/final-transfer/${id}`, data)
}

// 删除期末转账
export function deleteFinalTransferApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/final-transfer/${id}`)
}

// 批量删除期末转账
export function batchDeleteFinalTransferApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/final-transfer/batch`, { data: { ids } })
}

// 创建或更新期末转账
export function createOrUpdateAccountFinalTransferApi(data: any) {
  if (data.id) {
    return updateFinalTransferApi(data.id, data)
  } else {
    return createFinalTransferApi(data)
  }
}

// ==================== 账户流水 APIs ====================

// 获取账户流水分页列表
export function getFlowsListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/flows/page-list`, data)
}

// 获取账户流水详情
export function getFlowsDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/flows/${id}`)
}

// 创建账户流水
export function createFlowsApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/flows`, data)
}

// 更新账户流水
export function updateFlowsApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/flows/${id}`, data)
}

// 删除账户流水
export function deleteFlowsApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/flows/${id}`)
}

// 批量删除账户流水
export function batchDeleteFlowsApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/flows/batch`, { data: { ids } })
}

// 创建或更新账户流水
export function createOrUpdateAccountFlowsApi(data: any) {
  if (data.id) {
    return updateFlowsApi(data.id, data)
  } else {
    return createFlowsApi(data)
  }
}

// ==================== 账户票据 APIs ====================

// 获取账户票据分页列表
export function getNotesListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/notes/page-list`, data)
}

// 获取账户票据详情
export function getNotesDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/notes/${id}`)
}

// 创建账户票据
export function createNotesApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/notes`, data)
}

// 更新账户票据
export function updateNotesApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/notes/${id}`, data)
}

// 删除账户票据
export function deleteNotesApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/notes/${id}`)
}

// 批量删除账户票据
export function batchDeleteNotesApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/notes/batch`, { data: { ids } })
}

// 创建或更新账户票据
export function createOrUpdateAccountNotesApi(data: any) {
  if (data.id) {
    return updateNotesApi(data.id, data)
  } else {
    return createNotesApi(data)
  }
}

// ==================== 明细账 APIs ====================

// 获取明细账分页列表
export function getSubsidiaryLedgerListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/subsidiary-ledger/page-list`, data)
}

// 获取明细账详情
export function getSubsidiaryLedgerDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/subsidiary-ledger/${id}`)
}

// 创建明细账
export function createSubsidiaryLedgerApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/subsidiary-ledger`, data)
}

// 更新明细账
export function updateSubsidiaryLedgerApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/subsidiary-ledger/${id}`, data)
}

// 删除明细账
export function deleteSubsidiaryLedgerApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/subsidiary-ledger/${id}`)
}

// 批量删除明细账
export function batchDeleteSubsidiaryLedgerApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/subsidiary-ledger/batch`, { data: { ids } })
}

// 创建或更新明细账
export function createOrUpdateAccountSubsidiaryLedgerApi(data: any) {
  if (data.id) {
    return updateSubsidiaryLedgerApi(data.id, data)
  } else {
    return createSubsidiaryLedgerApi(data)
  }
}

// ==================== 税务管理 APIs ====================

// 获取税务分页列表
export function getTaxListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/tax/page-list`, data)
}

// 获取税务详情
export function getTaxDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/tax/${id}`)
}

// 创建税务
export function createTaxApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/tax`, data)
}

// 更新税务
export function updateTaxApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/tax/${id}`, data)
}

// 删除税务
export function deleteTaxApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/tax/${id}`)
}

// 批量删除税务
export function batchDeleteTaxApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/tax/batch`, { data: { ids } })
}

// 创建或更新税务
export function createOrUpdateAccountTaxApi(data: any) {
  if (data.id) {
    return updateTaxApi(data.id, data)
  } else {
    return createTaxApi(data)
  }
}

// ==================== 账户分类 APIs ====================

// 获取账户分类分页列表
export function getAccountClassificationListApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/classification/page-list`, data)
}

// 获取账户分类详情
export function getAccountClassificationDetailApi(id: string) {
  return requestClient.get(`/merchant/accounting/account/classification/${id}`)
}

// 创建账户分类
export function createAccountClassificationApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/classification`, data)
}

// 更新账户分类
export function updateAccountClassificationApi(id: string, data: any) {
  return requestClient.put(`/merchant/accounting/account/classification/${id}`, data)
}

// 删除账户分类
export function deleteAccountClassificationApi(id: string) {
  return requestClient.delete(`/merchant/accounting/account/classification/${id}`)
}

// 批量删除账户分类
export function batchDeleteAccountClassificationApi(ids: string[]) {
  return requestClient.delete(`/merchant/accounting/account/classification/batch`, { data: { ids } })
}

// 创建或更新账户分类
export function createOrUpdateAccountClassificationApi(data: any) {
  if (data.id) {
    return updateAccountClassificationApi(data.id, data)
  } else {
    return createAccountClassificationApi(data)
  }
}

// ==================== 通用 APIs ====================

// 获取客户列表
export function getCustomerListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/page-list`, data)
}

// 导出功能
export function exportAccountApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/export`, data)
}

export function exportAccountManagementApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/management/export`, data)
}

export function exportChartOfAccountsApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/chart-of-accounts/export`, data)
}

export function exportCollectionVoucherApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/collection-voucher/export`, data)
}

export function exportCurrencyApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/currency/export`, data)
}

export function exportExchangeApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/exchange/export`, data)
}

export function exportFinalTransferApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/final-transfer/export`, data)
}

export function exportFlowsApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/flows/export`, data)
}

export function exportNotesApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/notes/export`, data)
}

export function exportSubsidiaryLedgerApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/subsidiary-ledger/export`, data)
}

export function exportTaxApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/tax/export`, data)
}

export function exportAccountClassificationApi(data: any) {
  return requestClient.post(`/merchant/accounting/account/classification/export`, data)
}

// 保持原有的对象导出方式（向后兼容）
export const accountApi = {
  // 账户管理
  getPageList: getAccountPageListApi,
  getList: getAccountListApi,
  getDetail: getAccountDetailApi,
  create: createAccountApi,
  update: updateAccountApi,
  delete: deleteAccountApi,
  batchDelete: batchDeleteAccountApi,
  
  // 账户管理
  getManagementList: getAccountManagementListApi,
  getManagementDetail: getAccountManagementDetailApi,
  createManagement: createAccountManagementApi,
  updateManagement: updateAccountManagementApi,
  deleteManagement: deleteAccountManagementApi,
  batchDeleteManagement: batchDeleteAccountManagementApi,
  
  // 会计科目表
  getChartOfAccountsList: getChartOfAccountsListApi,
  getChartOfAccountsDetail: getChartOfAccountsDetailApi,
  createChartOfAccounts: createChartOfAccountsApi,
  updateChartOfAccounts: updateChartOfAccountsApi,
  deleteChartOfAccounts: deleteChartOfAccountsApi,
  batchDeleteChartOfAccounts: batchDeleteChartOfAccountsApi,
  
  // 收款凭证
  getCollectionVoucherList: getCollectionVoucherListApi,
  getCollectionVoucherDetail: getCollectionVoucherDetailApi,
  createCollectionVoucher: createCollectionVoucherApi,
  updateCollectionVoucher: updateCollectionVoucherApi,
  deleteCollectionVoucher: deleteCollectionVoucherApi,
  batchDeleteCollectionVoucher: batchDeleteCollectionVoucherApi,
  
  // 货币管理
  getCurrencyList: getCurrencyListApi,
  getCurrencyDetail: getCurrencyDetailApi,
  createCurrency: createCurrencyApi,
  updateCurrency: updateCurrencyApi,
  deleteCurrency: deleteCurrencyApi,
  batchDeleteCurrency: batchDeleteCurrencyApi,
  
  // 汇率管理
  getExchangeList: getExchangeListApi,
  getExchangeDetail: getExchangeDetailApi,
  createExchange: createExchangeApi,
  updateExchange: updateExchangeApi,
  deleteExchange: deleteExchangeApi,
  batchDeleteExchange: batchDeleteExchangeApi,
  
  // 期末转账
  getFinalTransferList: getFinalTransferListApi,
  getFinalTransferDetail: getFinalTransferDetailApi,
  createFinalTransfer: createFinalTransferApi,
  updateFinalTransfer: updateFinalTransferApi,
  deleteFinalTransfer: deleteFinalTransferApi,
  batchDeleteFinalTransfer: batchDeleteFinalTransferApi,
  
  // 账户流水
  getFlowsList: getFlowsListApi,
  getFlowsDetail: getFlowsDetailApi,
  createFlows: createFlowsApi,
  updateFlows: updateFlowsApi,
  deleteFlows: deleteFlowsApi,
  batchDeleteFlows: batchDeleteFlowsApi,
  
  // 账户票据
  getNotesList: getNotesListApi,
  getNotesDetail: getNotesDetailApi,
  createNotes: createNotesApi,
  updateNotes: updateNotesApi,
  deleteNotes: deleteNotesApi,
  batchDeleteNotes: batchDeleteNotesApi,
  
  // 明细账
  getSubsidiaryLedgerList: getSubsidiaryLedgerListApi,
  getSubsidiaryLedgerDetail: getSubsidiaryLedgerDetailApi,
  createSubsidiaryLedger: createSubsidiaryLedgerApi,
  updateSubsidiaryLedger: updateSubsidiaryLedgerApi,
  deleteSubsidiaryLedger: deleteSubsidiaryLedgerApi,
  batchDeleteSubsidiaryLedger: batchDeleteSubsidiaryLedgerApi,
  
  // 税务管理
  getTaxList: getTaxListApi,
  getTaxDetail: getTaxDetailApi,
  createTax: createTaxApi,
  updateTax: updateTaxApi,
  deleteTax: deleteTaxApi,
  batchDeleteTax: batchDeleteTaxApi,
  
  // 账户分类
  getAccountClassificationList: getAccountClassificationListApi,
  getAccountClassificationDetail: getAccountClassificationDetailApi,
  createAccountClassification: createAccountClassificationApi,
  updateAccountClassification: updateAccountClassificationApi,
  deleteAccountClassification: deleteAccountClassificationApi,
  batchDeleteAccountClassification: batchDeleteAccountClassificationApi,
  
  // 通用
  getCustomerList: getCustomerListApi,
  export: exportAccountApi,
  exportManagement: exportAccountManagementApi,
  exportChartOfAccounts: exportChartOfAccountsApi,
  exportCollectionVoucher: exportCollectionVoucherApi,
  exportCurrency: exportCurrencyApi,
  exportExchange: exportExchangeApi,
  exportFinalTransfer: exportFinalTransferApi,
  exportFlows: exportFlowsApi,
  exportNotes: exportNotesApi,
  exportSubsidiaryLedger: exportSubsidiaryLedgerApi,
  exportTax: exportTaxApi,
  exportAccountClassification: exportAccountClassificationApi,
}


