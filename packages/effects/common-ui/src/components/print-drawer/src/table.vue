<script lang="ts" setup>
import { useIgourdVxeGrid } from '@igourd/plugins/vxe-table';

const props = defineProps<{ gridOptions: Record<string, any> }>();

const [Grid] = useIgourdVxeGrid(props.gridOptions);
</script>
<template>
  <Grid />
</template>
