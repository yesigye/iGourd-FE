<script setup lang="ts">
import { useSettingCodeRulesForm } from '../hooks/use-setting-code-rules-form';

const { Drawer, Form, codeRulesInfo } = useSettingCodeRulesForm();
</script>

<template>
  <Drawer>
    <section class="mb-2.5 text-center">
      <h2 class="text-sm font-bold">{{ codeRulesInfo?.preview }}</h2>
      <h2 class="font-400 text-xs">{{ codeRulesInfo?.rules }}</h2>
    </section>
    <Form />
  </Drawer>
</template>
<style lang="scss">
.code-rules-array-cards {
  .el-card {
    width: 100%;
  }

  .formily-element-plus-array-cards {
    display: flex;
    gap: 10px;

    .formily-element-plus-array-cards-item {
      flex: 1 1 0;
      width: 100%;
    }
  }
}
</style>
