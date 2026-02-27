  <template>
    <div class="route-map">
      <div class="map-header">
        <h3>旅行路线地图</h3>
        <p class="map-hint">显示您规划的旅行路线</p>
      </div>
      <div class="map-wrapper">
        <div class="map-visual">
          <div class="china-map-container">
            <div ref="mapContainer" class="amap-container"></div>
            <div v-if="loading" class="map-loading">
              <div class="loading-spinner"></div>
              <p>{{ loadingMessage }}</p>
            </div>
          </div>

          <!-- 目的地列表 -->
          <div class="destinations-panel" v-if="destinations.length > 0">
            <h4>目的地列表</h4>
            <div class="destination-list">
              <div
                v-for="(dest, index) in destinations"
                :key="index"
                class="destination-item"
                @click="focusOnDestination(dest)"
              >
                <span class="destination-number">{{ index + 1 }}</span>
                <span class="destination-name">{{ dest }}</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div class="empty-state" v-else>
            <div class="empty-icon">🗺️</div>
            <p>添加目的地后，地图将显示路线</p>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import { loadAMapScript, AMAP_CONFIG, getAllCoordinates } from '../config/amap.js'

  const props = defineProps({
    destinations: {
      type: Array,
      default: () => []
    }
  })

  const mapContainer = ref(null)
  const mapInstance = ref(null)
  const markers = ref([])
  const polylines = ref([])
  const loading = ref(true)
  const loadingMessage = ref('地图加载中...')

  // 获取所有坐标（省份+城市）
  const allCoordinates = getAllCoordinates()

  // 等待AMap对象加载完成
  const waitForAMap = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()

      const checkAMap = () => {
        if (window.AMap) {
          resolve()
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('等待高德地图API超时'))
        } else {
          setTimeout(checkAMap, 100)
        }
      }

      checkAMap()
    })
  }

  // 初始化地图
  const initMap = async () => {
    try {
      loadingMessage.value = '正在加载高德地图API...'
      await loadAMapScript()

      loadingMessage.value = '正在等待地图初始化...'
      await waitForAMap()

      if (!mapContainer.value) {
        throw new Error('地图容器未找到')
      }

      loadingMessage.value = '正在创建地图实例...'

      // 优化地图配置，提升性能
      mapInstance.value = new window.AMap.Map(mapContainer.value, {
        ...AMAP_CONFIG.mapOptions,
        features: ['bg', 'road', 'building'],  // 限制渲染要素
        viewMode: '2D',
        pitch: 0,
        rotateEnable: false,
        showLabel: true,
        showBuildingBlock: false,
        mapStyle: 'amap://styles/normal'
      })

      // 添加控件
      mapInstance.value.addControl(new window.AMap.Scale())
      mapInstance.value.addControl(new window.AMap.ToolBar())

      // 优化地图性能设置
      mapInstance.value.setFeatures(['bg', 'road', 'building'])

      loading.value = false
      console.log('地图初始化成功')

      // 等待DOM更新后再更新标记
      await nextTick()
      updateMarkers()
    } catch (error) {
      console.error('地图初始化失败:', error)
      loadingMessage.value = '地图加载失败，请检查API密钥配置'
      loading.value = false
    }
  }

  // 获取坐标 - 支持省市两级
  const getCoordinates = (destination) => {
    if (!destination) return null

    // 首先尝试精确匹配
    if (allCoordinates[destination]) {
      return allCoordinates[destination]
    }

    // 尝试模糊匹配（检查是否包含地名）
    for (const [key, coords] of Object.entries(allCoordinates)) {
      if (destination.includes(key) || key.includes(destination)) {
        return coords
      }
    }

    console.warn(`未找到目的地 "${destination}" 的坐标`)
    return null
  }

  // 清除标记和路线
  const clearMarkersAndPolylines = () => {
    if (!mapInstance.value) return
    markers.value.forEach(marker => mapInstance.value.remove(marker))
    polylines.value.forEach(polyline => mapInstance.value.remove(polyline))
    markers.value = []
    polylines.value = []
  }

  // 更新地图标记和路线
  const updateMarkers = async () => {
    if (!mapInstance.value || !window.AMap) return

    console.log('更新地图标记，目的地数量:', props.destinations.length)

    // 使用requestAnimationFrame优化渲染
    await new Promise(resolve => requestAnimationFrame(resolve))

    clearMarkersAndPolylines()

    if (props.destinations && props.destinations.length > 0) {
      const validDestinations = props.destinations.filter(dest => {
        const coords = getCoordinates(dest)
        return coords && coords[0] >= 70 && coords[0] <= 140 && coords[1] >= 15 && coords[1] <= 55
      })

      console.log('有效目的地数量:', validDestinations.length)

      if (validDestinations.length > 0) {
        // 批量创建标记
        const markerList = []
        validDestinations.forEach((dest, index) => {
          const coords = getCoordinates(dest)
          if (coords) {
            const marker = new window.AMap.Marker({
              position: coords,
              title: dest,
              label: {
                content: `${index + 1}. ${dest}`,
                direction: 'top'
              },
              animation: 'AMAP_ANIMATION_DROP',
              zIndex: 100 + index
            })
            markerList.push(marker)
            console.log(`添加标记 ${index + 1}: ${dest}`, coords)
          }
        })

        // 批量添加标记
        if (markerList.length > 0) {
          mapInstance.value.add(markerList)
          markers.value = markerList
          console.log('标记添加完成，共', markerList.length, '个')
        }

        // 创建路线
        if (validDestinations.length >= 2) {
          const path = []
          validDestinations.forEach(dest => {
            const coords = getCoordinates(dest)
            if (coords) {
              path.push(coords)
            }
          })

          if (path.length >= 2) {
            const polyline = new window.AMap.Polyline({
              path: path,
              borderWeight: 2,
              strokeColor: '#3498db',
              lineJoin: 'round',
              strokeStyle: 'dashed',
              zIndex: 50
            })
            mapInstance.value.add(polyline)
            polylines.value.push(polyline)

            // 延迟调整视野，避免性能问题
            setTimeout(() => {
              if (mapInstance.value) {
                mapInstance.value.setFitView()
                console.log('地图视野已调整')
              }
            }, 100)
          }
        }
      }
    }
  }

  // 聚焦到特定目的地 - 优化性能
  const focusOnDestination = (destination) => {
    if (!mapInstance.value || !window.AMap) return

    const coords = getCoordinates(destination)
    if (coords) {
      // 使用平滑动画，但限制动画时间
      mapInstance.value.animateTo(
        {
          zoom: 10,
          center: coords
        },
        {
          duration: 500  // 缩短动画时间到500ms
        }
      )
    }
  }

  // 监听目的地变化 - 使用防抖优化
  let updateTimer = null
  watch(() => props.destinations, (newVal, oldVal) => {
    console.log('目的地变化:', { old: oldVal?.length, new: newVal?.length })
    if (updateTimer) {
      clearTimeout(updateTimer)
    }
    updateTimer = setTimeout(() => {
      updateMarkers()
    }, 100)  // 100ms防抖
  }, { deep: true })

  onMounted(() => {
    console.log('RouteMap组件已挂载')
    setTimeout(() => {
      initMap()
    }, 100)
  })

  onUnmounted(() => {
    console.log('RouteMap组件已卸载')
    if (updateTimer) {
      clearTimeout(updateTimer)
    }
    clearMarkersAndPolylines()
    if (mapInstance.value) {
      mapInstance.value.destroy()
      mapInstance.value = null
    }
  })
  </script>

  <style scoped>
  .route-map {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .map-header {
    padding: 15px 20px;
    background: #3498db;
    color: white;
  }

  .map-header h3 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .map-hint {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .map-wrapper {
    flex: 1;
    overflow: auto;
  }

  .map-visual {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: white;
  }

  .china-map-container {
    flex: 1;
    min-width: 400px;
    position: relative;
  }

  .amap-container {
    width: 100%;
    height: 600px;
    border: 2px solid #e8ecef;
    border-radius: 8px;
    background: #f8f9fa;
  }

  .map-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1000;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .map-loading p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }

  .destinations-panel {
    width: 250px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    height: fit-content;
    border: 1px solid #e8ecef;
  }

  .destinations-panel h4 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 1rem;
    font-weight: 600;
  }

  .destination-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .destination-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #e8ecef;
  }

  .destination-item:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-color: #3498db;
  }

  .destination-number {
    width: 24px;
    height: 24px;
    background: #3498db;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 12px;
    flex-shrink: 0;
  }

  .destination-name {
    color: #2c3e50;
    font-size: 0.9rem;
    flex: 1;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #e8ecef;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  .empty-state p {
    color: #999;
    font-size: 1rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    .map-visual {
      flex-direction: column;
    }

    .china-map-container {
      min-width: 100%;
    }

    .destinations-panel {
      width: 100%;
    }

    .amap-container {
      height: 400px;
    }
  }
  </style>
