  <template>
    <div class="home">
      <div class="hero-section">
        <div class="hero-card">
          <h2>旅行路线规划</h2>
          <p>添加目的地,规划行程,轻松管理您的旅行计划</p>
          <router-link to="/route-planner" class="btn-primary">
            创建新路线
          </router-link>
        </div>
      </div>

      <div class="features-section">
        <div class="feature-card">
          <h3>添加目的地</h3>
          <p>输入城市或省份名称,快速添加到您的行程中</p>
        </div>
        <div class="feature-card">
          <h3>地图可视化</h3>
          <p>在地图上直观查看您的旅行路线和目的地</p>
        </div>
        <div class="feature-card">
          <h3>保存管理</h3>
          <p>保存路线,随时查看、编辑和分享您的旅行计划</p>
        </div>
      </div>

      <div class="quick-actions-section">
        <h3>快速开始</h3>
        <div class="quick-actions">
          <router-link to="/route-planner" class="action-card">
            <span class="action-icon">➕</span>
            <span class="action-text">新建路线</span>
          </router-link>
          <router-link to="/my-routes" class="action-card">
            <span class="action-icon">📋</span>
            <span class="action-text">我的路线</span>
          </router-link>
          <router-link to="/templates" class="action-card">
            <span class="action-icon">📝</span>
            <span class="action-text">路线模板</span>
          </router-link>
          <router-link to="/about" class="action-card">
            <span class="action-icon">ℹ️</span>
            <span class="action-text">使用帮助</span>
          </router-link>
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
    background: #f8f9fa;
    padding: 40px 20px;
  }

  .hero-section {
    margin-bottom: 50px;
  }

  .hero-card {
    background: white;
    border-radius: 8px;
    padding: 50px 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-card h2 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 2.2rem;
    font-weight: 600;
  }

  .hero-card p {
    color: #7f8c8d;
    font-size: 1.1rem;
    margin-bottom: 30px;
  }

  .btn-primary {
    display: inline-block;
    padding: 14px 35px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .btn-primary:hover {
    background: #2980b9;
  }

  .features-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 50px;
    max-width: 1000px;
    margin: 0 auto 50px;
  }

  .feature-card {
    background: white;
    border-radius: 8px;
    padding: 35px 25px;
    text-align: left;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-left: 4px solid #3498db;
  }

  .feature-card h3 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .feature-card p {
    color: #7f8c8d;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .quick-actions-section {
    margin-bottom: 50px;
    max-width: 1000px;
    margin: 0 auto 50px;
  }

  .quick-actions-section h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.4rem;
    font-weight: 600;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: white;
    border-radius: 8px;
    padding: 30px 20px;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
    border: 1px solid #e8ecef;
  }

  .action-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #3498db;
  }

  .action-icon {
    font-size: 2.5rem;
  }

  .action-text {
    color: #2c3e50;
    font-size: 1rem;
    font-weight: 500;
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    max-width: 500px;
    margin: 0 auto;
  }

  .stat-item {
    background: white;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #3498db;
    margin-bottom: 10px;
  }

  .stat-label {
    color: #7f8c8d;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .home {
      padding: 20px;
    }

    .hero-card {
      padding: 35px 20px;
    }

    .hero-card h2 {
      font-size: 1.6rem;
    }

    .hero-card p {
      font-size: 0.95rem;
    }

    .features-section {
      grid-template-columns: 1fr;
    }

    .quick-actions {
      grid-template-columns: 1fr 1fr;
    }

    .stat-number {
      font-size: 2rem;
    }
  }
  </style>
