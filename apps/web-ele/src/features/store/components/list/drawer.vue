<script lang="ts" setup>
import { useTemplateRef } from 'vue';

import { useStoreForm } from '@@/store/hooks';
import StoreCrateForm from '@@/store/pages/create/components/StoreCrateForm.vue';

const storeFormRef =
  useTemplateRef<InstanceType<typeof StoreCrateForm>>('storeForm');

const { Drawer } = useStoreForm(storeFormRef);
</script>

<template>
  <Drawer>
    <StoreCrateForm :show-submit="false" :is-update="true" ref="storeForm" />
  </Drawer>
</template>
