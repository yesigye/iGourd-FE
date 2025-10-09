import { observable } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks';

import { useDiscountSchema } from './form-schema';

export function useDiscountForm() {
  const { t } = useI18n();
  const showMore = observable({ value: false });
  function toggleMore() {
    showMore.value = !showMore.value;
  }
  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('discount.form.create'),
      class: 'w-[958px]',
      contentClass: 'bg-muted  px-0',
      appendToMain: true,
    },
    formOptions: {
      scope: { showMore, toggleMore },
      initialValues: {
        apply_vip: 1,

        relation_product_group_id_list: [{}],
        relation_product_label_id_list: [{}],
        relation_product_id_list: [{}],
      },
      schema: useDiscountSchema(toggleMore),
    },
  });
  drawerApi.onOpened = () => {
    if (Reflect.has(drawerApi.getData() ?? {}, 'id')) {
      drawerApi.setState({
        title: t('discount.form.edit'),
      });
    }
  };
  return { Drawer, Form, drawerApi, formAPI };
}
