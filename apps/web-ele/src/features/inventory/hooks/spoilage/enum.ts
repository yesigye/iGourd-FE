import { useI18n } from '@igourd/locales';

const { t } = useI18n();
// 枚举报损原因
export const consumptionReason = [
  {
    value: 'EXPIRED_GOODS',
    label: t('spoilage.consumption-reason-enum.expired-products'),
  },
  {
    value: 'DAMAGED_GOODS',
    label: t('spoilage.consumption-reason-enum.damaged-products'),
  },
  {
    value: 'PERSONAL_USES',
    label: t('spoilage.consumption-reason-enum.personal-use'),
  },
  {
    value: 'RAW_MATERIALS',
    label: t('spoilage.consumption-reason-enum.raw_materials'),
  },
  {
    value: 'OTHERS',
    label: t('spoilage.consumption-reason-enum.others'),
  },
];
