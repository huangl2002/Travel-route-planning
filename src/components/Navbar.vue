<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🗺️</span>
          <span class="brand-text">Travel Route</span>
        </router-link>
      </div>
      <ul class="navbar-menu">
        <li class="menu-item">
          <router-link to="/" class="menu-link" active-class="active">
            首页
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/route-planner" class="menu-link" active-class="active">
            路线规划
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/my-routes" class="menu-link" active-class="active">
            我的路线
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/about" class="menu-link" active-class="active">
            关于
          </router-link>
        </li>
      </ul>
      <button class="mobile-toggle" @click="toggleMobileMenu">
        <span class="toggle-icon">☰</span>
      </button>
    </div>
     
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #333;
}

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.navbar-menu {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  margin: 0;
}

.menu-link {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #666;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.menu-link:hover {
  background: #f5f7fa;
  color: #667eea;
}

.menu-link.active {
  background: #667eea;
  color: white;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

.toggle-icon {
  display: block;
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .mobile-menu {
    display: none;
    background: white;
    border-top: 1px solid #eee;
  }

  .mobile-menu.show {
    display: block;
  }

  .mobile-menu-list {
    list-style: none;
    padding: 10px 20px;
    margin: 0;
  }

  .mobile-menu-item {
    margin: 0;
    padding: 10px 0;
  }

  .mobile-menu-item a {
    display: block;
    text-decoration: none;
    color: #666;
    padding: 10px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .mobile-menu-item a:hover {
    background: #f5f7fa;
    color: #667eea;
  }

  .mobile-menu-item a.router-link-active {
    background: #667eea;
    color: white;
  }
}
</style>
