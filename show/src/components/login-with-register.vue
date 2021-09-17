<template>
  <van-dialog :show="isShow" :showConfirmButton="false" :title="isLoginForm ? '登录' : '注册'" @click-overlay="toggleShow">
    <van-form @submit="onSubmit" ref="formRef">
      <!-- 登录表单 -->
      <template v-if="isLoginForm">
        <van-field
          v-model="loginForm.account"
          name="account"
          label="账号"
          placeholder="账号/手机号"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          v-model="loginForm.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="text-align: right; font-size: 12px; color: rgba(0,0,0,.65); margin: 5px 16px;">
          没有账号？<span @click="isLoginForm = false">立即注册</span>
        </div>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </template>

      <!-- 注册表单 -->
      <template v-else>
        <van-field
          v-model="registerForm.account"
          name="account"
          label="账号"
          placeholder="账号"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          v-model="registerForm.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="registerForm.tel"
          name="tel"
          label="手机号"
          placeholder="手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <div style="text-align: right; font-size: 12px; color: rgba(0,0,0,.65); margin: 5px 16px;">
          已有账号？<span @click="isLoginForm = true">立即登录</span>
        </div>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </template>
    </van-form>
  </van-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject, watch } from 'vue';
import { Notify } from 'vant'
import request, { LOCAL_TOKEN_KEY } from '@/request';
import { AxiosError } from 'axios';
 
export default defineComponent({
  props: { 
    isShow: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const loginForm = reactive({
      account: '',
      password: '',
    });

    const registerForm = reactive({
      account: '',
      password: '',
      tel: ''
    });

    const formRef: any = ref(null)

    const isLoginForm = ref(true)

    const toggleShow: any = inject('toggleShow')

    const setUserInfo: any = inject('setUserInfo')

    watch([formRef, isLoginForm], () => {
      if (formRef.value === null) return

      Object.keys(loginForm).forEach(key => (loginForm as any)[key] = '')
      Object.keys(registerForm).forEach(key => (registerForm as any)[key] = '')

      formRef.value.resetValidation()
    })

    const onSubmit = (values: any) => {
      if (isLoginForm.value) {
        const { account, password } = values
        request.post('/login', {
          account,
          psw: password
        })
        .then(res => {
          const {
            code, 
            data: {
              token,
              userInfo
            }, msg 
          } = res.data
          if (code === 200) {
            if (userInfo.type !== 1) {
              return Notify({ type: 'warning', message: '用户类型不符合' });
            }
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token)
            setUserInfo(userInfo)
            toggleShow()
            Notify({ type: 'success', message: '登录成功' });
          } else {
            Notify({ type: 'danger', message: msg });

            window.localStorage.removeItem(LOCAL_TOKEN_KEY)
          }
        })
        .catch((err: AxiosError) => {
          if (err.response!.status === 400) {
            Notify({ type: 'danger', message: err.response!.data.message })
          } else {
            Notify({ type: 'danger', message: err.message })
          }

          window.localStorage.removeItem(LOCAL_TOKEN_KEY)
        })
      } else {
        const { account, password, tel } = values
        request.post('/users/addCommonUser', {
           account, password, tel 
        })
        .then(res => {
          const { code, msg } = res.data
          if (code === 200) {
            isLoginForm.value = true
            Notify({ type: 'success', message: '注册成功' });
          }else {
            Notify({ type: 'danger', message: msg });
          }
        })
        
      }
    } 

    return {
      loginForm,
      registerForm,
      isLoginForm,
      onSubmit,
      toggleShow,
      formRef
    };
  }
});
</script>

