<template>
  <div class="my-routes">
    <div class="routes-container">
      <div v-if="routes.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>暂无路线</h3>
        <p>您还没有保存任何路线，现在去创建一个吧！</p>
        <router-link to="/route-planner" class="btn-create">
          创建路线
        </router-link>
      </div>

      <div v-else class="routes-grid">
        <div
          v-for="route in routes"
          :key="route.id"
          class="route-card"
        >
          <div class="card-header">
            <h3>{{ route.name }}</h3>
            <div class="card-actions">
              <button @click="editRoute(route)" class="btn-edit" title="编辑">
                ✏️
              </button>
              <button @click="deleteRoute(route.id)" class="btn-delete" title="删除">
                🗑️
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="route-destinations">
              <div class="destination-item" v-for="(dest, index) in route.destinations" :key="index">
                <span class="dest-number">{{ index + 1 }}</span>
                <span class="dest-name">{{ dest }}</span>
              </div>
            </div>

            <div class="route-info">
              <div class="info-item">
                <span class="info-label">出行日期:</span>
                <span class="info-value">{{ formatDate(route.date) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">目的地数量:</span>
                <span class="info-value">{{ route.destinations.length }} 个</span>
              </div>
              <div class="info-item" v-if="route.notes">
                <span class="info-label">备注:</span>
                <span class="info-value">{{ route.notes }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <router-link :to="`/route-viewer/${route.id}`" class="btn-view">
              查看详情
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑路线</h3>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateRoute">
            <div class="form-group">
              <label>路线名称</label>
              <input v-model="editingRoute.name" type="text" required />
            </div>
            <div class="form-group">
              <label>出行日期</label>
              <input v-model="editingRoute.date" type="date" required />
            </div>
            <div class="form-group">
              <label>备注</label>
              <textarea v-model="editingRoute.notes" rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">取消</button>
              <button type="submit" class="btn-save">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const routes = ref([])
const showEditModal = ref(false)
const editingRoute = ref({})

onMounted(() => {
  loadRoutes()
})

const loadRoutes = () => {
  const savedRoutes = localStorage.getItem('travelRoutes')
  routes.value = savedRoutes ? JSON.parse(savedRoutes) : []
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

const editRoute = (route) => {
  editingRoute.value = { ...route }
  showEditModal.value = true
}

const updateRoute = () => {
  const index = routes.value.findIndex(r => r.id === editingRoute.value.id)
  if (index !== -1) {
    routes.value[index] = { ...editingRoute.value }
    localStorage.setItem('travelRoutes', JSON.stringify(routes.value))
    closeModal()
  }
}

const deleteRoute = (id) => {
  if (confirm('确定要删除这条路线吗？')) {
    routes.value = routes.value.filter(route => route.id !== id)
    localStorage.setItem('travelRoutes', JSON.stringify(routes.value))
  }
}

const closeModal = () => {
  showEditModal.value = false
  editingRoute.value = {}
}
</script>

<style scoped>
.my-routes {
  min-height: calc(100vh - 64px);
  background: #f5f7fa;
  padding: 40px 20px;
}

.routes-container {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.btn-create {
  display: inline-block;
  padding: 14px 30px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-create:hover {
  background: #5568d3;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.route-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.3rem;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.btn-edit {
  background: #3498db;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
}

.btn-delete:hover {
  background: #c0392b;
}

.card-body {
  padding: 20px;
}

.route-destinations {
  margin-bottom: 20px;
}

.destination-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.destination-item:last-child {
  border-bottom: none;
}

.dest-number {
  width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.dest-name {
  color: #333;
  flex: 1;
}

.route-info {
  padding-top: 15px;
  border-top: 2px solid #f0f0f0;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  width: 100px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  flex: 1;
}

.card-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

.btn-view {
  display: block;
  text-align: center;
  padding: 12px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-view:hover {
  background: #5568d3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.btn-save {
  background: #667eea;
  color: white;
}

.btn-save:hover {
  background: #5568d3;
}

@media (max-width: 768px) {
  .routes-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
