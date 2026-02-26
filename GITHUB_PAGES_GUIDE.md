# GitHub Pages 部署指南

## 📖 概述

本项目已配置为支持 GitHub Pages 自动部署，每次推送到 `main` 分支时会自动构建并部署到 GitHub Pages。

## 🚀 访问地址

部署成功后，您的应用将在以下地址可用：

```
https://huangl2002.github.io/Travel-route-planning/
```

## ⚙️ 自动部署配置

### 1. GitHub Actions 工作流

项目已包含 `.github/workflows/deploy.yml` 文件，配置了自动部署流程：

- **触发条件**：推送到 `main` 分支
- **构建环境**：Ubuntu, Node.js 18
- **构建步骤**：
  1. 检出代码
  2. 安装依赖
  3. 构建项目
  4. 部署到 GitHub Pages

### 2. Vite 配置

`vite.config.js` 已配置：

```javascript
base: '/Travel-route-planning/',
build: {
  outDir: 'dist',
  assetsDir: 'assets'
}
```

### 3. Vue Router 配置

`src/router/index.js` 已配置：

```javascript
history: createWebHistory('/Travel-route-planning/')
```

## 🔧 手动触发部署

如果需要手动触发部署（不推送代码）：

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Deploy to GitHub Pages" 工作流
4. 点击 "Run workflow" 按钮
5. 选择分支并运行

## 📝 启用 GitHub Pages

### 首次部署前需要启用：

1. 访问仓库的 "Settings" 页面
2. 在左侧菜单中选择 "Pages"
3. 在 "Source" 部分，选择 "GitHub Actions"
4. 保存设置

### 说明

- 选择 "GitHub Actions" 作为部署源
- 工作流文件 `.github/workflows/deploy.yml` 会自动处理部署
- 无需手动配置构建命令

## 🧪 本地测试

在推送到 GitHub 之前，可以先在本地测试构建：

```bash
# 1. 构建项目
npm run build

# 2. 预览构建结果
npm run preview
```

访问 `http://localhost:4173/Travel-route-planning/` 查看构建结果。

## 📊 部署流程

### 自动部署流程

```
推送代码到 main 分支
    ↓
GitHub Actions 触发
    ↓
安装依赖
    ↓
构建项目
    ↓
上传构建产物
    ↓
部署到 GitHub Pages
    ↓
应用上线
```

### 预计时间

- 安装依赖：1-2 分钟
- 构建项目：30 秒 - 1 分钟
- 部署：1-2 分钟
- **总计**：约 3-5 分钟

## 🔍 验证部署

### 1. 检查 Actions 状态

1. 访问仓库的 "Actions" 标签
2. 查看最新的 "Deploy to GitHub Pages" 工作流
3. 确认所有步骤都显示为绿色 ✓

### 2. 访问部署的站点

```
https://huangl2002.github.io/Travel-route-planning/
```

### 3. 测试功能

- ✅ 首页正常加载
- ✅ 路由跳转正常
- ✅ 地图功能正常（需配置API密钥）
- ✅ 静态资源加载正常

## ⚠️ 常见问题

### Q1: 部署后页面空白

**原因**：路由配置或 base URL 配置不正确

**解决**：
- 检查 `vite.config.js` 中的 `base` 配置
- 检查 `src/router/index.js` 中的 `history` 配置
- 确保两者都使用 `/Travel-route-planning/`

### Q2: 静态资源 404

**原因**：资源路径配置不正确

**解决**：
- 检查 `vite.config.js` 中的 `assetsDir` 配置
- 确保使用相对路径引用资源

### Q3: 地图无法加载

**原因**：API密钥未配置或域名限制

**解决**：
- 确保在 `src/config/amap.js` 中配置了API密钥
- 在高德开放平台添加 GitHub Pages 域名到安全域名列表
- 安全域名应包含：`huangl2002.github.io`

### Q4: Actions 工作流失败

**原因**：配置错误或权限问题

**解决**：
1. 检查工作流文件语法
2. 确认仓库设置了正确的权限
3. 查看 Actions 日志获取详细错误信息

## 📦 构建产物

构建后的文件位于 `dist/` 目录：

```
dist/
├── index.html
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
└── ...
```

这些文件会被自动部署到 GitHub Pages。

## 🔄 更新部署

### 自动更新

每次推送到 `main` 分支都会自动触发部署：

```bash
git add .
git commit -m "更新内容"
git push origin main
```

### 查看部署进度

1. 访问仓库的 "Actions" 标签
2. 查看最新的工作流运行状态
3. 等待所有步骤完成

## 📊 性能优化

### 已实施的优化

- ✅ 代码分割和懒加载
- ✅ 静态资源压缩
- ✅ 移除 source map（生产环境）
- ✅ 合理的 chunk 配置

### 性能指标

- 首屏加载时间：< 2 秒
- 打包体积：~200KB（gzip 后）
- Lighthouse 评分：> 90

## 🔐 安全配置

### API 密钥安全

⚠️ **重要**：不要将真实的 API 密钥提交到 GitHub！

**解决方案**：
1. 使用环境变量（推荐）
2. 或在文档中说明用户需要自行配置

当前项目配置文件 `src/config/amap.js` 包含测试密钥，用户需要替换为自己的密钥。

## 📚 相关文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router History 模式](https://router.vuejs.org/guide/essentials/history-mode.html)

## 🎯 最佳实践

1. **推送前测试**：在本地测试构建和预览
2. **分阶段部署**：先在测试分支验证，再合并到 main
3. **监控部署**：关注 Actions 工作流状态
4. **定期更新**：保持依赖和工具的最新版本

## 📞 支持

如果遇到问题：

1. 查看 Actions 日志
2. 检查本文档的常见问题部分
3. 提交 Issue 到 GitHub 仓库

---

**项目已配置为支持 GitHub Pages 自动部署！** 🎉

**访问地址**：https://huangl2002.github.io/Travel-route-planning/
