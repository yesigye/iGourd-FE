import { ProductArrayTable as CoreProductArrayTable } from '@igourd/common-ui';
import type { ProductArrayTableProps } from '@igourd/common-ui';
import type { SetupContext } from 'vue';
import { h, mergeProps } from 'vue';
import { warehouseProductPageList, productSearch } from '@@/purchase/apis';

export function ProductArrayTable(
  props: ProductArrayTableProps,
  { attrs, slots }: Omit<SetupContext, 'expose'>,
) {
  const merged: ProductArrayTableProps = mergeProps(
    props,
    {
      InventoryService: {
        productSearch,
        warehouseProductPageList,
      },
    },

    attrs,
  );
  return h(CoreProductArrayTable, merged, slots);
}

export default ProductArrayTable;
