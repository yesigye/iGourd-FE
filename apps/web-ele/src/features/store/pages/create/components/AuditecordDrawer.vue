<script lang="ts" setup>
import { ref } from 'vue';

import { ElEmpty, ElTimeline, ElTimelineItem } from '@igourd/common-ui';

import { basicsMerchantReviewLogList } from '@@/store/apis';

import { BasicDrawer, useDrawerInner } from '#/components/DrawerTemplate';

const activities = ref<any[]>([]);
const [registerModal, { closeDrawer, setDrawerProps }] = useDrawerInner(
  async (params) => {
    try {
      setDrawerProps({ loading: true });
      const merchantEnrollModel = params.merchantEnrollModel;
      activities.value = await basicsMerchantReviewLogList({
        merchant_enroll_id: merchantEnrollModel.id,
        page_num: 1, //	integer($int64) 当前页码
        page_size: 100, //	integer($int64) 每页条数
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  },
);

function handleCancel() {
  closeDrawer();
}
</script>

<template>
  <BasicDrawer
    v-bind="$attrs"
    :size="648"
    :title="$t('store.store-list.audit-record')"
    :show-footer="false"
    @register="registerModal"
    @close="handleCancel"
  >
    <div class="audite">
      <ElTimeline v-if="activities?.length">
        <ElTimelineItem
          v-for="(activity, index) in activities"
          center
          class="audite-item"
          :key="index"
          :color="activity.color"
        >
          <div class="audite-item-content">
            <div class="audite-item-message">{{ activity.review_opinion }}</div>
            <div class="audite-item-time">{{ activity.review_time }}</div>
          </div>
        </ElTimelineItem>
      </ElTimeline>
      <template v-else>
        <ElEmpty :description="$t('store-complete.empty-text')" />
      </template>
    </div>
  </BasicDrawer>
</template>

<style lang="scss" scoped>
.audite {
  padding: 30px;
}

.audite-item {
  &-content {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #000;
  }

  &-message {
    box-sizing: border-box;
    padding-right: 40px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #000;
  }

  &-time {
    font-size: 12px;
    color: #666;
    text-align: right;
  }
}
</style>
