import type { MapMarker } from '@uni-helper/uni-app-types'

// 百度地图 https://github.com/baidumapapi/wxapp-jsapi

/** 百度地图标注点 */
export interface BMapMarker extends MapMarker {
  address?: string
  telephone?: string
  iconTapPath?: string
}

/** 百度失败信息 */
export interface BMapError {
  errMsg: string
  statusCode: number
}

/** 百度 POI 检索参数 */
export interface BMapSearchParam {
  iconPath: string
  location?: string
  iconTapPath?: string
  width?: number
  height?: number
  alpha?: number
  query?: number
  success(searchSuccess: { wxMarkerData: BMapMarker[]; originalData: Record<string, any> }): void
  fail(searchFail: BMapError): void
}

/** 百度 POI 检索方法 */
export interface BMapSearch {
  (searchParam: BMapSearchParam): void
}
