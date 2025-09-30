<template>
  <div class="scan-content" style="height: 100%; overflow-y: auto">
    <el-table
      ref="tableRef"
      :data="goodsData || []"
      style="width: 100%"
      stripe
      border
      class="down-table-list"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      :header-cell-style="{
        background: '#F6F8FC',
        color: '#323232',
        height: '30px'
      }"
    >
      <template v-for="item in allColumns">
        <el-table-column
          v-if="item.prop === 'profile_photo' && item.isSelect === true"
          :prop="item.prop"
          :label="t(`customers.${item.localKey}`)"
          :align="item.align"
          :fixed="item.fixed"
          :min-width="item.width"
          :key="item.fixed"
        >
          <template #default="{ row }">
            <img
              v-if="row.profile_photo && /^(https?:\/\/[^\s]+)$/.test(row.profile_photo)"
              :src="row.profile_photo"
              alt=""
              @error="handleImageError"
              class="product-pic"
            />
            <img v-else src="@/assets/img/productDefault.png" alt="" class="product-pic" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="item.prop === 'bar_code' && item.isSelect"
          sortable
          :prop="item.prop"
          :label="t(`sales.${item.localKey}`)"
          :min-width="item.width"
          :align="item.align"
          :fixed="item.fixed"
          :key="item.prop"
        >
        </el-table-column>

        <el-table-column
          v-if="item.prop === 'major_name' && item.isSelect"
          sortable
          :prop="item.prop"
          :label="t(`sales.${item.localKey}`)"
          :min-width="item.width"
          :align="item.align"
          :fixed="item.fixed"
          :key="item.prop"
        >
          <template #default="{ row }">
            <p>{{ row.major_name }}</p>
            <p style="font-size: 12px; color: #ccc">{{ row.code }} [{{ row.product_unit_name }}]</p>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="item.prop !== 'bar_code' && item.prop !== 'profile_photo' && item.isSelect"
          sortable
          :prop="item.prop"
          :label="t(`sales.${item.localKey}`)"
          :min-width="item.width"
          :align="item.align"
          :fixed="item.fixed"
          :key="item.align"
        >
        </el-table-column>
      </template>
      <el-table-column prop="quantity" :label="t('sales.quantity')" width="200" align="center" fixed="right">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.quantity"
            :min="1"
            @input="handleInputDebounced(scope.row)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        v-auth="'sale_scan_code_delete'"
        :label="t('sales.action')"
        width="160"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleDelete(scope.row.id)">
            <i class="iconfont icon-shanchu2 shanchu"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
// import
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash';
import { allColumns } from '../configs/sale.config';

// props
const props = defineProps({
  goodsList: {
    type: Array,
    default: () => []
  }
});
const goodsData = computed(() => props.goodsList);

// data
const { t } = useI18n();

const tableRef = ref(null);
const rowSelection = ref([]);
// 商品的输入数量
const quantity = ref(0);
// 生命周期

// emits
const emit = defineEmits(['update-quantity', 'handleSelectRow', 'DeleteGoods']);

// computed

// methods
const handleInputDebounced = debounce(row => handleQuantityChange(row), 500);

const handleQuantityChange = (item: any) => {
  // 直接发送更新后的商品数据
  emit('update-quantity', item);
};

const handleSelectionChange = (val: any) => {
  console.log(val);
};
const handleSelect = (val: any) => {
  rowSelection.value = val;
  emit('handleSelectRow', val);
};

const handleDelete = (goodsId: number) => {
  emit('DeleteGoods', goodsId);
};

const handleImageError = e => {
  e.target.src = new URL('@/assets/img/productDefault.png', import.meta.url).href;
};

defineExpose({
  quantity
});

// events
</script>

<style scoped lang="scss">
.scan-content {
  :deep(.el-table--default .el-table__cell) {
    padding: 4px 0 !important;
  }
}
</style>
