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

  return {
    featureTypes,
    selectTypes,
    compulsoryTypes,
  };
}
