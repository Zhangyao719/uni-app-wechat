<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import BaiduMapWX from '@/lib/bmap-wx'
import type { UniSearchBarBaseEvent } from '@uni-helper/uni-ui-types'
import type { MapOnMarkertapEvent } from '@uni-helper/uni-app-types'
import type { BMapMarker, BMapSearchParam } from '@/types/map'

const longitude = ref()
const latitude = ref()
const markers = ref<BMapMarker[]>([])
const placeData = reactive({
  title: '',
  address: '',
  telephone: '',
})
const keyword = ref<string | number>('')

const baiduMapSDK = new BaiduMapWX({
  ak: 'VHz9gXZ3boJkS7xozrHrHXvjA6itFZnj',
})

const showTagInfo = (id: number) => {
  const { title, address, telephone = '' } = markers.value[id]
  placeData.title = '名称：' + title
  placeData.address = '地址：' + address
  placeData.telephone = '电话：' + telephone
}

// prettier-ignore
const changeMarkerColor = (id: number) => {
  markers.value.forEach((m, index) => {
    m.iconPath = id === index
      ? '../../static/images/marker_yellow.png'
      : '../../static/images/marker_red.png'
  })
}

const handleMakerTap = (e: MapOnMarkertapEvent) => {
  console.log('🚀 ~ MakerTap:', e)
  showTagInfo(e.markerId)
  changeMarkerColor(e.markerId)
}

const handleSearch = (e: UniSearchBarBaseEvent) => {
  keyword.value = e.value
  baiduMapSDK.search({
    query: e.value,
    success({ wxMarkerData /* , originalData */ }) {
      console.log('🚀 ~ wxMarkerData:', wxMarkerData)
      markers.value = wxMarkerData
    },
    fail(err) {
      console.log('baidu search fail:', err)
    },
    iconPath: '../../static/images/marker_red.png',
    iconTapPath: '../../static/images/marker_yellow.png',
    width: 25,
    height: 35,
    alpha: 0.9,
  } as BMapSearchParam)
}

onMounted(() => {
  uni.getLocation({
    type: 'gcj02',
    success(res) {
      latitude.value = res.latitude
      longitude.value = res.longitude
    },
    fail(err) {
      console.log('wx getLocation fail: ', err)
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
      @markertap="handleMakerTap"
    ></map>
  </view>
  <view class="rgc_info">
    <text>经度：{{ longitude }}</text>
    <text>纬度：{{ latitude }}</text>
    <text>{{ placeData.title }}</text>
    <text>{{ placeData.address }}</text>
    <text>{{ placeData.telephone }}</text>
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
