<script lang="ts" setup>
import { IgourdSpinner } from '@igourd-core/shadcn-ui';

import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContentSpinner' });

const { spinning } = useContentSpinner();
</script>
<template>
  <IgourdSpinner :spinning="spinning" />
</template>
