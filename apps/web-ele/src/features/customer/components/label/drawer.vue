<script setup lang="ts">
import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const { t } = useI18n();
const [Drawer, drawerApi] = useIgourdDrawer({
  title: t('product-label.add-product-label'),
  width: '50%',
});
</script>

<template>
  <Drawer>
    <div>ddd</div>
  </Drawer>
</template>
