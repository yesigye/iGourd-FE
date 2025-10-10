<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ElButton } from '@igourd/common-ui';

import { useDrawer } from '#/components/DrawerTemplate';

import AuditecordDrawer from './AuditecordDrawer.vue';
// import { useLogoutHooks } from '@/hooks/useLogoutHooks';

interface PropsType {
  merchantEnrollModel: any;
}
const props = withDefaults(defineProps<PropsType>(), {
  merchantEnrollModel: () => ({}),
});

const emits = defineEmits<{
  (e: 'place-back'): void; // 设置支付方式
}>();

const router = useRouter();

const enroll_status = computed(() => {
  return props?.merchantEnrollModel?.enroll_status;
});

const [auditecordDrawer, { openDrawer }] = useDrawer();

function handleButtonClick() {
  if (['PENDING'].includes(enroll_status.value)) {
    router.back();
  } else if (enroll_status.value === 'REJECTED') {
    emits('place-back');
  } else if (enroll_status.value === 'APPROVED') {
    // 退出登录
    router.replace('/store/list');
    // const logoutHooks = useLogoutHooks();
    // logoutHooks.logoutMessageTips();
  }
}

function openAuditecordDrawer() {
  const merchantEnrollModel = props.merchantEnrollModel;

  openDrawer(true, { merchantEnrollModel });
}
</script>

<template>
  <div class="Comp">
    <div class="Comp-container" :class="[`Comp-${enroll_status}`]">
      <div class="Comp-top">
        <div class="Comp-top-icon"></div>
        <div class="Comp-content">
          <div class="Comp-content-title">
            {{ $t(`storeComplete.creationTitle${enroll_status}`) }}
          </div>
          <div class="Comp-content-message">
            {{ $t(`storeComplete.creationMessage${enroll_status}`) }}
          </div>
        </div>
      </div>
      <div class="Comp-bottom">
        <a
          class="Comp-bottom-text"
          href="javascript:void(0)"
          @click="openAuditecordDrawer"
        >
          {{ $t('storeComplete.auditText') }}>>
        </a>
      </div>
    </div>
    <div class="Comp-footer">
      <ElButton
        class="Comp-footer-button"
        type="primary"
        @click="handleButtonClick"
      >
        {{ $t(`storeComplete.creationBtnText${enroll_status}`) }}
      </ElButton>
    </div>
    <AuditecordDrawer @register="auditecordDrawer" />
  </div>
</template>

<style lang="scss" scoped>
.Comp {
  padding: 34px 100px;
  // 入网状态(PENDING:等待中,APPROVED:审核通过,REJECTED:审核拒绝)

  &-APPROVED {
    background-color: #eaf9e6;

    .Comp-top-icon {
      background-image: url('@/assets/img/store/success.png');
    }

    .Comp-bottom-text {
      color: #67c23a;
    }
  }

  &-REJECTED {
    background-color: #ffe6e6;

    .Comp-top-icon {
      background-image: url('@/assets/img/store/error.png');
    }

    .Comp-bottom-text {
      color: #e74226;
    }
  }

  &-PENDING {
    background-color: #eaf9e6;

    .Comp-top-icon {
      background-image: url('@/assets/img/store/wrning.png');
    }

    .Comp-bottom-text {
      color: #ffa000;
    }
  }

  &-container {
    padding: 20px 24px;
  }

  &-top {
    display: flex;
    align-items: center;

    &-icon {
      width: 42px;
      height: 42px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
    }
  }

  &-content {
    box-sizing: border-box;
    flex: 1;
    padding-left: 14px;

    &-title {
      font-size: 20px;
      font-weight: 500;
      line-height: 42px;
      color: #000;
    }

    &-message {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #323232;
    }
  }

  &-bottom {
    padding-top: 38px;

    &-text {
      font-size: 14px;
    }
  }

  &-footer {
    margin-top: 100px;
    text-align: center;

    &-button {
      width: 160px;
      height: 50px;
    }
  }
}
</style>
