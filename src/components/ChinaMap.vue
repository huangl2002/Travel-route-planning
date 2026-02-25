<template>
  <div class="china-map">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  destinations: {
    type: Array,
    default: () => []
  }
})

const mapContainer = ref(null)
const chartInstance = ref(null)

// 省份坐标映射
const provinceCoordinates = {
  '北京': [116.4074, 39.9042],
  '北京市': [116.4074, 39.9042],
  '天津': [117.2009, 39.0842],
  '天津市': [117.2009, 39.0842],
  '河北': [114.5149, 38.0423],
  '河北省': [114.5149, 38.0423],
  '山西': [112.5489, 37.8706],
  '山西省': [112.5489, 37.8706],
  '内蒙古': [111.7492, 40.8426],
  '内蒙古自治区': [111.7492, 40.8426],
  '辽宁': [123.4291, 41.7968],
  '辽宁省': [123.4291, 41.7968],
  '吉林': [125.3235, 43.8171],
  '吉林省': [125.3235, 43.8171],
  '黑龙江': [126.6618, 45.7423],
  '黑龙江省': [126.6618, 45.7423],
  '上海': [121.4737, 31.2304],
  '上海市': [121.4737, 31.2304],
  '江苏': [118.7675, 32.0415],
  '江苏省': [118.7675, 32.0415],
  '浙江': [120.1551, 30.2741],
  '浙江省': [120.1551, 30.2741],
  '安徽': [117.2272, 31.8206],
  '安徽省': [117.2272, 31.8206],
  '福建': [119.2965, 26.0745],
  '福建省': [119.2965, 26.0745],
  '江西': [115.8579, 28.6829],
  '江西省': [115.8579, 28.6829],
  '山东': [117.1205, 36.6510],
  '山东省': [117.1205, 36.6510],
  '河南': [113.7526, 34.7646],
  '河南省': [113.7526, 34.7646],
  '湖北': [114.3416, 30.5467],
  '湖北省': [114.3416, 30.5467],
  '湖南': [112.9825, 28.1941],
  '湖南省': [112.9825, 28.1941],
  '广东': [113.2644, 23.1291],
  '广东省': [113.2644, 23.1291],
  '广西': [108.3201, 22.8240],
  '广西壮族自治区': [108.3201, 22.8240],
  '海南': [110.1999, 20.0174],
  '海南省': [110.1999, 20.0174],
  '重庆': [106.5516, 29.5630],
  '重庆市': [106.5516, 29.5630],
  '四川': [104.0665, 30.5723],
  '四川省': [104.0665, 30.5723],
  '贵州': [106.6302, 26.6477],
  '贵州省': [106.6302, 26.6477],
  '云南': [102.8329, 24.8801],
  '云南省': [102.8329, 24.8801],
  '西藏': [91.1172, 29.6469],
  '西藏自治区': [91.1172, 29.6469],
  '陕西': [108.9542, 34.2656],
  '陕西省': [108.9542, 34.2656],
  '甘肃': [103.8343, 36.0611],
  '甘肃省': [103.8343, 36.0611],
  '青海': [101.7782, 36.6171],
  '青海省': [101.7782, 36.6171],
  '宁夏': [106.2586, 38.4721],
  '宁夏回族自治区': [106.2586, 38.4721],
  '新疆': [87.6168, 43.8256],
  '新疆维吾尔自治区': [87.6168, 43.8256],
  '香港': [114.1694, 22.3193],
  '香港特别行政区': [114.1694, 22.3193],
  '澳门': [113.5491, 22.1987],
  '澳门特别行政区': [113.5491, 22.1987],
  '台湾': [121.5654, 25.0330],
  '台湾省': [121.5654, 25.0330]
}

