<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-card">
        <h2>规划您的旅程</h2>
        <p>开始创建您的旅行路线，探索世界各地的美景</p>
        <router-link to="/route-planner" class="btn-primary">
          开始规划
        </router-link>
      </div>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">🗺️</div>
        <h3>智能规划</h3>
        <p>轻松添加多个目的地，自动规划最优路线</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💾</div>
        <h3>便捷管理</h3>
        <p>保存您的路线，随时查看和编辑</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>响应式设计</h3>
        <p>支持各种设备，随时随地使用</p>
      </div>
    </div>

    <div class="stats-section" v-if="stats.totalRoutes > 0">
      <div class="stat-item">
        <div class="stat-number">{{ stats.totalRoutes }}</div>
        <div class="stat-label">已创建路线</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.totalDestinations }}</div>
        <div class="stat-label">总目的地</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  totalRoutes: 0,
  totalDestinations: 0
})

onMounted(() => {
  loadStats()
})

const loadStats = () => {
  const savedRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]')
  stats.value.totalRoutes = savedRoutes.length
  stats.value.totalDestinations = savedRoutes.reduce((sum, route) => {
    return sum + (route.destinations ? route.destinations.length : 0)
  }, 0)
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.hero-section {
  margin-bottom: 60px;
}

.hero-card {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-card h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2rem;
}

.hero-card p {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.btn-primary {
  display: inline-block;
  padding: 16px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  max-width: 1200px;
  margin: 0 auto 60px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.feature-card p {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .home {
    padding: 20px;
  }

  .hero-card {
    padding: 40px 20px;
  }

  .hero-card h2 {
    font-size: 1.6rem;
  }

  .hero-card p {
    font-size: 1rem;
  }

  .features-section {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
