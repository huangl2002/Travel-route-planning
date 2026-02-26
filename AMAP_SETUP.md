# 高德地图集成使用说明

## 概述

本项目已根据阿里云教程重新构建地图功能，使用高德地图JavaScript API替代原有的ECharts和Canvas实现。新的地图方案提供更真实的地图数据、更流畅的交互体验和更强大的功能。

## 功能特点

### 1. 真实地图数据
- 使用高德地图提供的真实地图数据
- 支持全国34个省级行政区的精确显示
- 自动缩放和视野调整

### 2. 交互式地图
- 支持鼠标拖拽平移
- 支持滚轮缩放
- 支持地图控件（比例尺、工具栏）
- 目的地标记点击交互

### 3. 路线可视化
- 自动绘制目的地之间的路线
- 虚线样式显示路线连接
- 自动调整视野以显示完整路线

### 4. 加载状态提示
- 地图加载时显示加载动画
- 加载失败时显示错误提示

## 配置步骤

### 步骤1：获取高德地图API密钥

1. 访问[高德开放平台](https://console.amap.com/)
2. 注册账号并登录
3. 进入"应用管理" -> "我的应用"
4. 点击"创建新应用"
5. 在应用中添加Key，选择"Web端(JS API)"
6. 设置安全域名：
   - 开发环境：可以设置为 `*` 或 `localhost`
   - 生产环境：设置为您的实际域名
7. 复制生成的Key

### 步骤2：配置API密钥

打开 `src/config/amap.js` 文件，找到以下配置：

```javascript
export const AMAP_CONFIG = {
  // 高德地图API Key - 请替换为您自己的Key
  key: 'YOUR_AMAP_KEY',
  // ...
}
```

将 `YOUR_AMAP_KEY` 替换为您在步骤1中获取的真实API密钥。

### 步骤3：运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 使用说明

### 路线规划页面

1. 访问"路线规划"页面
2. 输入路线名称
3. 添加目的地（支持省份名称，如"北京"、"上海"、"广东"等）
4. 地图会自动显示所有目的地的位置和路线
5. 设置出行日期和备注
6. 保存路线

### 路线查看页面

1. 访问"我的路线"页面
2. 点击任意路线查看详情
3. 地图显示路线的完整路径
4. 可以点击目的地列表中的项目，地图会自动聚焦到该位置

## 技术实现

### 组件结构

```
src/
├── components/
│   ├── ChinaMap.vue        # 通用地图组件（基于高德地图）
│   └── RouteMap.vue        # 路线地图组件（基于高德地图）
├── config/
│   └── amap.js            # 高德地图配置文件
└── views/
    ├── RoutePlanner.vue   # 路线规划页面
    └── RouteViewer.vue    # 路线查看页面
```

### 核心功能

#### 1. 地图初始化

```javascript
// 加载高德地图API
await loadAMapScript()

// 创建地图实例
mapInstance.value = new AMap.Map(mapContainer.value, AMAP_CONFIG.mapOptions)

// 添加控件
mapInstance.value.addControl(new AMap.Scale())
mapInstance.value.addControl(new AMap.ToolBar())
```

#### 2. 添加目的地标记

```javascript
const marker = new AMap.Marker({
  position: coords,
  title: dest,
  label: {
    content: `${index + 1}. ${dest}`,
    direction: 'top'
  },
  animation: 'AMAP_ANIMATION_DROP'
})
mapInstance.value.add(marker)
```

#### 3. 绘制路线

```javascript
const polyline = new AMap.Polyline({
  path: path,
  borderWeight: 2,
  strokeColor: '#667eea',
  lineJoin: 'round',
  strokeStyle: 'dashed'
})
mapInstance.value.add(polyline)
```

## 支持的目的地

当前支持全国34个省级行政区（包括省、自治区、直辖市、特别行政区）：

- 直辖市：北京、天津、上海、重庆
- 省：河北、山西、辽宁、吉林、黑龙江、江苏、浙江、安徽、福建、江西、山东、河南、湖北、湖南、广东、海南、四川、贵州、云南、陕西、甘肃、青海、台湾
- 自治区：内蒙古、广西、西藏、宁夏、新疆
- 特别行政区：香港、澳门

## 常见问题

### Q1: 地图无法显示或显示空白？

**A:** 请检查以下几点：
1. 确认已正确配置API密钥
2. 检查网络连接是否正常
3. 确认安全域名配置是否正确
4. 查看浏览器控制台是否有错误信息

### Q2: 目的地无法显示？

**A:** 请确认：
1. 目的地名称是否在支持列表中
2. 目的地名称是否正确（支持全称和简称）
3. 查看浏览器控制台是否有坐标获取失败的提示

### Q3: 如何添加更多目的地？

**A:** 目前支持34个省级行政区。如需支持更多城市级别，需要：
1. 获取更多城市的经纬度坐标
2. 在 `src/config/amap.js` 的 `getProvinceCoordinates()` 函数中添加
3. 或者使用高德地图的地理编码API自动获取坐标

### Q4: API密钥如何收费？

**A:** 高德地图JavaScript API对个人开发者是免费的，但有一定的调用限额。具体请参考[高德开放平台的价格说明](https://lbs.amap.com/api/pricing)。

### Q5: 如何自定义地图样式？

**A:** 在 `src/config/amap.js` 中修改 `mapOptions`：

```javascript
mapOptions: {
  zoom: 4,
  center: [105, 36],
  viewMode: '2D',
  mapStyle: 'amap://styles/normal'  // 可以修改为其他样式
}
```

高德地图提供多种预设样式，如：
- `amap://styles/normal`（标准）
- `amap://styles/dark`（暗色）
- `amap://styles/light`（浅色）
- `amap://styles/whitesmoke`（白雾）

## 后续优化建议

1. **地理编码集成**：使用高德地图的地理编码API，支持输入任意城市名称自动获取坐标
2. **路线规划**：集成高德地图的驾车/步行路线规划API，提供更真实的路线
3. **POI搜索**：添加地点搜索功能，支持搜索具体的景点、酒店等
4. **离线地图**：考虑添加离线地图支持
5. **多种地图类型**：支持卫星图、地形图等多种地图类型切换

## 参考资料

- [高德地图JavaScript API官方文档](https://lbs.amap.com/api/javascript-api/summary)
- [高德开放平台](https://lbs.amap.com/)
- [阿里云教程：使用高德地图实现旅行路线规划](https://developer.aliyun.com/article/1547089)

## 更新日志

### v2.0.0 (2024-02-26)
- 重大更新：从ECharts迁移到高德地图API
- 重构ChinaMap.vue组件
- 重构RouteMap.vue组件
- 新增配置文件管理API密钥
- 优化地图加载和交互体验
- 添加加载状态提示
- 支持目的地列表点击聚焦功能

## 许可证

本项目遵循原有许可证。高德地图API的使用需遵守高德开放平台的服务条款。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件

---

**注意：请务必在使用前配置好您的高德地图API密钥，否则地图将无法正常显示。**
