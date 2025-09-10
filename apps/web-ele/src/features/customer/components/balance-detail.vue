<template>
  <Drawer>
    <div class="drawer-content">
      <div class="content-tab">
        <div class="top-search">
          <div class="left">
            <el-input
              v-model="balance_params.keywords"
              style="width: 446px; height: 36px"
              :placeholder="t('customers.pleaseenterkeywordssearch')"
              clearable
              @clear="refreshBalanceList()"
            />
            <el-button
              class="outer-btn right-box search-btn"
              @click="refreshBalanceList()"
            >
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
      </div>
      <div class="content-item">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-change="handleTabChange"
        >
          <el-tab-pane :label="t('customers.recharge')" name="RECHARGE">
            <div
              v-for="(item, index) in balanceData?.list"
              :key="index"
              class="box"
            >
              <div class="top">
                <span class="item"></span>
                <span class="item">{{ t('customers.successful') }}</span>
              </div>
              <div class="bot">
                <span
                  >{{ t('customers.customerName') }}
                  {{ item?.customer_name }}</span
                >
                <span></span>
              </div>
              <div class="bot">
                <span
                  >{{ t('customers.customerLabelCreateTime') }}:{{
                    item?.create_time
                  }}</span
                >
                <span></span>
              </div>
              <div class="bot operator">
                <span class="item"
                  >{{ t('customers.creator') }} {{ item.creator_id }}</span
                >
                <span class="amount"
                  >{{ t('customers.amount') }}
                  <i>{{ item?.change_amount }}$</i></span
                >
              </div>
            </div>
            <pagination
              v-model:page="balance_params.page_num"
              v-model:limit="balance_params.page_size"
              :total="parseInt(balanceData?.total)"
              :total-count="balanceData?.total"
              @size-change="handleSizeChange"
              @current-change="handlePaginationChange"
            />
          </el-tab-pane>
          <el-tab-pane :label="t('customers.consume')" name="CONSUMPTION">
            <div
              v-for="(item, index) in balanceData?.list"
              :key="index"
              class="box"
            >
              <div class="top">
                <span class="item"></span>
                <span class="item">{{ t('customers.successful') }}</span>
              </div>
              <div class="bot">
                <span
                  >{{ t('customers.customerName') }}
                  {{ item?.customer_name }}</span
                >
                <span></span>
              </div>
              <div class="bot">
                <span
                  >{{ t('customers.customerLabelCreateTime')
                  }}{{ item?.create_time }}</span
                >
                <span></span>
              </div>
              <div class="bot operator">
                <span class="item"
                  >{{ t('customers.creator') }} {{ item.creator_id }}</span
                >
                <span class="amount"
                  >{{ t('customers.amount') }}
                  <i>{{ item?.change_amount }}$</i></span
                >
              </div>
            </div>
            <pagination
              v-model:page="balance_params.page_num"
              v-model:limit="balance_params.page_size"
              :total="parseInt(balanceData?.total)"
              :total-count="balanceData?.total"
              @size-change="handleSizeChange"
              @current-change="handlePaginationChange"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { useI18n } from '@igourd/locales'
import Pagination from '@/components/Pagination/Index.vue'
import { useBalanceDetail } from '../hooks/use-balance-detail'

const { t } = useI18n()
const {
  Drawer,
  activeName,
  balance_params,
  balanceData,
  handleTabChange,
  refreshBalanceList,
  handlePaginationChange,
  handleSizeChange,
} = useBalanceDetail()
</script>

<style lang="scss">
.content-item {
  .el-tabs__nav-wrap::after {
    background-color: transparent !important;
  }
}
</style>

<style lang="scss" scoped>
.select-flex-btn {
  display: flex;
  width: 100%;
  .el-select {
    flex: 1;
  }
  .el-button {
    background: #005cff;
    color: #fff;
    font-size: 14px;
    display: flex;
    margin-left: 5px;
    .iconfont {
      margin-right: 5px;
    }
  }
}
.upload-files-box {
  .upload-files-icon {
    width: 80px;
    height: 80px;
    line-height: 80px;
    position: relative;
    text-align: center;
    border-radius: 4px;
    border: 1px dashed #c0c4cc;
    background: #f6f8fc;
    .iconfont {
      font-size: 23px;
      color: #a8abb2;
    }
  }
}
.list-box {
  .list-box-title {
    border-bottom: 1px solid #e2e7f5;
    padding-bottom: 8px;
    margin-bottom: 20px;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 12px;
      background: #005cff;
      margin-right: 5px;
    }
  }
  .list-box-content {
    .el-row {
      width: 100%;
    }
  }
}
.action-box {
  .iconfont {
    font-size: 16px;
    color: #5e7987;
    cursor: pointer;
  }
  .icon-shanchu2 {
    color: #ff0000;
    margin-left: 12px;
  }
}
.options-span {
  cursor: pointer;
}

.drawer-title {
  height: 112px;
  text-align: left;
  padding-top: 37px;
  padding-left: 50px;
  border-bottom: 1px solid #eeeeee;
  .title {
    font-size: 24px;

    .icon-bangzhu {
      color: #7d90b2;
    }
  }
}

.header-bg {
  background-color: red;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.content-tab {
  font-size: 16px;
  color: #323232;
  .tab-account {
    .tab-top {
      display: flex;
      justify-content: space-between;
    }
    .from-title {
      margin-bottom: 24px;
      span {
        display: inline-block;
        width: 134px;
        text-align: right;
      }
      i {
        color: #ff0000;
        margin-right: 20px;
      }
    }
  }
}
.content-item {
  font-size: 14px;
  margin-top: 17px;
  .box {
    width: 95%;
    margin-top: 20px;
    border: 1px solid #0d99ff;
  }
  .top {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;
    border-bottom: 1px dashed #0d99ff;
    .item:nth-child(2) {
      color: #15c82b;
    }
  }
  .bot {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;
  }
  .operator {
    .item {
      padding-top: 15px;
    }
    .amount {
      i {
        font-size: 24px;
        color: #fc5c65;
      }
    }
  }
  .page {
    padding-right: 30px;
  }
}
.down-table-box {
  width: 100%;
  margin-top: 20px;
  .list-box {
    height: 568px;
  }
  .item1 {
    padding: 10px;
    margin: 0px 10px 0px 0px;
    border: 1px solid #eeeeee;
  }
  .item2 {
    padding: 10px;
    margin: 0px 10px 0px 0px;
    border: 1px solid #eeeeee;
  }
}
</style>
