<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Travel Route Planning</h3>
          <p>轻松规划您的旅行路线</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/route-planner">路线规划</router-link></li>
            <li><router-link to="/my-routes">我的路线</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>Email: contact@travelroute.com</p>
          <p>电话: 400-123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Travel Route Planning. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #667eea;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #ecf0f1;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #34495e;
}

.footer-bottom p {
  color: #95a5a6;
  font-size: 0.9rem;
}
</style>