const initMap = async () => {
  if (!mapContainer.value) {
    console.error('地图容器未找到')
    return
  }

  try {
    // 初始化ECharts实例
    chartInstance.value = echarts.init(mapContainer.value)

    // 尝试从阿里云DataV加载真实地图数据
    let mapData = null
    try {
      const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json', {
        mode: 'cors'
      })
      if (response.ok) {
        mapData = await response.json()
        console.log('成功加载真实地图数据')
      }
    } catch (error) {
      console.warn('加载真实地图数据失败，使用简化数据:', error)
    }

    // 如果加载失败，使用简化数据
    if (!mapData) {
      mapData = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": { "name": "黑龙江省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[121.5, 53.5], [135.0, 53.5], [135.0, 43.0], [121.0, 43.0], [121.5, 53.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "吉林省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[121.0, 46.0], [131.0, 46.0], [131.0, 41.0], [121.0, 41.0], [121.0, 46.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "辽宁省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[119.0, 43.5], [125.0, 43.5], [125.0, 38.5], [119.0, 38.5], [119.0, 43.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "内蒙古自治区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[97.0, 53.0], [126.0, 53.0], [126.0, 37.0], [97.0, 37.0], [97.0, 53.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "河北省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[114.0, 42.0], [119.0, 42.0], [119.0, 36.0], [114.0, 36.0], [114.0, 42.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "北京市" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[116.0, 40.0], [116.5, 40.0], [116.5, 39.5], [116.0, 39.5], [116.0, 40.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "天津市" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[117.0, 39.0], [117.5, 39.0], [117.5, 38.5], [117.0, 38.5], [117.0, 39.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "山西省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[110.0, 40.5], [114.5, 40.5], [114.5, 34.5], [110.0, 34.5], [110.0, 40.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "山东省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[114.5, 38.5], [122.5, 38.5], [122.5, 34.0], [114.5, 34.0], [114.5, 38.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "河南省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[110.5, 36.5], [116.5, 36.5], [116.5, 31.5], [110.5, 31.5], [110.5, 36.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "陕西省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[105.5, 39.5], [111.5, 39.5], [111.5, 31.0], [105.5, 31.0], [105.5, 39.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "甘肃省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[92.5, 42.5], [108.5, 42.5], [108.5, 32.0], [92.5, 32.0], [92.5, 42.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "宁夏回族自治区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[104.0, 39.5], [107.0, 39.5], [107.0, 35.0], [104.0, 35.0], [104.0, 39.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "青海省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[89.5, 39.5], [103.0, 39.5], [103.0, 31.5], [89.5, 31.5], [89.5, 39.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "新疆维吾尔自治区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[73.0, 49.0], [96.0, 49.0], [96.0, 34.0], [73.0, 34.0], [73.0, 49.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "西藏自治区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[78.0, 36.5], [99.0, 36.5], [99.0, 26.5], [78.0, 26.5], [78.0, 36.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "四川省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[97.5, 34.0], [108.5, 34.0], [108.5, 26.0], [97.5, 26.0], [97.5, 34.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "重庆市" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[105.5, 32.0], [110.5, 32.0], [110.5, 28.0], [105.5, 28.0], [105.5, 32.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "湖北省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[108.5, 33.5], [116.5, 33.5], [116.5, 29.0], [108.5, 29.0], [108.5, 33.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "安徽省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[114.5, 34.5], [119.5, 34.5], [119.5, 29.0], [114.5, 29.0], [114.5, 34.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "江苏省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[116.5, 35.0], [121.5, 35.0], [121.5, 30.5], [116.5, 30.5], [116.5, 35.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "上海市" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[121.0, 31.5], [121.8, 31.5], [121.8, 30.5], [121.0, 30.5], [121.0, 31.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "浙江省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[118.0, 31.0], [122.0, 31.0], [122.0, 27.0], [118.0, 27.0], [118.0, 31.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "江西省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[113.5, 30.0], [118.5, 30.0], [118.5, 24.0], [113.5, 24.0], [113.5, 30.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "湖南省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[109.0, 30.0], [114.5, 30.0], [114.5, 24.5], [109.0, 24.5], [109.0, 30.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "贵州省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[103.5, 29.0], [109.5, 29.0], [109.5, 24.0], [103.5, 24.0], [103.5, 29.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "云南省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[97.0, 29.0], [106.0, 29.0], [106.0, 21.0], [97.0, 21.0], [97.0, 29.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "广西壮族自治区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[104.5, 26.5], [112.0, 26.5], [112.0, 21.5], [104.5, 21.5], [104.5, 26.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "广东省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[109.5, 25.5], [117.5, 25.5], [117.5, 20.0], [109.5, 20.0], [109.5, 25.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "福建省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[115.5, 28.0], [120.5, 28.0], [120.5, 23.5], [115.5, 23.5], [115.5, 28.0]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "海南省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[108.5, 20.5], [111.0, 20.5], [111.0, 18.0], [108.5, 18.0], [108.5, 20.5]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "香港特别行政区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[113.8, 22.6], [114.5, 22.6], [114.5, 22.1], [113.8, 22.1], [113.8, 22.6]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "澳门特别行政区" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[113.5, 22.2], [113.6, 22.2], [113.6, 22.1], [113.5, 22.1], [113.5, 22.2]]]
            }
          },
          {
            "type": "Feature",
            "properties": { "name": "台湾省" },
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[119.0, 25.5], [122.0, 25.5], [122.0, 21.5], [119.0, 21.5], [119.0, 25.5]]]
            }
          }
        ]
      }
      console.log('使用简化地图数据')
    }

    // 注册地图数据
    echarts.registerMap('china', mapData)

    // 配置选项
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [105, 36],
        label: {
          show: true,
          fontSize: 10,
          color: '#333'
        },
        itemStyle: {
          areaColor: '#f5f7fa',
          borderColor: '#999',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: '#667eea',
            borderColor: '#333',
            borderWidth: 2
          }
        }
      },
      series: []
    }

    // 设置选项
    chartInstance.value.setOption(option)

    // 更新图表
    updateChart()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)

    console.log('地图初始化成功')
  } catch (error) {
    console.error('地图初始化失败:', error)
  }
}

const updateChart = () => {
  if (!chartInstance.value) {
    console.error('图表实例不存在')
    return
  }

  const option = {
    series: []
  }

  if (props.destinations && props.destinations.length > 0) {
    const validDestinations = props.destinations.filter(dest => {
      const coords = getCoordinates(dest)
      return coords && coords[0] >= 70 && coords[0] <= 140 && coords[1] >= 15 && coords[1] <= 55
    })

    if (validDestinations.length > 0) {
      const points = validDestinations.map(dest => {
        const coords = getCoordinates(dest)
        return {
          name: dest,
          value: [...coords, 1]
        }
      })

      option.series = [
        {
          name: '目的地',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: points,
          symbolSize: 12,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 4
          },
          label: {
            formatter: '{b}',
            position: 'right',
            show: true,
            fontSize: 12,
            color: '#333',
            fontWeight: 'bold'
          },
          itemStyle: {
            color: '#667eea',
            shadowBlur: 10,
            shadowColor: '#667eea'
          },
          zlevel: 1
        }
      ]

      if (validDestinations.length >= 2) {
        const linesData = []
        for (let i = 0; i < validDestinations.length - 1; i++) {
          const from = getCoordinates(validDestinations[i])
          const to = getCoordinates(validDestinations[i + 1])
          if (from && to) {
            linesData.push({
              fromName: validDestinations[i],
              toName: validDestinations[i + 1],
              coords: [from, to]
            })
          }
        }

        if (linesData.length > 0) {
          option.series.push({
            name: '路线',
            type: 'lines',
            coordinateSystem: 'geo',
            data: linesData,
            lineStyle: {
              color: '#667eea',
              width: 3,
              curveness: 0.2,
              shadowBlur: 10,
              shadowColor: '#667eea'
            },
            effect: {
              show: true,
              period: 3,
              trailLength: 0.7,
              color: '#ff6b6b',
              symbolSize: 6,
              symbol: 'arrow'
            }
          })
        }
      }
    }
  }

  chartInstance.value.setOption(option, true)
}

const getCoordinates = (destination) => {
  if (!destination) return null
  for (const [key, coords] of Object.entries(provinceCoordinates)) {
    if (destination.includes(key)) {
      return coords
    }
  }
  return null
}

const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

watch(() => props.destinations, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  // 使用setTimeout确保DOM已经渲染
  setTimeout(() => {
    initMap()
  }, 100)
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.china-map {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: #ffffff;
}
</style>
