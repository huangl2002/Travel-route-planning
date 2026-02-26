# 更新日志

所有重要的项目更改都将记录在此文件中。

## [2.0.0] - 2024-02-26

### 重大更新 - 地图功能重构

根据[阿里云教程](https://developer.aliyun.com/article/1547089)对地图功能进行了全面重构，从ECharts和Canvas实现迁移到高德地图JavaScript API。

### 新增功能

#### 地图实现
- ✨ 使用高德地图JavaScript API v2.0
- ✨ 真实地图数据替代简化地图
- ✨ 支持全国34个省级行政区的精确显示
- ✨ 交互式地图操作（拖拽、缩放）
- ✨ 地图控件（比例尺、工具栏）

#### 地图组件
- ✨ 重构 `ChinaMap.vue` 组件
  - 基于高德地图API实现
  - 支持目的地标记显示
  - 支持路线连线
  - 自动视野调整
  - 加载状态提示

- ✨ 重构 `RouteMap.vue` 组件
  - 基于高德地图API实现
  - 目的地列表点击聚焦功能
  - 响应式设计优化
  - 加载状态提示

#### 配置管理
- ✨ 新增 `src/config/amap.js` 配置文件
  - 集中管理API密钥
  - 地图默认配置
  - 省份坐标数据
  - API加载函数

#### 文档
- ✨ 新增 `AMAP_SETUP.md` - 高德地图集成使用说明
- ✨ 新增 `TESTING_GUIDE.md` - 地图功能测试指南
- ✨ 新增 `CHANGELOG.md` - 更新日志

### 改进

#### 性能优化
- ⚡ 优化地图加载性能
- ⚡ 减少不必要的重渲染
- ⚡ 优化标记和路线的创建逻辑

#### 用户体验
- 🎨 添加地图加载动画
- 🎨 优化标记样式和动画效果
- 🎨 改进路线显示样式（虚线）
- 🎨 增强错误提示信息

#### 代码质量
- 📝 统一代码风格
- 📝 添加详细的注释
- 📝 模块化配置管理
- 📝 改进错误处理

### 技术变更

#### 依赖变更
- ❌ 移除对ECharts的依赖（地图功能部分）
- ✨ 使用高德地图JavaScript API（通过CDN加载）

#### API变更
- 🔄 `ChinaMap.vue` 组件API保持不变
- 🔄 `RouteMap.vue` 组件API保持不变
- ✨ 新增配置文件导出函数

### 文件变更

#### 新增文件
- `src/config/amap.js` - 高德地图配置
- `AMAP_SETUP.md` - 使用说明
- `TESTING_GUIDE.md` - 测试指南
- `CHANGELOG.md` - 更新日志

#### 修改文件
- `src/components/ChinaMap.vue` - 完全重构
- `src/components/RouteMap.vue` - 完全重构

#### 未修改文件
- `src/views/RoutePlanner.vue` - 无需修改（已使用RouteMap组件）
- `src/views/RouteViewer.vue` - 无需修改（已使用RouteMap组件）
- `src/router/index.js` - 无需修改
- `package.json` - 无需修改

### 配置要求

#### 必需配置
⚠️ **重要：使用前必须配置高德地图API密钥**

1. 访问 https://console.amap.com/
2. 注册账号并创建应用
3. 获取Web端(JS API)的Key
4. 在 `src/config/amap.js` 中配置密钥

#### 可选配置
- 地图默认缩放级别
- 地图中心点
- 地图样式（标准、暗色、浅色等）

### 兼容性

#### 浏览器支持
- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)
- ✅ 移动端浏览器

#### 平台支持
- ✅ Windows
- ✅ macOS
- ✅ Linux
- ✅ 移动设备

### 已知问题

#### 当前版本
- 暂无已知问题

### 迁移指南

#### 从 v1.x 升级到 v2.0.0

1. **配置API密钥**（必需）
   ```javascript
   // src/config/amap.js
   export const AMAP_CONFIG = {
     key: 'YOUR_AMAP_KEY', // 替换为您的密钥
     // ...
   }
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动项目**
   ```bash
   npm run dev
   ```

4. **测试功能**
   - 参考 `TESTING_GUIDE.md` 进行测试

#### 破坏性变更
- 无破坏性变更，组件API保持兼容

### 后续计划

#### v2.1.0（计划中）
- [ ] 集成地理编码API（支持任意城市名称）
- [ ] 添加路线规划功能（驾车/步行路线）
- [ ] 支持POI搜索
- [ ] 添加多种地图类型（卫星图、地形图）

#### v2.2.0（计划中）
- [ ] 离线地图支持
- [ ] 自定义地图样式编辑器
- [ ] 地图导出功能
- [ ] 分享路线功能

### 贡献者

- CodeArts代码智能体 - 主要开发者

### 致谢

- 高德地图开放平台提供地图服务
- 阿里云开发者社区提供教程参考

### 许可证

保持原有许可证不变。

---

## [1.0.0] - 之前版本

### 初始版本

- 使用ECharts实现中国地图
- 使用Canvas+SVG实现路线地图
- 基本的路线规划功能
- 路线保存和查看功能

---

**更新日志格式参考：[Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)**
