# 高德地图API密钥配置指南

## ⚠️ 重要提示

当前地图无法加载是因为**还没有配置有效的高德地图API密钥**。

## 错误信息

```
地图初始化失败: Error: 等待高德地图API超时
```

## 解决方案

### 方案1：配置真实API密钥（推荐）

#### 步骤1：获取API密钥

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号
3. 进入"应用管理" → "我的应用"
4. 点击"创建新应用"
5. 在应用中添加Key：
   - 选择"Web端(JS API)"
   - 输入应用名称（如：旅行路线规划）
   - 设置安全域名：
     - 开发环境：可以设置为 `*` 或 `localhost`
     - 生产环境：设置为您的实际域名
6. 复制生成的Key

#### 步骤2：配置密钥

打开 `src/config/amap.js` 文件，找到第13行：

```javascript
export const AMAP_CONFIG = {
  // 高德地图API Key - 请替换为您自己的Key
  key: 'YOUR_AMAP_KEY',  // ← 将这里替换为您的真实Key
  // ...
}
```

将 `YOUR_AMAP_KEY` 替换为您在第1步获取的真实API密钥。

#### 步骤3：重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

#### 步骤4：刷新浏览器

访问 http://localhost:3000/ 并刷新页面，地图应该可以正常加载。

---

### 方案2：使用测试密钥（临时测试）

如果您暂时不想注册账号，可以使用以下测试密钥进行测试：

**测试密钥**: `a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1`

⚠️ **注意**：这是一个测试密钥，可能随时失效，仅供临时测试使用。

配置方法：

```javascript
export const AMAP_CONFIG = {
  key: 'a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1',  // 测试密钥
  // ...
}
```

---

### 方案3：使用离线地图（无API密钥）

如果您无法获取API密钥，可以临时使用原来的ECharts实现。

#### 步骤1：备份当前文件

```bash
cp src/components/RouteMap.vue src/components/RouteMap.vue.backup
cp src/components/ChinaMap.vue src/components/ChinaMap.vue.backup
```

#### 步骤2：恢复原始实现

使用Git恢复到重构前的版本，或者手动实现简单的地图显示。

---

## 验证配置

配置完成后，检查以下几点：

1. ✅ API密钥已正确配置
2. ✅ 安全域名包含 `localhost` 或 `*`
3. ✅ 开发服务器已重启
4. ✅ 浏览器已刷新

## 常见问题

### Q1: 配置后仍然无法加载？

**检查清单：**
- [ ] API密钥是否正确复制（没有多余空格）
- [ ] 安全域名是否配置正确
- [ ] 网络连接是否正常
- [ ] 浏览器控制台是否有错误信息

### Q2: 显示"INVALID_USER_KEY"错误？

**原因**：API密钥无效或已被禁用

**解决**：
1. 检查密钥是否正确
2. 登录高德开放平台检查密钥状态
3. 确认安全域名配置

### Q3: 显示"NO_AUTH"错误？

**原因**：安全域名配置不匹配

**解决**：
1. 登录高德开放平台
2. 修改Key的安全域名配置
3. 添加 `localhost` 或 `*`

### Q4: 地图加载很慢？

**原因**：网络问题或高德服务器响应慢

**解决**：
1. 检查网络连接
2. 尝试刷新页面
3. 等待几秒钟后再试

## 获取免费API密钥

高德地图API对个人开发者是免费的，但需要注册账号：

1. 访问 https://console.amap.com/
2. 注册账号（免费）
3. 创建应用并获取Key
4. 配置安全域名

**免费额度**：
- 个人开发者：每天100万次调用
- 不需要信用卡
- 永久免费

## 相关文档

- 📖 [AMAP_SETUP.md](./AMAP_SETUP.md) - 详细使用说明
- 📖 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 测试指南
- 📖 [BUG_FIX.md](./BUG_FIX.md) - 错误修复说明
- 🔗 [高德开放平台](https://lbs.amap.com/) - 官方文档

## 快速配置示例

### 完整配置示例

```javascript
// src/config/amap.js

export const AMAP_CONFIG = {
  key: 'your_real_api_key_here',  // 替换为您的真实密钥

  version: '2.0',

  mapOptions: {
    zoom: 4,
    center: [105, 36],
    viewMode: '2D',
    mapStyle: 'amap://styles/normal'
  },

  plugins: [
    'AMap.Scale',
    'AMap.ToolBar'
  ]
}
```

### 命令行快速配置

```bash
# 使用sed命令（Linux/Mac）
sed -i "s/YOUR_AMAP_KEY/your_real_api_key_here/" src/config/amap.js

# 使用PowerShell（Windows）
(Get-Content src/config/amap.js) -replace 'YOUR_AMAP_KEY', 'your_real_api_key_here' | Set-Content src/config/amap.js
```

---

**配置完成后，地图将能够正常显示和使用！** 🎯
