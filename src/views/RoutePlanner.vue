<template>
  <div class="route-planner">
    <div class="planner-container">
      <div class="planner-sidebar">
        <div class="route-form">
          <h2>路线信息</h2>
          <form @submit.prevent="saveRoute">
            <div class="form-group">
              <label>路线名称</label>
              <input
                v-model="routeName"
                type="text"
                placeholder="为您的路线命名"
                required
              />
            </div>

            <div class="form-group">
              <label>添加目的地</label>
              <div class="destination-input">
                <input
                  v-model="newDestination"
                  type="text"
                  placeholder="输入目的地名称(如: 北京、上海、广东)"
                  @keyup.enter="addDestination"
                />
                <button type="button" @click="addDestination" class="btn-add">
                  添加
                </button>
              </div>
              <p class="hint">提示: 输入省份名称,如"北京"、"上海"、"广东"等</p>
            </div>

            <div class="destinations-list" v-if="destinations.length > 0">
              <h3>目的地列表</h3>
              <ul>
                <li v-for="(dest, index) in destinations" :key="index" class="destination-item">
                  <span class="destination-number">{{ index + 1 }}.</span>
                  <span class="destination-name">{{ dest }}</span>
                  <button type="button" @click="removeDestination(index)" class="btn-remove">
                    ×
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
              <label>备注</label>
              <textarea
                v-model="notes"
                placeholder="添加备注信息"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" class="btn-save" :disabled="destinations.length < 2">
              保存路线
            </button>
          </form>
        </div>
      </div>

      <div class="planner-map">
        <div class="map-container">
          <ChinaMap :destinations="destinations" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChinaMap from '@/components/ChinaMap.vue'

const routeName = ref('')
const newDestination = ref('')
const destinations = ref([])
const travelDate = ref('')
const notes = ref('')

const addDestination = () => {
  if (newDestination.value.trim()) {
    destinations.value.push(newDestination.value.trim())
    newDestination.value = ''
  }
}

const removeDestination = (index) => {
  destinations.value.splice(index, 1)
}

const saveRoute = () => {
  if (routeName.value.trim() && destinations.value.length >= 2) {
    const route = {
      id: Date.now(),
      name: routeName.value,
      destinations: [...destinations.value],
      date: travelDate.value,
      notes: notes.value,
      createdAt: new Date().toISOString()
    }

    const savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
    savedRoutes.push(route)
    localStorage.setItem('travelRoutes', JSON.stringify(savedRoutes))

    alert('路线保存成功!')
    resetForm()
  }
}

const resetForm = () => {
  routeName.value = ''
  destinations.value = []
  travelDate.value = ''
  notes.value = ''
}
</script>

<style scoped>
.route-planner {
  min-height: calc(100vh - 64px);
  background: #f5f7fa;
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
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.route-form h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
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
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.hint {
  font-size: 0.85rem;
  color: #999;
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
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.btn-add:hover {
  background: #5568d3;
}

.destinations-list {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.destinations-list h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.destinations-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.destination-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.destination-number {
  font-weight: 700;
  color: #667eea;
  margin-right: 10px;
  min-width: 25px;
}

.destination-name {
  flex: 1;
  color: #333;
}

.btn-remove {
  width: 24px;
  height: 24px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background 0.3s ease;
}

.btn-remove:hover {
  background: #c0392b;
}

.btn-save {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  background: #5568d3;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.planner-map {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map-container {
  height: 100%;
  min-height: 500px;
}
</style>
