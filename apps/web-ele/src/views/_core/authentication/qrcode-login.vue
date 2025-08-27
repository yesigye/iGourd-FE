<script lang="ts" setup>
import { AuthenticationQrCodeLogin } from '@igourd/common-ui';
import { LOGIN_PATH } from '@igourd/constants';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
