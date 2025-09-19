import { defineComponent, h } from 'vue';

import { RecursionField, useField } from '@igourd/common-ui';

import { useProductConext } from '.';
import { schemaBuilder } from './schema-builder';

const ProductTable = defineComponent({
  props: ['warehouse_id'],
  setup(props, { attrs, slots }) {
    const { provideContext } = useProductConext();
    provideContext({
      warehouse_id: props.warehouse_id,
    });
    const field = useField();
    const schema = schemaBuilder();
    return () =>
      h(RecursionField, {
        schema,
        name: field.value.props.name,
      });
  },
});
export { ProductTable };
