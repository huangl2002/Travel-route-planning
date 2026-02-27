  <template>
    <div class="route-viewer">
      <div v-if="route" class="viewer-container">
        <div class="route-header">
          <div class="header-content">
            <h2>{{ route.name }}</h2>
            <div class="route-meta">
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatDate(route.date) }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">📍</span>
                {{ route.destinations.length }} 个目的地
              </span>
              <span v-if="route.budget" class="meta-item">
                <span class="meta-icon">💰</span>
                ¥{{ route.budget }}
              </span>
            </div>
          </div>
          <button
            @click="toggleFavorite"
            class="btn-favorite"
            :class="{ active: route.isFavorite }"
            title="收藏"
          >
            {{ route.isFavorite ? '★ 已收藏' : '☆ 收藏' }}
          </button>
        </div>

        <div class="viewer-content">
          <div class="route-map-section">
            <div class="map-container">
              <RouteMap :destinations="route.destinations" />
            </div>
          </div>

          <div class="route-details-section">
            <div class="destinations-timeline">
              <h3>行程安排</h3>
              <div class="timeline">
                <div
                  v-for="(dest, index) in route.destinations"
                  :key="index"
                  class="timeline-item"
                >
                  <div class="timeline-marker">
                    <span class="marker-number">{{ index + 1 }}</span>
                  </div>
                  <div class="timeline-content">
                    <h4>{{ dest }}</h4>
                    <p class="destination-note">第 {{ index + 1 }} 站</p>
                  </div>
                  <div v-if="index < route.destinations.length - 1" class="timeline-line"></div>
                </div>
              </div>
            </div>

            <div v-if="route.notes" class="route-notes">
              <h3>备注</h3>
              <div class="notes-content">
                {{ route.notes }}
              </div>
            </div>

            <div class="route-actions">
              <button @click="shareRoute" class="btn-action btn-share">
                🔗 分享路线
              </button>
              <button @click="exportRoute" class="btn-action btn-export">
                📥 导出路线
              </button>
              <button @click="printRoute" class="btn-action btn-print">
                🖨️ 打印路线
              </button>
              <button @click="editRoute" class="btn-action btn-edit">
                ✏️ 编辑路线
              </button>
              <button @click="deleteRoute" class="btn-action btn-delete">
                🗑️ 删除路线
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <div class="not-found-icon">❌</div>
        <h3>路线不存在</h3>
        <p>您要查看的路线可能已被删除</p>
        <router-link to="/my-routes" class="btn-back">
          返回我的路线
        </router-link>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute as useRouter, useRouter as useNavigation } from 'vue-router'
  import RouteMap from '@/components/RouteMap.vue'

  const route = useRouter()
  const router = useNavigation()
  const routeData = ref(null)

  onMounted(() => {
    loadRoute()
  })

  const loadRoute = () => {
    const routeId = parseInt(route.params.id)
    const savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
    routeData.value = savedRoutes.find(r => r.id === routeId)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '未设置'
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const toggleFavorite = () => {
    if (routeData.value) {
      routeData.value.isFavorite = !routeData.value.isFavorite
      const savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
      const index = savedRoutes.findIndex(r => r.id === routeData.value.id)
      if (index !== -1) {
        savedRoutes[index] = routeData.value
        localStorage.setItem('travelRoutes', JSON.stringify(savedRoutes))
      }
    }
  }

  const shareRoute = () => {
    if (!routeData.value) return

    const shareData = {
      name: routeData.value.name,
      destinations: routeData.value.destinations,
      date: routeData.value.date,
      budget: routeData.value.budget
    }
    const shareText = `${shareData.name}\n目的地: ${shareData.destinations.join(' → ')}\n日期: ${formatDate(shareData.date)}${shareData.budget ? '\n预算: ¥' + shareData.budget : ''}`

    if (navigator.share) {
      navigator.share({
        title: shareData.name,
        text: shareText
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('路线信息已复制到剪贴板!')
      }).catch(() => {
        alert(shareText)
      })
    }
  }

  const exportRoute = () => {
    if (!routeData.value) return

    const dataStr = JSON.stringify(routeData.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${routeData.value.name}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const printRoute = () => {
    window.print()
  }

  const editRoute = () => {
    router.push(`/my-routes`)
  }

  const deleteRoute = () => {
    if (confirm('确定要删除这条路线吗?')) {
      let savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
      savedRoutes = savedRoutes.filter(r => r.id !== routeData.value.id)
      localStorage.setItem('travelRoutes', JSON.stringify(savedRoutes))
      router.push('/my-routes')
    }
  }
  </script>

  <style scoped>
  .route-viewer {
    min-height: calc(100vh - 64px);
    background: #f8f9fa;
    padding: 20px;
  }

  .viewer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .route-header {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content {
    flex: 1;
  }

  .route-header h2 {
    color: #2c3e50;
    margin: 0 0 15px 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .route-meta {
    display: flex;
    gap: 25px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #7f8c8d;
    font-size: 1rem;
  }

  .meta-icon {
    font-size: 1.2rem;
  }

  .btn-favorite {
    padding: 10px 20px;
    border: 2px solid #f39c12;
    background: white;
    color: #f39c12;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-favorite:hover {
    background: #fef5e6;
  }

  .btn-favorite.active {
    background: #f39c12;
    color: white;
  }

  .viewer-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 1024px) {
    .viewer-content {
      grid-template-columns: 1fr;
    }
  }

  .route-map-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .map-container {
    min-height: 400px;
  }

  .route-details-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .destinations-timeline,
  .route-notes {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .destinations-timeline h3,
  .route-notes h3 {
    color: #2c3e50;
    margin: 0 0 25px 0;
    font-size: 1.4rem;
    font-weight: 600;
  }

  .timeline {
    position: relative;
    padding-left: 30px;
  }

  .timeline-item {
    position: relative;
    padding-bottom: 30px;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-marker {
    position: absolute;
    left: -30px;
    top: 0;
    width: 36px;
    height: 36px;
    background: #3498db;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .marker-number {
    color: white;
    font-weight: 600;
    font-size: 1rem;
  }

  .timeline-content {
    padding-left: 10px;
  }

  .timeline-content h4 {
    color: #2c3e50;
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .destination-note {
    color: #7f8c8d;
    margin: 0;
    font-size: 0.9rem;
  }

  .timeline-line {
    position: absolute;
    left: -10px;
    top: 36px;
    bottom: 0;
    width: 2px;
    background: #e8ecef;
  }

  .timeline-item:last-child .timeline-line {
    display: none;
  }

  .notes-content {
    color: #2c3e50;
    line-height: 1.6;
    white-space: pre-wrap;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 4px;
  }

  .route-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .btn-action {
    padding: 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-share {
    background: #3498db;
    color: white;
  }

  .btn-share:hover {
    background: #2980b9;
  }

  .btn-export {
    background: #27ae60;
    color: white;
  }

  .btn-export:hover {
    background: #229954;
  }

  .btn-print {
    background: #95a5a6;
    color: white;
  }

  .btn-print:hover {
    background: #7f8c8d;
  }

  .btn-edit {
    background: #f39c12;
    color: white;
  }

  .btn-edit:hover {
    background: #e67e22;
  }

  .btn-delete {
    background: #e74c3c;
    color: white;
  }

  .btn-delete:hover {
    background: #c0392b;
  }

  .not-found {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    max-width: 600px;
    margin: 40px auto;
  }

  .not-found-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .not-found h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .not-found p {
    color: #7f8c8d;
    font-size: 1rem;
    margin-bottom: 30px;
  }

  .btn-back {
    display: inline-block;
    padding: 12px 25px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .btn-back:hover {
    background: #2980b9;
  }

  @media (max-width: 768px) {
    .route-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .route-header h2 {
      font-size: 1.4rem;
    }

    .route-meta {
      flex-direction: column;
      gap: 8px;
    }

    .btn-favorite {
      align-self: flex-start;
    }

    .destinations-timeline,
    .route-notes {
      padding: 20px;
    }

    .route-actions {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    .route-header,
    .route-actions,
    .map-container {
      display: none;
    }

    .viewer-container {
      margin: 0;
    }

    .route-map-section {
      display: none;
    }

    .route-details-section {
      grid-template-columns: 1fr;
    }
  }
  </style>
