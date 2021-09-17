<template>
  <div class="van-coupon">
    <div class="van-coupon__content">
      <div class="van-coupon__head">
        <h2 class="van-coupon__amount">{{ coupon.subMoney }}<span>元</span></h2>
        <p class="van-coupon__condition">最低消费: {{ coupon.minCharge }}元</p>
      </div>
      <div class="van-coupon__body">
        <p class="van-coupon__name">{{ coupon.couponName }}</p>
        <p class="van-coupon__valid">开始时间: {{ timeData.start }}</p>
        <p class="van-coupon__valid">结束时间: {{ timeData.end }}</p>
        <p style="text-align: right;">
          <van-button v-if="true" size="mini" type="warning" @click="receiveCoupon">领取</van-button>
          <span v-else >已领取</span>
        </p>
        <div
          role="checkbox"
          class="van-checkbox van-coupon__corner"
        >
          
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref, PropType, computed } from 'vue';
import { IUserInfo } from '@/App.vue'
import { CouponData } from './coupon-list.vue'
import { Notify } from 'vant'
import dayJS from 'dayjs'
import request from '@/request';

export default defineComponent({
  props: {
    coupon: {
      type: Object as PropType<CouponData>,
      required: true
    }
  },
  setup(props) {
    const { coupon } = props
    const userInfo = inject<Ref<IUserInfo | null>>('userInfo')
    const toggleShow = inject<Function>('toggleShow')

    const timeData = computed(() => {
      const { isPermanent, startTime, endTime } = props.coupon
      const result = {
        start: dayJS(startTime).format('YYYY.MM.DD'),
        end: dayJS(endTime).format('YYYY.MM.DD')
      }
      
      if (props.coupon.isPermanent) {
        result.end = '永久有效'
      }

      return  result
    })

    /** 领取优惠券 */
    const receiveCoupon = () => {
      if (userInfo!.value === null) {
        toggleShow!()
      }

      request.post('/coupons/receiveCoupons', { 
        userId: userInfo!.value!._id,
        couponId: props.coupon._id 
      })
      .then(res => {
        const { msg } = res.data
        Notify({ type: 'success', message: msg });

      })
    }

    return {
      userInfo,
      toggleShow,
      timeData,
      receiveCoupon
    }
  }
})
</script>

<style>
  .van-coupon__body {
    overflow: hidden;
    padding-right: 10px;
  }

  /* .van-coupon__body .van-coupon__name,
  .van-coupon__body .van-coupon__valid {
    display: -webkit-box; 
    -webkit-line-clamp: 2;  
    -webkit-box-orient: vertical;  
    overflow: hidden;
    white-space: nowrap;
  } */
</style>