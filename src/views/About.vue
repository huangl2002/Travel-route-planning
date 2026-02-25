<template>
  <div class="about">
    <header class="header">
      <h1>关于我们</h1>
    </header>
    <main class="main-content">
      <div class="card">
        <h2>Travel Route Planning</h2>
        <p>这是一个基于Vue3开发的旅行路线规划应用，帮助您轻松规划和管理您的旅行路线。</p>
        <div class="features">
          <div class="feature-item">
            <h3>✨ 简单易用</h3>
            <p>直观的界面设计，让您轻松上手</p>
          </div>
          <div class="feature-item">
            <h3>🗺️ 路线规划</h3>
            <p>智能规划最优旅行路线</p>
          </div>
          <div class="feature-item">
            <h3>📱 响应式设计</h3>
            <p>支持各种设备，随时随地使用</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  text-align: center;
  padding: 60px 20px 40px;
  color: #333;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

.main-content {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
  text-align: center;
}

.card > p {
  color: #666;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 40px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-item h3 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.feature-item p {
  color: #666;
  font-size: 1rem;
}
</style>
