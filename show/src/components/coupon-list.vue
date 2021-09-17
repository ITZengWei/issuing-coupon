<template>
 <van-list>
    <div  class="van-tab__pane" style="background: #F7F8FA; padding: 10px 0;">
      <div class="van-coupon-list__list" >
          <coupon-item v-for="coupon in coupons" :coupon="coupon" :key="coupon._id" />
      </div>
      <van-divider>没有更多优惠券了</van-divider>
    </div>
  </van-list>
</template>


<script lang="ts">
import { defineComponent, ref, inject, Ref, watchEffect } from 'vue';
import request from '@/request';
import CouponItem from './coupon-item.vue'

export interface CouponData {
  _id: string,
  count: string
  couponName: string
  endTime: string
  isPermanent: boolean
  isStore: string
  startTime: string
  subMoney: number
  minCharge: number

  [propName: string]: any
}
export default defineComponent({
  components: {CouponItem},
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    /** 优惠券 */
    const coupons = ref<CouponData []>([])

    /** 加载状态 */
    const isLoading = ref(false)

    /** 是否完成 */
    const finished = ref(false)


    /** 获取优惠券列表 */
    watchEffect(() => {
      if (props.active) {
        request.get('/coupons/findAllCoupons').then(res => {
          const { code, data } = res.data
          coupons.value = data
        })
      }
    })

    const onLoad = () => {
      console.log('load')
    }

    return {
      coupons,
      isLoading,
      onLoad,
      finished
    }
  }
})
</script>

