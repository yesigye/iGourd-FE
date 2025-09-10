<template>
  <Drawer>
    <div class="page-container">
      <div class="section basic-info-section">
        <div class="basic-info-content">
          <div class="info-item">
            <div class="info-key">{{ t('customers.name') }}:</div>
            <div class="info-value">{{ currentRow?.name || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-key">{{ t('customers.points') }}:</div>
            <div class="info-value">{{ currentRow?.points || '0' }}</div>
          </div>
          <div class="info-item">
            <div class="info-key">{{ t('customers.deductionPoints') }}:</div>
            <div class="info-value">{{ points.costPoints > 0 ? '-' : '' }}{{ points.costPoints }}</div>
          </div>
          <div class="info-item">
            <div class="info-key">{{ t('customers.residualPoints') }}:</div>
            <div class="info-value">{{ points?.restePoints }}</div>
          </div>
        </div>
      </div>
      <div class="top-search">
        <div class="left">
          <el-input
            v-model="params.keywords"
            class="top-input-search"
            :placeholder="t('customers.enterPointsSearch')"
            clearable
          />
          <el-button class="outer-btn right-box search-btn" @click="handleSearch">
            <div class="outer">
              <div class="inner-left">
                <i class="iconfont icon-sousuo"></i>
              </div>
              <div class="inner-right">
                <span> {{ t('employee.searchButton') }}</span>
              </div>
            </div>
          </el-button>
        </div>
      </div>

      <div class="section grn-section">
        <div class="table-container">
          <el-table
            ref="tableRef"
            :data="receiptTableData"
            style="width: 100%"
            size="small"
            border
            height="400"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center" fixed="left" width="55" />
            <el-table-column
              v-for="column in columnsClearing"
              :key="column.prop"
              :prop="column.prop"
              :label="t('customers.' + column.prop)"
              :width="column.width"
              :min-width="column['min-width']"
              :fixed="column.fixed"
              :align="column.align"
            >
            </el-table-column>
            <!-- 选择数量 -->
            <el-table-column :label="t('sales.QTY')" fixed="right" align="center" width="200">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.product_quantity"
                  :min="0"
                  :step="1"
                  :disabled="isMaxQuantity(scope.row)"
                  @input="handleInputDebounced(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="params.page_num"
              v-model:page-size="params.page_size"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next"
            />
          </div>
        </div>
      </div>

      <div class="footer-btn">
        <el-button class="outer-btn right-box search-btn" @click="submitExchangeGifts()">{{
          t('customers.save')
        }}</el-button>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { useI18n } from '@igourd/locales'
import { useConversionProducts } from '../hooks/use-conversion-products'

const { t } = useI18n()
const {
  Drawer,
  receiptTableData,
  total,
  selectedRows,
  tableRef,
  points,
  currentRow,
  params,
  columnsClearing,
  handleSelectionChange,
  isMaxQuantity,
  handleInputDebounced,
  handleSizeChange,
  handleCurrentChange,
  handleSearch,
  submitExchangeGifts,
} = useConversionProducts()
</script>

<style scoped>
.page-container {
  background-color: #fff;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

/* 标题样式：左边小蓝竖线，文字 */
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title-deco {
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #409eff;
  border-radius: 2px;
  margin-right: 8px;
}
.title-text {
  font-size: 16px;
  font-weight: bold;
}

.basic-info-section {
  /* 根据需要可加边框或内边距 */
  padding-bottom: 10px;
}

.basic-info-content {
  /* 纵向排列 key-value */
  display: flex;
  flex-direction: column;
}
.info-item {
  display: flex;
  margin-bottom: 5px;
  font-size: 14px;
}
.info-key {
  width: 145px;
  text-align: right;
  /* font-weight: bold; */
  padding-right: 10px;
  color: #333;
  margin-bottom: 5px;
}
.info-value {
  flex: 1;
  text-align: left;
  color: #666;
}

/* 分割线 */
.divider-line {
  height: 1px;
  background: #eaeaea;
  margin: 20px 0;
}

/* Goods Receipt Note No. 区域 */
.grn-section {
  padding-bottom: 20px;
}

/* 表格 */
.table-container {
  border: 1px solid #eaeaea;
}

/* 表头文字样式 */
:deep(.table-container .el-table__header-wrapper th) {
  background: #f5f7fa;
  font-weight: 400;
  color: #333;
  font-size: 14px;
}

/* 列文字样式 */
:deep(.el-table__body-wrapper td) {
  font-size: 14px;
  color: #333;
}

/* 固定列的阴影 */
:deep(.el-table__fixed),
:deep(.el-table__fixed-right) {
  box-shadow: none;
}

/* 底部按钮 */
.footer-btn {
  margin-top: 20px;
  text-align: center;
}
.footer-btn .el-button {
  border-radius: 4px;
  font-size: 14px;
  padding: 8px 20px;
}
.top-search {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 15px;
  /* //justify-content: space-between; */
  .left {
    /* margin-left: 21px; */

    .role-btn {
      margin-left: 10px;
      background-color: #4a9ffc;
      color: #ffffff;
    }
  }

  .right {
    .role-add {
      margin-right: 10px;
      background-color: #005cff;
      color: #ffffff;
    }
  }
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
.text-red {
  color: #ff4d4f;
}
</style>
