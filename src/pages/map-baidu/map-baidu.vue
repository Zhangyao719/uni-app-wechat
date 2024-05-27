<script lang="ts" setup>
import type { UniSearchBarBaseEvent } from '@uni-helper/uni-ui-types'
// import type { MapMarker } from '@uni-helper/uni-app-types'
import { ref, reactive, onMounted } from 'vue'
import BaiduMapWX from '@/lib/bmap-wx'

const wxMarkerData = []
const longitude = ref()
const latitude = ref()
const markers = ref([])
const placeData = reactive({
  title: '',
  address: '',
  telephone: '',
})
const keyword = ref<string | number>('')

const baiduMapSDK = new BaiduMapWX({
  ak: 'VHz9gXZ3boJkS7xozrHrHXvjA6itFZnj',
})

const showSearchInfo = (i: number) => {
  if (markers.value.length) {
    const { title, address, telephone } = markers.value[i]
    placeData.title = '名称：' + title + '\n'
    placeData.address = '地址：' + address + '\n'
    placeData.telephone = '电话：' + telephone
  }
}

// const changeMarkerColor = (data, i) => {
//   const markerArr = []
//   for (var j = 0; j < data.length; j++) {
//     if (j == i) {
//       // 此处需要在相应路径放置图片文件
//       data[j].iconPath = '@/static/images/marker_yellow.png'
//     } else {
//       // 此处需要在相应路径放置图片文件
//       data[j].iconPath = '@/static/images/marker_red.png'
//     }
//     markerArr[j](data[j])
//   }

//   markers.value = markerArr
// }

const handleMakerTap = (e) => {
  console.log('🚀 ~ MakerTap:', e)
  showSearchInfo(e.markerId)
  // changeMarkerColor(e.markerId)
}

const handleSearch = (e: UniSearchBarBaseEvent) => {
  keyword.value = e.value
  baiduMapSDK.search({
    query: e.value,
    success({ wxMarkerData /* , originalData */ }) {
      console.log('🚀 ~ wxMarkerData:', wxMarkerData)
      const markerList = wxMarkerData.map((m) => ({ ...m, width: 25, height: 35 }))
      markers.value = markerList
      latitude.value = markerList[0].latitude
      longitude.value = markerList[0].longitude
    },
    fail(err) {
      console.log('baidu search fail:', err)
    },
    // iconPath: '../../static/images/marker_red.png',
    // iconTapPath: '../../static/images/marker_yellow.png',
  })
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
      :bindmarkertap="handleMakerTap"
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
