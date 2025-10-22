<script setup lang="ts">
// import type { IgourdFormSchema } from '@igourd-core/form-ui';

import { useRouter } from 'vue-router';

import { $t } from '@igourd/locales';

// import { useIgourdForm } from '@igourd-core/form-ui';
import { IgourdButton } from '@igourd-core/shadcn-ui';

import Title from './auth-title.vue';

interface Props {
  formSchema: any[];
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
  name: 'ForgetPassword',
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loginPath: '/auth/login',
  submitButtonText: '',
  subTitle: '',
  title: '',
});

const emit = defineEmits<{
  submit: [Record<string, any>];
}>();

// const [Form, formApi] = useIgourdForm(
//   reactive({
//     commonConfig: {
//       hideLabel: true,
//       hideRequiredMark: true,
//     },
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
    emit('submit', values);
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
        {{ title || $t('authentication.forget-password') }} 🤦🏻‍♂️
      </slot>
      <template #desc>
        <slot name="subTitle">
          {{ subTitle || $t('authentication.forget-passwordSubtitle') }}
        </slot>
      </template>
    </Title>
    <!-- <Form /> -->

    <div>
      <IgourdButton
        :class="{
          'cursor-wait': loading,
        }"
        aria-label="submit"
        class="mt-2 w-full"
        @click="handleSubmit"
      >
        <slot name="submitButtonText">
          {{ submitButtonText || $t('authentication.send-reset-link') }}
        </slot>
      </IgourdButton>
      <IgourdButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
        {{ $t('common.back') }}
      </IgourdButton>
    </div>
  </div>
</template>
