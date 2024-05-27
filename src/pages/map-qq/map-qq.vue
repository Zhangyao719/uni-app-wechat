<script lang="ts" setup>
import type { UniSearchBarBaseEvent } from '@uni-helper/uni-ui-types'
import { ref, onMounted } from 'vue'
import QQMapWX from '@/lib/qqmap-wx-jssdk'

const longitude = ref()
const latitude = ref()
const markers = ref([])
const keyword = ref<string | number>('')
const qqMapSDK = new QQMapWX({
  key: 'ANZBZ-HWSLL-YWHPF-EAMP4-AIMOS-PDFT2',
})

const handleSearch = (e: UniSearchBarBaseEvent) => {
  keyword.value = e.value
  qqMapSDK.search({
    keyword: e.value,
    success(res) {
      console.log('🚀 ~ res:', res)
      // markers.value = res.data
    },
    fail(err) {
      console.log('🚀 ~ err:', err)
    },
  })
}

onMounted(() => {
  console.log('qqmap: ', qqMapSDK)

  uni.getLocation({
    type: 'gcj02',
    success(res) {
      console.log('🚀 ~ res:', res)
      latitude.value = res.latitude
      longitude.value = res.longitude
    },
    fail(err) {
      console.log('🚀 ~ err:', err)
    },
  })
})
</script>

<template>
  <view class="map_container">
    <map
      class="map"
      id="map"
      show-location
      :longitude="longitude"
      :latitude="latitude"
      :scale="14"
      :markers="markers"
      enable-poi
      bindmarkertap="makertap"
    ></map>
  </view>
  <view class="rgc_info">
    <text>经度：{{ longitude }}</text>
    <text>纬度：{{ latitude }}</text>
    <uni-search-bar
      v-model="keyword"
      placeholder="搜索园区车间"
      clearButton="always"
      cancelButton="none"
      @confirm="handleSearch"
      @clear="keyword = ''"
    />
  </view>
</template>

<style scoped lang="scss">
.map_container {
  height: 420px;
  width: 100%;
}

.map {
  height: 100%;
  width: 100%;
}

.rgc_info {
  padding: 5px 5px;
}

.rgc_info text {
  display: block;
}
</style>
