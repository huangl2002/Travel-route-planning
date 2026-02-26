# 快速开始指南

## ⚠️ 重要：地图无法加载？

如果您看到以下错误：
```
地图初始化失败: Error: 等待高德地图API超时
```

这是因为**还没有配置高德地图API密钥**。请按照以下步骤配置：

---

## 方式1：使用配置脚本（推荐）

### Windows用户

双击运行 `setup-key.bat` 文件，然后按照提示输入您的API密钥。

### Linux/Mac用户

```bash
chmod +x setup-key.sh
./setup-key.sh
```

然后按照提示输入您的API密钥。

---

## 方式2：手动配置

1. 打开 `src/config/amap.js` 文件
2. 找到第13行：
   ```javascript
   key: 'YOUR_AMAP_KEY',
   ```
3. 将 `YOUR_AMAP_KEY` 替换为您的高德地图API密钥
4. 保存文件
5. 重启开发服务器：
   ```bash
   npm run dev
   ```
6. 刷新浏览器页面

---

## 获取API密钥

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号（免费）
3. 创建应用并获取Web端(JS API)的Key
4. 设置安全域名为 `*` 或 `localhost`

**免费额度**：个人开发者每天100万次调用，永久免费。

---

## 启动项目

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/

---

## 功能说明

### 路线规划
1. 点击"路线规划"
2. 输入路线名称
3. 添加目的地（如：北京、上海、广东）
4. 设置出行日期和备注
5. 保存路线

### 查看路线
1. 点击"我的路线"
2. 点击任意路线查看详情
3. 地图显示完整路线
4. 点击目的地列表可聚焦到该位置

---

## 支持的目的地

支持全国34个省级行政区：
- 直辖市：北京、天津、上海、重庆
- 省：河北、山西、辽宁、吉林、黑龙江、江苏、浙江、安徽、福建、江西、山东、河南、湖北、湖南、广东、海南、四川、贵州、云南、陕西、甘肃、青海、台湾
- 自治区：内蒙古、广西、西藏、宁夏、新疆
- 特别行政区：香港、澳门

---

## 常见问题

### Q: 地图显示空白？

A: 请检查是否已配置API密钥，参考上面的配置步骤。

### Q: 显示"INVALID_USER_KEY"？

A: API密钥无效，请检查密钥是否正确配置。

### Q: 显示"NO_AUTH"？

A: 安全域名配置不匹配，请在高德开放平台配置安全域名为 `*` 或 `localhost`。

---

## 详细文档

- 📖 [API密钥配置指南](./API_KEY_CONFIG.md) - 详细的配置说明
- 📖 [高德地图使用说明](./AMAP_SETUP.md) - 完整的使用文档
- 📖 [测试指南](./TESTING_GUIDE.md) - 功能测试指南
- 📖 [错误修复说明](./BUG_FIX.md) - 错误排查

---

## 项目结构

```
Travel-route-planning/
├── src/
│   ├── components/
│   │   ├── ChinaMap.vue      # 地图组件（高德地图）
│   │   └── RouteMap.vue      # 路线地图组件
│   ├── config/
│   │   └── amap.js          # 高德地图配置
│   └── views/
│       ├── RoutePlanner.vue # 路线规划页面
│       └── RouteViewer.vue  # 路线查看页面
├── setup-key.bat            # Windows配置脚本
├── setup-key.sh             # Linux/Mac配置脚本
└── API_KEY_CONFIG.md        # API密钥配置指南
```

---

## 技术栈

- Vue 3.4.0
- Vue Router 4.2.5
- Vite 5.0.0
- 高德地图JavaScript API 2.0

---

**配置API密钥后即可开始使用！** 🎯
