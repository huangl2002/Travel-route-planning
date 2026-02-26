<template>
  <div class="route-viewer">
    <div v-if="route" class="viewer-container">
      <div class="route-header">
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
        </div>
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
            <button @click="editRoute" class="btn-edit">
              ✏️ 编辑路线
            </button>
            <button @click="deleteRoute" class="btn-delete">
              🗑️ 删除路线
            </button>
            <button @click="printRoute" class="btn-print">
              🖨️ 打印路线
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

const editRoute = () => {
  router.push(`/my-routes`)
}

const deleteRoute = () => {
  if (confirm('确定要删除这条路线吗？')) {
    let savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
    savedRoutes = savedRoutes.filter(r => r.id !== routeData.value.id)
    localStorage.setItem('travelRoutes', JSON.stringify(savedRoutes))
    router.push('/my-routes')
  }
}

const printRoute = () => {
  window.print()
}
</script>

<style scoped>
.route-viewer {
  min-height: calc(100vh - 64px);
  background: #f5f7fa;
  padding: 20px;
}

.viewer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.route-header {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.route-header h2 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 2rem;
}

.route-meta {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 1.1rem;
}

.meta-icon {
  font-size: 1.3rem;
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
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.destinations-timeline h3,
.route-notes h3 {
  color: #333;
  margin: 0 0 25px 0;
  font-size: 1.5rem;
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
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.marker-number {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.timeline-content {
  padding-left: 10px;
}

.timeline-content h4 {
  color: #333;
  margin: 0 0 5px 0;
  font-size: 1.3rem;
}

.destination-note {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.timeline-line {
  position: absolute;
  left: -10px;
  top: 40px;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.notes-content {
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.route-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-edit,
.btn-delete,
.btn-print {
  flex: 1;
  min-width: 120px;
  padding: 14px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-print {
  background: #95a5a6;
  color: white;
}

.btn-print:hover {
  background: #7f8c8d;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 40px auto;
}

.not-found-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.not-found h3 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.not-found p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.btn-back {
  display: inline-block;
  padding: 14px 30px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-back:hover {
  background: #5568d3;
}

@media (max-width: 768px) {
  .route-header {
    padding: 20px;
  }

  .route-header h2 {
    font-size: 1.5rem;
  }

  .route-meta {
    flex-direction: column;
    gap: 10px;
  }

  .destinations-timeline,
  .route-notes {
    padding: 20px;
  }

  .route-actions {
    flex-direction: column;
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
