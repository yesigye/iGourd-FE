<script setup lang="ts">
import type { Recordable } from '@igourd/types';

// import type { IgourdFormSchema } from '@igourd-core/form-ui';

import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@igourd/locales';

// import { useIgourdForm } from '@igourd-core/form-ui';
import { IgourdButton } from '@igourd-core/shadcn-ui';

import Title from './auth-title.vue';

interface Props {
  formSchema?: any[];
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;
  /**
   * @zh_CN 登录路径
   */
  loginPath?: string;
  /**
   * @zh_CN 标题
   */
  title?: string;
  /**
   * @zh_CN 描述
   */
  subTitle?: string;
  /**
   * @zh_CN 按钮文本
   */
  submitButtonText?: string;
}

defineOptions({
  name: 'RegisterForm',
});

const props = withDefaults(defineProps<Props>(), {
  formSchema: () => [],
  loading: false,
  loginPath: '/auth/login',
  submitButtonText: '',
  subTitle: '',
  title: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

// const [Form, formApi] = useIgourdForm(
//   reactive({
//     commonConfig: {
//       hideLabel: true,
//     hideRequiredMark: true,
//   },
//     schema: computed(() => props.formSchema),
//     showDefaultActions: false,
//   }),
// );
const Form = null;
const formApi = null;

const router = useRouter();

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    emit('submit', values as { password: string; username: string });
  }
}

function goToLogin() {
  router.push(props.loginPath);
}

defineExpose({
  getFormApi: () => formApi,
});
</script>

<template>
  <div>
    <Title>
      <slot name="title">
        {{ title || $t('authentication.create-an-account') }} 🚀
      </slot>
      <template #desc>
        <slot name="subTitle">
          {{ subTitle || $t('authentication.sign-upSubtitle') }}
        </slot>
      </template>
    </Title>
    <!-- <Form /> -->

    <IgourdButton
      :class="{
        'cursor-wait': loading,
      }"
      :loading="loading"
      aria-label="register"
      class="mt-2 w-full"
      @click="handleSubmit"
    >
      <slot name="submitButtonText">
        {{ submitButtonText || $t('authentication.sign-up') }}
      </slot>
    </IgourdButton>
    <div class="mt-4 text-center text-sm">
      {{ $t('authentication.already-have-account') }}
      <span class="igourd-link text-sm font-normal" @click="goToLogin()">
        {{ $t('authentication.go-to-login') }}
      </span>
    </div>
  </div>
</template>
