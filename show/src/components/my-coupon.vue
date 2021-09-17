<template>
  <div>
    <template v-if="userInfo">
      <div class="coupon-list">
        <div class="user-info"><span>账号: {{ userInfo.account }}</span> <van-button  size="mini" type="danger" @click="handleLogout">退出登录</van-button></div>
        <div  class="van-tab__pane" v-if="receiveCoupons.length" >
          <div class="van-coupon-list__list">
            <div v-for="receiveCoupon in receiveCoupons" :key="receiveCoupon._id" class="van-coupon" >
                <div class="van-coupon__content">
                  <div class="van-coupon__head" >
                    <h2 class="van-coupon__amount">{{ receiveCoupon.coupon.subMoney }}<span>元</span></h2>
                    <p class="van-coupon__condition">最低消费: {{ receiveCoupon.coupon.minCharge }}元</p>
                  </div>
                  <div class="van-coupon__body">
                    <p class="van-coupon__name">{{ receiveCoupon.coupon.couponName }}</p>
                    <p class="van-coupon__valid">{{ getValidTime(receiveCoupon.coupon) }}</p>
                    <p class="van-coupon__valid">领取时间：{{ formatTime(receiveCoupon.createdAt) }}</p>
                  </div>
                  <p style="padding: 0 8px 0 5px;">
                    <van-button v-if="receiveCoupon.used === false" size="mini" @click="chargeCoupon(receiveCoupon)">使用</van-button>
                    <van-button  v-else  size="mini" type="danger" @click="cleanReceiveCoupon(receiveCoupon._id)">清除</van-button>
                  </p>
                 <span v-if="receiveCoupon.used" class="used-flag">已使用</span>
                </div>
            </div>
          </div>
        </div>
        
        <van-divider v-else>没有更多优惠券了</van-divider>
        <!-- 用户信息  -->
      </div>
    </template>
    <template v-else>
      <van-divider>
        <span @click="toggleShow">点击登录</span>
      </van-divider>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref, watchEffect } from 'vue'
import { IUserInfo } from '@/App.vue'
import { Dialog, Toast } from 'vant'
import request, { LOCAL_TOKEN_KEY } from '@/request'
import { CouponData } from './coupon-list.vue'
import dayJS from 'dayjs'

interface ReceiveData {
  _id: string

  coupon: CouponData
  /** 是否被使用 */
  used: boolean
  /** 领取时间 */
  createdAt: string

  [propName: string]: any
}
 
export default defineComponent({
  name: 'my-coupon',
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const receiveCoupons = ref<ReceiveData []>([])
    const userInfo = inject<Ref<IUserInfo>>('userInfo')
    const toggleShow = inject<Ref<any>>('toggleShow')
    const setUserInfo: any = inject('setUserInfo')
    /** 核销优惠券，对应领取的Id */
    const currentReceiveCoupon = ref<ReceiveData | null>(null)

    const toggleRefreshFlag = ref<Boolean>(false)

    /** 退出登录 */
    const handleLogout = () => {
      // 清除token
      window.localStorage.removeItem(LOCAL_TOKEN_KEY)

      // 清除本地用户信息
      setUserInfo(null)
    }

    const getValidTime = (coupon: CouponData) => {
      const { isPermanent, startTime, endTime } = coupon

      if (isPermanent) {
        return '永久有效'
      }

      return formatTime(startTime) + ' - ' + formatTime(endTime)
    }

    const formatTime = (time: string) => {
      return dayJS(time).format('YYYY.MM.DD')
    }

    /** 使用优惠券 */
    const useCoupon = (id: string) => {
      request.get('/coupons/useCoupon/' + id)
      .then(res => {
        const { code } = res.data
        if (code === 200) {
          toggleRefreshFlag.value = !toggleRefreshFlag.value 
          console.log('已成功使用')
        }
      })
    }

    /** 核销优惠券 */
    const chargeCoupon = (receiveCoupon: ReceiveData) => {
      currentReceiveCoupon.value = receiveCoupon

      /** 检查是否核销 */
      const checkHasCharge = async (resolve: Function) => {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
        })
        const { data: { data } } = await request.get('/coupons/checkCharge/' + receiveCoupon._id)
        if (data) {
          useCoupon(receiveCoupon._id)

          resolve(true)
        } else {
          Toast('暂未找到，请稍后重试')
          resolve(false)
        }
      }

      Dialog.confirm({
        title: '准备核销',
        message: `核销码: ${currentReceiveCoupon.value._id}`,
        confirmButtonText: '已核销',
        beforeClose(action: 'confirm' | 'cancel') {
          return new Promise((resolve) => {
            if (action === 'confirm') {
                /** 查询是否有记录 */
                checkHasCharge(resolve)

              } else {
                // 拦截取消操作
                resolve(true)
              }
          })
        }
      })
    }

    const cleanReceiveCoupon = (id: string) => {
      request.get('/coupons/cleanReceiveCoupon/' + id)
        .then(res => {
          const { code } = res.data
          if (code === 200) {
            toggleRefreshFlag.value = !toggleRefreshFlag.value 
          }
        })
    }

    watchEffect(() => {

      if (userInfo!.value === null) {
        return receiveCoupons.value = []
      }

      if (toggleRefreshFlag.value) {
        console.log('重新获取')
      }

      if (props.active) {
        request.get('/coupons/findAllCouponsByUser/' + userInfo!.value!._id)
          .then(res => {
            const { data } = res.data
            receiveCoupons.value = data.map((item: any) => {
              const { createdAt, couponId, used, _id } = item

              return {
                coupon: couponId,
                used,
                _id,
                createdAt
              }
            })
          })
      }
    })


    return {
      receiveCoupons,
      userInfo,
      toggleShow,
      useCoupon,
      chargeCoupon,
      cleanReceiveCoupon,
      handleLogout,
      getValidTime,
      formatTime
    }
  },
})
</script>

<style scoped>
  .coupon-list {
    padding: 16px;
  }

 .coupon-list .user-info {
   display: flex;
   justify-content: space-between;
   align-items: center;
 }

.van-coupon__content {
  position: relative;
}

.used-flag {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)   rotateZ(30deg) ;
  width: 80px;
  height: 40px;
  /* background: #EE0A24; */
  font-size: 18px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  color: #EE0A24;
  border: 1px solid #EE0A24;
}
</style>

