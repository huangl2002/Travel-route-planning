  <template>
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">
            <span class="brand-icon">🗺️</span>
            <span class="brand-text">旅行路线规划</span>
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
            <router-link to="/templates" class="menu-link" active-class="active">
              路线模板
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

      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <ul class="mobile-menu-list">
          <li class="mobile-menu-item">
            <router-link to="/" @click="closeMobileMenu" class="mobile-link" active-class="mobile-active">
              首页
            </router-link>
          </li>
          <li class="mobile-menu-item">
            <router-link to="/route-planner" @click="closeMobileMenu" class="mobile-link" active-class="mobile-active">
              路线规划
            </router-link>
          </li>
          <li class="mobile-menu-item">
            <router-link to="/my-routes" @click="closeMobileMenu" class="mobile-link" active-class="mobile-active">
              我的路线
            </router-link>
          </li>
          <li class="mobile-menu-item">
            <router-link to="/templates" @click="closeMobileMenu" class="mobile-link" active-class="mobile-active">
              路线模板
            </router-link>
          </li>
          <li class="mobile-menu-item">
            <router-link to="/about" @click="closeMobileMenu" class="mobile-link" active-class="mobile-active">
              关于
            </router-link>
          </li>
        </ul>
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
    color: #2c3e50;
  }

  .brand-icon {
    font-size: 24px;
  }

  .brand-text {
    font-size: 18px;
    font-weight: 600;
    color: #3498db;
  }

  .navbar-menu {
    display: flex;
    gap: 5px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .menu-item {
    margin: 0;
  }

  .menu-link {
    display: block;
    padding: 10px 16px;
    text-decoration: none;
    color: #2c3e50;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .menu-link:hover {
    background: #f8f9fa;
    color: #3498db;
  }

  .menu-link.active {
    background: #3498db;
    color: white;
  }

  .mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    color: #2c3e50;
  }

  .toggle-icon {
    display: block;
  }

  .mobile-menu {
    display: block;
    background: white;
    border-top: 1px solid #e8ecef;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
  }

  .mobile-menu-list {
    list-style: none;
    padding: 10px 20px;
    margin: 0;
  }

  .mobile-menu-item {
    margin: 0;
    padding: 8px 0;
  }

  .mobile-link {
    display: block;
    text-decoration: none;
    color: #2c3e50;
    padding: 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .mobile-link:hover {
    background: #f8f9fa;
    color: #3498db;
  }

  .mobile-link.mobile-active {
    background: #3498db;
    color: white;
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
    }

    .mobile-menu.show {
      display: block;
    }
  }
  </style>
