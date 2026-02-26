# 文件编码问题修复说明

## 问题描述

在配置API密钥时，出现了以下错误：

```
[plugin:vite:import-analysis] Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
```

## 根本原因

使用PowerShell的 `Get-Content` 和 `Set-Content` 命令替换API密钥时，导致了文件编码问题。中文字符被破坏，显示为乱码：

```
 * 使用说明�? * 1. 访问高德开放平台注册账号：https://console.amap.com/
 * 2. 创建应用并获取Web�?JS API)的Key
 * 3. 将获取到的Key替换下面�?9e80b9e7736f57e7e369895d2e71edc4
 * 4. 配置Key的安全域名（开发环境可配置�?* �?localhost�? */
```

这些无效的字符导致Vite无法正确解析JavaScript文件。

## 解决方案

使用 `Write` 工具重新创建整个 `src/config/amap.js` 文件，确保使用正确的UTF-8编码。

### 修复步骤

1. 使用 `Write` 工具重新创建文件
2. 确保所有中文字符正确显示
3. 保持API密钥配置：`9e80b9e7736f57e7e369895d2e71edc4`

### 修复后的文件

```javascript
/**
 * 高德地图配置文件
 *
 * 使用说明：
 * 1. 访问高德开放平台注册账号：https://console.amap.com/
 * 2. 创建应用并获取Web端(JS API)的Key
 * 3. 将获取到的Key替换下面的 YOUR_AMAP_KEY
 * 4. 配置Key的安全域名（开发环境可配置为 * 或 localhost）
 */

export const AMAP_CONFIG = {
  // 高德地图API Key - 请替换为您自己的Key
  key: '9e80b9e7736f57e7e369895d2e71edc4',
  // ...
}
```

## 验证结果

运行配置验证脚本：

```bash
node verify-config.js
```

输出：

```
========================================
高德地图配置验证
========================================

✅ API密钥已配置
   密钥: 9e80b9e7736f57e7e369895d2e71edc4
   版本: 2.0

✅ 配置验证通过
```

## 经验教训

1. **PowerShell编码问题**：在Windows上使用PowerShell处理包含中文的文件时，需要注意编码问题
2. **使用Write工具**：对于需要正确编码的文件，使用 `Write` 工具比 `Edit` 或命令行替换更可靠
3. **验证文件内容**：修改文件后，应该验证文件内容是否正确，特别是中文字符
4. **配置验证**：使用自动化脚本验证配置的正确性

## 后续建议

如果需要修改API密钥，建议：

### 方式1：使用配置脚本

```bash
# Windows
setup-key.bat

# Linux/Mac
./setup-key.sh
```

### 方式2：手动编辑

直接使用文本编辑器（如VS Code）打开 `src/config/amap.js` 文件，手动修改API密钥。

### 方式3：使用Write工具

使用 `Write` 工具重新创建整个文件，确保编码正确。

## 当前状态

- ✅ 文件编码问题已修复
- ✅ 中文字符显示正常
- ✅ API密钥配置正确
- ✅ 配置验证通过

---

**修复时间**: 2024-02-26
**修复工具**: CodeArts代码智能体
