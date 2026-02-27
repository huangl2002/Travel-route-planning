  <template>
    <div class="my-routes">
      <div class="routes-container">
        <div class="page-header">
          <h2>我的路线</h2>
          <div class="header-actions">
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索路线名称..."
                @input="filterRoutes"
              />
            </div>
            <div class="filter-box">
              <select v-model="filterType" @change="filterRoutes">
                <option value="all">全部路线</option>
                <option value="favorite">收藏的路线</option>
                <option value="recent">最近创建</option>
              </select>
            </div>
            <router-link to="/route-planner" class="btn-create">
              新建路线
            </router-link>
          </div>
        </div>

        <div v-if="filteredRoutes.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>{{ searchQuery || filterType !== 'all' ? '未找到符合条件的路线' : '暂无路线' }}</h3>
          <p>{{ searchQuery || filterType !== 'all' ? '请尝试其他搜索条件' : '您还没有保存任何路线,现在去创建一个吧!' }}</p>
          <router-link v-if="!searchQuery && filterType === 'all'" to="/route-planner" class="btn-create">
            创建路线
          </router-link>
        </div>

        <div v-else class="routes-grid">
          <div
            v-for="route in filteredRoutes"
            :key="route.id"
            class="route-card"
          >
            <div class="card-header">
              <h3>{{ route.name }}</h3>
              <div class="card-actions">
                <button
                  @click="toggleFavorite(route)"
                  class="btn-favorite"
                  :class="{ active: route.isFavorite }"
                  title="收藏"
                >
                  {{ route.isFavorite ? '★' : '☆' }}
                </button>
                <button @click="shareRoute(route)" class="btn-share" title="分享">
                  🔗
                </button>
                <button @click="exportRoute(route)" class="btn-export" title="导出">
                  📥
                </button>
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
                  <span class="info-label">目的地:</span>
                  <span class="info-value">{{ route.destinations.length }} 个</span>
                </div>
                <div class="info-item" v-if="route.budget">
                  <span class="info-label">预算:</span>
                  <span class="info-value">¥{{ route.budget }}</span>
                </div>
                <div class="info-item" v-if="route.notes">
                  <span class="info-label">备注:</span>
                  <span class="info-value">{{ truncateText(route.notes, 30) }}</span>
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
                <label>预算 (元)</label>
                <input v-model="editingRoute.budget" type="number" min="0" />
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
  import { ref, onMounted, computed } from 'vue'

  const routes = ref([])
  const searchQuery = ref('')
  const filterType = ref('all')
  const showEditModal = ref(false)
  const editingRoute = ref({})

  const filteredRoutes = computed(() => {
    let result = [...routes.value]

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(route =>
        route.name.toLowerCase().includes(query) ||
        route.destinations.some(dest => dest.toLowerCase().includes(query))
      )
    }

    if (filterType.value === 'favorite') {
      result = result.filter(route => route.isFavorite)
    } else if (filterType.value === 'recent') {
      result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  })

  onMounted(() => {
    loadRoutes()
  })

  const loadRoutes = () => {
    const savedRoutes = localStorage.getItem('travelRoutes')
    routes.value = savedRoutes ? JSON.parse(savedRoutes) : []
  }

  const filterRoutes = () => {
    // 触发计算属性重新计算
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

  const truncateText = (text, maxLength) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const toggleFavorite = (route) => {
    route.isFavorite = !route.isFavorite
    localStorage.setItem('travelRoutes', JSON.stringify(routes.value))
  }

  const shareRoute = (route) => {
    const shareData = {
      name: route.name,
      destinations: route.destinations,
      date: route.date
    }
    const shareText = `${shareData.name}\n目的地: ${shareData.destinations.join(' → ')}\n日期: ${formatDate(shareData.date)}`

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

  const exportRoute = (route) => {
    const dataStr = JSON.stringify(route, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${route.name}.json`
    link.click()
    URL.revokeObjectURL(url)
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
    if (confirm('确定要删除这条路线吗?')) {
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
    background: #f8f9fa;
    padding: 30px 20px;
  }

  .routes-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .page-header h2 {
    color: #2c3e50;
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-box input {
    padding: 10px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    width: 250px;
    transition: border-color 0.2s ease;
  }

  .search-box input:focus {
    outline: none;
    border-color: #3498db;
  }

  .filter-box select {
    padding: 10px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    cursor: pointer;
  }

  .btn-create {
    display: inline-block;
    padding: 10px 20px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .btn-create:hover {
    background: #2980b9;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .empty-state h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .empty-state p {
    color: #7f8c8d;
    font-size: 1rem;
    margin-bottom: 30px;
  }

  .routes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .route-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease;
    overflow: hidden;
    border: 1px solid #e8ecef;
  }

  .route-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e8ecef;
    background: #fafbfc;
  }

  .card-header h3 {
    color: #2c3e50;
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .btn-favorite,
  .btn-share,
  .btn-export,
  .btn-edit,
  .btn-delete {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
    background: #ecf0f1;
  }

  .btn-favorite.active {
    color: #f39c12;
    background: #fef5e6;
  }

  .btn-favorite:hover,
  .btn-share:hover,
  .btn-export:hover,
  .btn-edit:hover,
  .btn-delete:hover {
    opacity: 0.8;
  }

  .btn-delete:hover {
    background: #e74c3c;
    color: white;
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
    margin-right: 12px;
    flex-shrink: 0;
  }

  .dest-name {
    color: #2c3e50;
    flex: 1;
    font-size: 0.95rem;
  }

  .route-info {
    padding-top: 15px;
    border-top: 1px solid #e8ecef;
  }

  .info-item {
    display: flex;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .info-label {
    color: #7f8c8d;
    width: 70px;
    flex-shrink: 0;
  }

  .info-value {
    color: #2c3e50;
    flex: 1;
  }

  .card-footer {
    padding: 15px 20px;
    border-top: 1px solid #e8ecef;
    background: #fafbfc;
  }

  .btn-view {
    display: block;
    text-align: center;
    padding: 10px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .btn-view:hover {
    background: #2980b9;
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
    border-radius: 8px;
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
    border-bottom: 1px solid #e8ecef;
  }

  .modal-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .btn-close {
    width: 32px;
    height: 32px;
    border: none;
    background: #e74c3c;
    color: white;
    border-radius: 4px;
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
    color: #2c3e50;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3498db;
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
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-cancel {
    background: #95a5a6;
    color: white;
  }

  .btn-cancel:hover {
    background: #7f8c8d;
  }

  .btn-save {
    background: #3498db;
    color: white;
  }

  .btn-save:hover {
    background: #2980b9;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-actions {
      flex-direction: column;
    }

    .search-box input {
      width: 100%;
    }

    .routes-grid {
      grid-template-columns: 1fr;
    }

    .modal-content {
      width: 95%;
    }
  }
  </style>
