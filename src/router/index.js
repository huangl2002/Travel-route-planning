  import { createRouter, createWebHistory } from 'vue-router'
  import Home from '@/views/Home.vue'

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/route-planner',
      name: 'RoutePlanner',
      component: () => import('@/views/RoutePlanner.vue')
    },
    {
      path: '/my-routes',
      name: 'MyRoutes',
      component: () => import('@/views/MyRoutes.vue')
    },
    {
      path: '/route-viewer/:id',
      name: 'RouteViewer',
      component: () => import('@/views/RouteViewer.vue')
    },
    {
      path: '/templates',
      name: 'RouteTemplates',
      component: () => import('@/views/RouteTemplates.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue')
    }
  ]

  const router = createRouter({
    // GitHub Pages 需要使用 base URL
    history: createWebHistory('/Travel-route-planning/'),
    routes
  })

  export default router
