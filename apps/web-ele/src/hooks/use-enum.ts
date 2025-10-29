import { useI18n } from '@igourd/locales';
export function useEnum() {
  const { t } = useI18n();
  //自定义属性
  const featureTypes = [
    { label: t('enmu.feature-types.input'), value: 'INPUT' },
    { label: t('enmu.feature-types.select'), value: 'SELECT' },
  ];
  const selectTypes = [
    { label: t('enmu.select-types.user-created'), value: true },
    { label: t('enmu.select-types.fixed-value'), value: false },
  ];
  const compulsoryTypes = [
    { label: t('enmu.compulsory-types.yes'), value: true },
    { label: t('enmu.compulsory-types.no'), value: false },
  ];

  return {
    featureTypes,
    selectTypes,
    compulsoryTypes,
  };
}
