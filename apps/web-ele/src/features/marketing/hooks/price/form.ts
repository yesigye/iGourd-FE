import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks';

import schema from './form-schema';

export function usePriceForm() {
  const { t } = useI18n();
  return useDrawerForm({
    drawerOptions: {
      title: t('price.add-price'),
      class: 'w-[958px]',
      contentClass: 'bg-muted',
      appendToMain: true,
    },

    formOptions: {
      initialValues: {
        relation_product_list: [{}],
        relation_product_label_list: [{}],
        relation_product_group_list: [{}],
      },
      schema,
    },
  });
}
