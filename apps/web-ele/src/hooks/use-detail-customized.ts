import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import DetailCustomized from '#/components/add-customized/detail-customized.vue';
/**
 * 自定义属性 详情
 * @returns
 */
export function useCustomizedDetail(title:string) {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: DetailCustomized,
    appendToMain: true,
    class: 'w-2/3',
    title: title,
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
