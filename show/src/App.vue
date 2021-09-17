<template>
  <div>
    <van-search v-model="searchVal"  placeholder="请输入搜索关键词" @search="handleSearch" />

    <van-tabs type="card"  @click="handleClickTab"  animated swipeable sticky>
      <van-tab title="查找优惠券" ><CouponList :active="currentTab === 0" /></van-tab>
      <van-tab title="我的优惠券" ><MyCoupon :active="currentTab === 1" /></van-tab>
    </van-tabs>

    <LoginWithRegister :isShow="isShowFormDialog" />
   
  </div>
</template> 

<script lang="ts">
import { defineComponent, ref, provide, computed, watchEffect, reactive } from 'vue';
import MyCoupon from './components/my-coupon.vue'
import CouponList from './components/coupon-list.vue'
import LoginWithRegister from './components/login-with-register.vue'
import request, { LOCAL_TOKEN_KEY } from './request'
import { Notify } from 'vant'

export interface IUserInfo {
  account: string
  type: number

  [props: string]: any
}


export default defineComponent({
  components: {
    MyCoupon,
    CouponList,
    LoginWithRegister
  },
  name: 'App',
  setup() {
   /** 展示登录弹框 */ 
   const isShowFormDialog = ref(false)

   const searchVal = ref('')

   const handleSearch = () => {
     Notify({ type: 'warning', message: '暂未开发' })
   }

   
   /** 当前标签 */ 
   const currentTab = ref(0)
   
   const handleClickTab = (index: number) => {
     currentTab.value = index
   }


   
   function toggleShow() {
     
     isShowFormDialog.value = isShowFormDialog.value === false
   } 

   provide('toggleShow', toggleShow)

   /** 用户信息 */
   const userInfo = ref<null | IUserInfo>(null)

   function setUserInfo(info: null | IUserInfo) {
     console.log(info)
     userInfo.value = info
   }

   provide('userInfo', computed(() => userInfo.value))
   provide('setUserInfo', setUserInfo)

   /** 获取用户信息 */
   watchEffect(() => {
     const localToken = window.localStorage.getItem(LOCAL_TOKEN_KEY)
     request.get('/getUserInfo').then(res => {
       const { code, data } = res.data
       if (code === 200 && data._id) {
         setUserInfo(data)
       } else {
         window.localStorage.removeItem(LOCAL_TOKEN_KEY)
       }
     })
     .catch(() => {
         window.localStorage.removeItem(LOCAL_TOKEN_KEY)
     })
   })

    return {
      isShowFormDialog,
      searchVal,
      handleSearch,
      currentTab,
      handleClickTab,
    }
  }, 
});
</script>

