<script lang="tsx" setup>
import { onMounted, reactive, toRefs, watch } from 'vue';

import {
  ElInput,
  ElOption,
  ElSelect,
  ElTable,
  ElTableColumn,
} from '@igourd/common-ui';
import { pick } from '@igourd/utils';

import { InventoryService } from '@/apis/inventory';
import { useFieldsColumns } from '@/hooks/useFieldsColumns';
import { useUserStore } from '@/store/modules/useUserStore';
import { Search } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';

type PropsType = {
  disabled: boolean;
  sharedStock: AnyObject;
  sharedStockKeys: string[];
};
const props = withDefaults(defineProps<PropsType>(), {});
// 主动派发事件
const emits = defineEmits<{
  (e: 'update:sharedStock', obj: any): void;
}>();
const { merchantId } = storeToRefs(useUserStore());
const columns = [
  {
    label: 'inventory.product-code',
    field: 'code',
    minWidth: 140,
    fixed: 'left',
    renderTemplate: renderProductBlock,
  },
  {
    label: 'inventory.product-name',
    field: 'major_name',
    showOverflowTooltip: true,
    minWidth: 140,
  },

  {
    label: 'inventory.unit',
    field: 'product_unit_name',
    minWidth: 100,
  },
  {
    label: 'inventory.unit-rate',
    field: 'basic_unit_radio',
    minWidth: 120,
    renderTemplate: renderUnitRateBlock,
  },
];
const state = reactive({
  loading: true,
  productList: [] as AnyObject[],
  selectProduct: {
    code: '',
    major_name: '',
    product_unit_name: '',

    basic_product_id: '',
    basic_unit_id: '',
    product_profile_id: '',
    basic_unit_radio: undefined,
  },
});

const { loading, productList, selectProduct } = toRefs(state);

watch(
  () => pick(selectProduct.value, props.sharedStockKeys),
  (value) => {
    emits('update:sharedStock', value);
  },
  { deep: true },
);

const { columnsTable } = useFieldsColumns({ columns });

function selectChange(value: string, isclear?: boolean) {
  const productItem = productList.value.find((item) => item.id === value) || {};
  selectProduct.value.basic_unit_id = productItem.product_unit_id || '';
  selectProduct.value.code = productItem.code || '';
  selectProduct.value.product_unit_name = productItem.product_unit_name || '';
  selectProduct.value.major_name = productItem.major_name || '';
  selectProduct.value.product_profile_id = productItem.product_profile_id || '';
  !isclear && (selectProduct.value.basic_unit_radio = undefined);
}

function remoteMethodEvent(query) {
  getProductList({ keywords: query });
}

function renderOptions() {
  return productList.value.map((item) => (
    <ElOption key={item.id} label={item.code} value={item.id} />
  ));
}
function renderProductBlock({ schema, column, row, value }) {
  return (
    <ElSelect
      class="Stock-select"
      defaultFirstOption={true}
      disabled={props.disabled}
      filterable
      loading={loading.value}
      onChange={selectChange}
      placeholder=""
      remote={true}
      remoteMethod={remoteMethodEvent}
      v-model={selectProduct.value.basic_product_id}
    >
      {{
        default: renderOptions,
        prefix: () => (
          <el-icon>
            <Search />
          </el-icon>
        ),
      }}
    </ElSelect>
  );
}
const handleInput = (num) => {
  selectProduct.value.basic_unit_radio = num;
};

function renderUnitRateBlock() {
  // return <ElInputNumber class="Stock-input" v-model={selectProduct.value.basic_unit_radio} controls={false} precision={4}>
  //   {{ prefix: () => <span class="Stock-input-prefix">1: </span> }}
  // </ElInputNumber>
  return (
    <ElInput
      class="Stock-input"
      disabled={props.disabled}
      v-input-number={[8, handleInput]}
      v-model={selectProduct.value.basic_unit_radio}
    >
      {{ prefix: () => <span class="Stock-input-prefix">1: </span> }}
    </ElInput>
  );
}
function initDefaultParams() {
  const { basic_product_id, basic_unit_radio, product_profile_id } =
    props.sharedStock;
  selectProduct.value.basic_product_id = basic_product_id || '';
  selectProduct.value.basic_unit_radio = basic_unit_radio || undefined;
  selectProduct.value.product_profile_id = product_profile_id || '';
  basic_product_id && selectChange(basic_product_id, true);
}

async function getProductList(query?: AnyObject) {
  try {
    loading.value = true;
    const response = await InventoryService.productPageList(
      {
        merchant_id: merchantId.value,
        is_basic: true,
        ...query,
      },
      { hideLoading: true },
    );
    if (response.code === 'SUCCESS') {
      const list = response?.data?.list || [];
      productList.value = list;
      initDefaultParams();
    }
  } catch (error) {
    console.error('获取产品列表失败:', error);
    loading.value = false;
  }
}

onMounted(() => {
  initDefaultParams();
  if (props.sharedStock?.basic_product_id) {
    getProductList({ id_list: [props.sharedStock.basic_product_id || ''] });
  }
});
</script>

<template>
  <div class="Stock">
    <ElTable :data="[selectProduct]" size="small" border>
      <ElTableColumn
        v-for="(schema, index) in columnsTable"
        :class-name="schema.field"
        :align="schema.align || 'left'"
        :key="index"
        :fixed="schema.fixed"
        :label="schema.label"
        :prop="schema.field"
        :show-overflow-tooltip="schema.showOverflowTooltip"
        :min-width="schema.minWidth || 'auto'"
      >
        <template #default="{ column, row }">
          <template v-if="schema.render">
            {{ schema.render(schema, column, row) }}
          </template>
          <template v-else-if="schema.renderTemplate">
            <component
              :is="
                schema.renderTemplate({
                  schema,
                  column,
                  row,
                  value: row[schema.field],
                })
              "
            />
          </template>
          <template v-else> {{ row[schema.field] }} </template>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style lang="scss" scoped>
.Stock {
  :deep(.el-table) {
    .el-table__cell {
      background-color: var(--el-fill-color-light);
    }

    tbody {
      .el-table__cell.code,
      .el-table__cell.basic_unit_radio {
        &,
        .cell {
          padding: 0;
        }
      }
    }
  }

  &-select {
    box-sizing: border-box;
    height: 100%;
    padding: 0 1px;
    border-radius: 0;

    :deep(.el-select__wrapper) {
      border-radius: 0;
      box-shadow: none;
    }
  }

  &-input {
    width: 100%;
    height: 100%;
    border-radius: 0;

    &-prefix {
      color: #000;
    }

    :deep(.el-input__wrapper) {
      border-radius: 0;
      box-shadow: none;
    }

    :deep(.el-input__inner) {
      text-align: left;
    }
  }
}
</style>
