<script lang="ts" setup>
import { ElStep, ElSteps } from '@igourd/common-ui';

type SetpItem = { title: string };
interface PropsType {
  setpActive: number;
}

// 定义子组件传递参数，设置默认值
withDefaults(defineProps<PropsType>(), {
  setpActive: 0,
});

const setpList: SetpItem[] = [
  { title: 'login.createStore' },
  { title: 'login.selectPackage' },
  { title: 'login.payment' },
  { title: 'login.paymentComplete' },
];
</script>

<template>
  <div class="setp">
    <div class="setp-container">
      <ElSteps
        :space="10000"
        align-center
        :active="setpActive"
        finish-status="success"
      >
        <ElStep
          v-for="(item, index) in setpList"
          :title="$t(item.title)"
          :key="index"
        />
      </ElSteps>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.setp {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  background-color: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;

  &-container {
    width: 100%;
  }
}
</style>
