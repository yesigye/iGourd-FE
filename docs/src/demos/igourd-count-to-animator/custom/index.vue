<script lang="ts" setup>
import { IgourdCountToAnimator } from '@igourd/common-ui';
</script>
<template>
  <IgourdCountToAnimator
    :duration="3000"
    :end-val="2000000"
    :start-val="1"
    prefix="$"
    separator="/"
  />
</template>
