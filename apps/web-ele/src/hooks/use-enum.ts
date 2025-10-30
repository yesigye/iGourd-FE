import { useI18n } from '@igourd/locales';
export function useEnum() {
  const { t } = useI18n();
  //自定义属性
  const featureTypes = [
    { label: t('enum.feature-types.input'), value: 'INPUT' },
    { label: t('enum.feature-types.select'), value: 'SELECT' },
  ];
  const selectTypes = [
    { label: t('enum.select-types.user-created'), value: true },
    { label: t('enum.select-types.fixed-value'), value: false },
  ];
  const compulsoryTypes = [
    { label: t('enum.compulsory-types.yes'), value: true },
    { label: t('enum.compulsory-types.no'), value: false },
  ];

  const transferTypeList = [
    {
      label: t('enum.transfer-type-list.same-store-transfer'),
      value: 'TRANSFER_SAME_STORE',
    },
    {
      label: t('enum.transfer-type-list.different-store-transfer'),
      value: 'TRANSFER_DIFFERENT_STORE',
    },
    {
      label: t('enum.transfer-type-list.transfer-out'),
      value: 'TRANSFER_IN_ONLY',
    },
    {
      label: t('enum.transfer-type-list.transfer-in'),
      value: 'TRANSFER_OUT_ONLY',
    },
  ];
  const consumptionReason = [
    {
      value: 'EXPIRED_GOODS',
      label: t('enum.consumption-reason-enum.expired-products'),
    },
    {
      value: 'DAMAGED_GOODS',
      label: t('enum.consumption-reason-enum.damaged-products'),
    },
    {
      value: 'PERSONAL_USES',
      label: t('enum.consumption-reason-enum.personal-use'),
    },
    {
      value: 'RAW_MATERIALS',
      label: t('enum.consumption-reason-enum.raw_materials'),
    },
    {
      value: 'OTHERS',
      label: t('enum.consumption-reason-enum.others'),
    },
  ];
  // 调拨状态
  const transferStatus =[
    {
      value: 'CREATED',
      label: t('enum.transfer-status.created'),
    },
    {
      value: 'INBOUND',
     label: t('enum.transfer-status.transfer-in'),
    },
    {
      value: 'REFUSED_INBOUND',
      label: t('enum.transfer-status.reject-in'),
    },
    {
      value: 'OUTBOUND',
      label: t('enum.transfer-status.transfer-out'),
    },
    {
      value: 'REFUSED_OUTBOUND',
      label: t('enum.transfer-status.reject-out'),
    },
  ]

  return {
    featureTypes,
    selectTypes,
    compulsoryTypes,
    transferTypeList,
    consumptionReason,
    transferStatus
  };
}
