  <template>
    <div class="route-templates">
      <div class="templates-container">
        <div class="page-header">
          <h2>路线模板</h2>
          <p>选择一个模板快速创建您的旅行路线</p>
        </div>

        <div class="templates-grid">
          <div
            v-for="template in templates"
            :key="template.id"
            class="template-card"
          >
            <div class="template-header">
              <span class="template-icon">{{ template.icon }}</span>
              <h3>{{ template.name }}</h3>
            </div>

            <div class="template-body">
              <div class="template-info">
                <div class="info-row">
                  <span class="info-label">天数:</span>
                  <span class="info-value">{{ template.days }} 天</span>
                </div>
                <div class="info-row">
                  <span class="info-label">目的地:</span>
                  <span class="info-value">{{ template.destinations.length }} 个</span>
                </div>
              </div>

              <div class="template-destinations">
                <div
                  v-for="(dest, index) in template.destinations"
                  :key="index"
                  class="dest-item"
                >
                  <span class="dest-number">{{ index + 1 }}</span>
                  <span class="dest-name">{{ dest }}</span>
                </div>
              </div>

              <div class="template-description">
                {{ template.description }}
              </div>
            </div>

            <div class="template-footer">
              <button @click="useTemplate(template)" class="btn-use">
                使用此模板
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const templates = ref([
    {
      id: 1,
      name: '北京深度游',
      icon: '🏛️',
      days: 5,
      description: '探索北京的历史文化,感受古都魅力',
      destinations: ['北京']
    },
    {
      id: 2,
      name: '华东五市游',
      icon: '🏙️',
      days: 7,
      description: '上海、杭州、苏州、南京、无锡经典路线',
      destinations: ['上海', '杭州', '苏州', '南京', '无锡']
    },
    {
      id: 3,
      name: '西南风情游',
      icon: '🏔️',
      days: 8,
      description: '云南、贵州、四川自然风光之旅',
      destinations: ['昆明', '大理', '丽江', '成都', '重庆']
    },
    {
      id: 4,
      name: '沿海休闲游',
      icon: '🏖️',
      days: 6,
      description: '青岛、大连、厦门海滨城市之旅',
      destinations: ['青岛', '大连', '厦门']
    },
    {
      id: 5,
      name: '西北大环线',
      icon: '🐪',
      days: 10,
      description: '西安、兰州、敦煌、青海湖大环线',
      destinations: ['西安', '兰州', '敦煌', '西宁', '青海湖']
    },
    {
      id: 6,
      name: '华南休闲游',
      icon: '🌴',
      days: 5,
      description: '广州、深圳、珠海、桂林休闲之旅',
      destinations: ['广州', '深圳', '珠海', '桂林']
    }
  ])

  const useTemplate = (template) => {
    router.push({
      path: '/route-planner',
      query: {
        template: JSON.stringify({
          name: template.name,
          destinations: template.destinations
        })
      }
    })
  }
  </script>

  <style scoped>
  .route-templates {
    min-height: calc(100vh - 64px);
    background: #f8f9fa;
    padding: 30px 20px;
  }

  .templates-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-header h2 {
    color: #2c3e50;
    margin: 0 0 10px 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .page-header p {
    color: #7f8c8d;
    font-size: 1.1rem;
    margin: 0;
  }

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
  }

  .template-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    border: 1px solid #e8ecef;
    transition: all 0.2s ease;
  }

  .template-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .template-header {
    background: #3498db;
    color: white;
    padding: 25px 20px;
    text-align: center;
  }

  .template-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 10px;
  }

  .template-header h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
  }

  .template-body {
    padding: 25px 20px;
  }

  .template-info {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8ecef;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .info-label {
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  .info-value {
    color: #2c3e50;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .template-destinations {
    margin-bottom: 20px;
  }

  .dest-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .dest-item:last-child {
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

  .template-description {
    color: #7f8c8d;
    font-size: 0.9rem;
    line-height: 1.6;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
  }

  .template-footer {
    padding: 20px;
    background: #fafbfc;
    border-top: 1px solid #e8ecef;
  }

  .btn-use {
    width: 100%;
    padding: 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-use:hover {
    background: #2980b9;
  }

  @media (max-width: 768px) {
    .templates-grid {
      grid-template-columns: 1fr;
    }

    .page-header h2 {
      font-size: 1.6rem;
    }

    .page-header p {
      font-size: 1rem;
    }
  }
  </style>
