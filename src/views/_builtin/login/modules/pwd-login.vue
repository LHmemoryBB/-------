<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { $t } from "@/locales";
import { loginModuleRecord } from "@/constants/app";
import { useRouterPush } from "@/hooks/common/router";
import { useAntdForm, useFormRules } from "@/hooks/common/form";
import { useAuthStore } from "@/store/modules/auth";
import Verify from "@/components/verifition/Verify.vue";
import md5 from "js-md5";

defineOptions({
  name: "PwdLogin"
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useAntdForm();

interface FormModel {
  username: string;
  password: string;
}

const model: FormModel = reactive({
  username: "admin",
  password: "Aa123123@",
  captchaVerification: ""
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { loginFormRules } = useFormRules();  
  return {
    username: loginFormRules.username,
    password: loginFormRules.password
  };
});
const verify = ref(null)
async function handleSubmit() {
  await validate();  
  verify?.value.show()
  
}
async function success (res) {
  model.captchaVerification = res.captchaVerification
  const md5Pwd = md5(model.password)
  await authStore.login(model.username, md5Pwd, model.captchaVerification);
}
</script>

<template>
  <AForm ref="formRef" :model="model" :rules="rules">
    <AFormItem name="username">
      <AInput
        v-model:value="model.username"
        size="large"
        :placeholder="$t('page.login.common.userNamePlaceholder')"
      />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword
        v-model:value="model.password"
        size="large"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <ACheckbox>{{ $t("page.login.pwdLogin.rememberMe") }}</ACheckbox>
        <AButton type="text" @click="toggleLoginModule('reset-password')">
          {{ $t("page.login.pwdLogin.forgetPassword") }}
        </AButton>
      </div>
      <AButton
        type="primary"
        block
        size="large"
        shape="round"
        :loading="authStore.loginLoading"
        @click="handleSubmit"
      >
        {{ $t("common.confirm") }}
      </AButton>
    </ASpace>
    <Verify
      @success="success"
      mode="pop"
      captchaType="blockPuzzle"
      :imgSize="{ width: '330px', height: '155px' }"
      ref="verify"
    />
  </AForm>
</template>

<style scoped></style>
