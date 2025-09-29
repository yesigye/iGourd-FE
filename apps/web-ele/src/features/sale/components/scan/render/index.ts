import { withInstall } from '#/utils';

import AmountComponent from './src/Amount.vue';
import PriceComponent from './src/price.vue';
import ProductMajorComponent from './src/ProductMajor.vue';
import StockComponent from './src/Stock.vue';
import StockWithSelectComponent from './src/StockWithSelect.vue';
import unitSelect from './src/UnitSelect.vue';

export const ProductMajor = withInstall(ProductMajorComponent);
export const Price = withInstall(PriceComponent);
export const Amount = withInstall(AmountComponent);
export const Stock = withInstall(StockComponent);
export const StockWithSelect = withInstall(StockWithSelectComponent);
export const UnitSelect = withInstall(unitSelect);
