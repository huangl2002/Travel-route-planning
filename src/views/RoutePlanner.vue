  <template>
    <div class="route-planner">
      <div class="planner-container">
        <div class="planner-sidebar">
          <div class="route-form">
            <h2>创建路线</h2>
            <form @submit.prevent="saveRoute">
              <div class="form-group">
                <label>路线名称</label>
                <input
                  v-model="routeName"
                  type="text"
                  placeholder="例如: 北京-上海7日游"
                  required
                />
              </div>

              <div class="form-group">
                <label>添加目的地</label>
                <div class="destination-input">
                  <input
                    v-model="newDestination"
                    type="text"
                    placeholder="输入城市或省份名称"
                    @keyup.enter="addDestination"
                  />
                  <button type="button" @click="addDestination" class="btn-add">
                    添加
                  </button>
                </div>
                <p class="hint">支持输入城市或省份名称,如: 北京、上海、广东等</p>
              </div>

              <div class="destinations-list" v-if="destinations.length > 0">
                <h3>已添加目的地 ({{ destinations.length }})</h3>
                <ul>
                  <li v-for="(dest, index) in destinations" :key="index" class="destination-item">
                    <span class="destination-number">{{ index + 1 }}</span>
                    <span class="destination-name">{{ dest }}</span>
                    <button type="button" @click="removeDestination(index)" class="btn-remove">
                      删除
                    </button>
                  </li>
                </ul>
              </div>

              <div class="form-group">
                <label>出行日期</label>
                <input
                  v-model="travelDate"
                  type="date"
                  required
                />
              </div>

              <div class="form-group">
                <label>预算 (元)</label>
                <input
                  v-model="budget"
                  type="number"
                  placeholder="可选"
                  min="0"
                />
              </div>

              <div class="form-group">
                <label>备注</label>
                <textarea
                  v-model="notes"
                  placeholder="记录您的旅行计划、注意事项等"
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" class="btn-save" :disabled="destinations.length < 2">
                保存路线 (至少2个目的地)
              </button>
            </form>
          </div>
        </div>

        <div class="planner-map">
          <div class="map-container">
            <RouteMap :destinations="destinations" :key="mapKey" />
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import RouteMap from '@/components/RouteMap.vue'

  const route = useRoute()
  const routeName = ref('')
  const newDestination = ref('')
  const destinations = ref([])
  const travelDate = ref('')
  const budget = ref('')
  const notes = ref('')
  const mapKey = ref(0)  // 用于强制刷新地图组件

  onMounted(async () => {
    await loadFromTemplate()
    // 如果从模板加载了数据,强制刷新地图组件
    if (destinations.value.length > 0) {
      await nextTick()
      mapKey.value++
    }
  })

  const loadFromTemplate = async () => {
    const templateData = route.query.template
    if (templateData) {
      try {
        const template = JSON.parse(templateData)
        console.log('加载模板:', template)
        routeName.value = template.name
        destinations.value = [...template.destinations]
        console.log('目的地已加载:', destinations.value)
      } catch (e) {
        console.error('Failed to load template:', e)
      }
    }
  }

  const addDestination = () => {
    if (newDestination.value.trim()) {
      destinations.value.push(newDestination.value.trim())
      newDestination.value = ''
      // 强制刷新地图
      mapKey.value++
    }
  }

  const removeDestination = (index) => {
    destinations.value.splice(index, 1)
    // 强制刷新地图
    mapKey.value++
  }

  const saveRoute = () => {
    if (routeName.value.trim() && destinations.value.length >= 2) {
      const newRoute = {
        id: Date.now(),
        name: routeName.value,
        destinations: [...destinations.value],
        date: travelDate.value,
        budget: budget.value,
        notes: notes.value,
        createdAt: new Date().toISOString(),
        isFavorite: false
      }

      const savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
      savedRoutes.push(newRoute)
      localStorage.setItem('travelRoutes', JSON.stringify(savedRoutes))

      alert('路线保存成功!')
      resetForm()
    }
  }

  const resetForm = () => {
    routeName.value = ''
    destinations.value = []
    travelDate.value = ''
    budget.value = ''
    notes.value = ''
    mapKey.value++
  }
  </script>

  <style scoped>
  .route-planner {
    min-height: calc(100vh - 64px);
    background: #f8f9fa;
    padding: 20px;
  }

  .planner-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }

  @media (max-width: 1024px) {
    .planner-container {
      grid-template-columns: 1fr;
    }
  }

  .planner-sidebar {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .route-form h2 {
    color: #2c3e50;
    margin-bottom: 25px;
    font-size: 1.5rem;
    font-weight: 600;
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
    transition: border-color 0.2s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3498db;
  }

  .hint {
    font-size: 0.85rem;
    color: #909399;
    margin-top: 5px;
  }

  .destination-input {
    display: flex;
    gap: 10px;
  }

  .destination-input input {
    flex: 1;
  }

  .btn-add {
    padding: 12px 20px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .btn-add:hover {
    background: #2980b9;
  }

  .destinations-list {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .destinations-list h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .destinations-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .destination-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: white;
    border-radius: 4px;
    margin-bottom: 8px;
    border: 1px solid #e8ecef;
  }

  .destination-number {
    font-weight: 600;
    color: #3498db;
    margin-right: 12px;
    min-width: 25px;
  }

  .destination-name {
    flex: 1;
    color: #2c3e50;
  }

  .btn-remove {
    padding: 6px 12px;
    border: none;
    background: #e74c3c;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s ease;
  }

  .btn-remove:hover {
    background: #c0392b;
  }

  .btn-save {
    width: 100%;
    padding: 14px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-save:hover:not(:disabled) {
    background: #2980b9;
  }

  .btn-save:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }

  .planner-map {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .map-container {
    height: 100%;
    min-height: 500px;
  }
  </style>
