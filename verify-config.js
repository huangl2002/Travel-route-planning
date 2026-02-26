/**
 * 配置验证脚本
 * 用于验证高德地图API密钥配置是否正确
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('========================================')
console.log('高德地图配置验证')
console.log('========================================\n')

try {
  const configPath = join(__dirname, 'src/config/amap.js')
  const configContent = readFileSync(configPath, 'utf-8')

  // 检查API密钥
  const keyMatch = configContent.match(/key:\s*'([^']+)'/)
  const versionMatch = configContent.match(/version:\s*'([^']+)'/)

  if (!keyMatch) {
    console.error('❌ 错误：未找到API密钥配置')
    console.log('请检查 src/config/amap.js 文件')
    process.exit(1)
  }

  const key = keyMatch[1]
  const version = versionMatch ? versionMatch[1] : '未知'

  console.log('✅ API密钥已配置')
  console.log(`   密钥: ${key}`)
  console.log(`   版本: ${version}\n`)

  // 检查是否为默认占位符
  if (key === 'YOUR_AMAP_KEY') {
    console.error('❌ 错误：API密钥仍为默认占位符')
    console.log('请替换为您的高德地图API密钥')
    console.log('\n获取API密钥：')
    console.log('1. 访问 https://console.amap.com/')
    console.log('2. 注册/登录账号')
    console.log('3. 创建应用并获取Web端(JS API)的Key')
    console.log('4. 将Key配置到 src/config/amap.js')
    process.exit(1)
  }

  // 检查密钥格式（高德地图密钥通常是32位十六进制字符串）
  const keyPattern = /^[a-f0-9]{32}$/i
  if (!keyPattern.test(key)) {
    console.warn('⚠️  警告：API密钥格式可能不正确')
    console.log(`   预期格式：32位十六进制字符串`)
    console.log(`   当前格式：${key.length}位字符\n`)
  }

  console.log('✅ 配置验证通过')
  console.log('\n下一步：')
  console.log('1. 确保开发服务器正在运行：npm run dev')
  console.log('2. 访问 http://localhost:3000/')
  console.log('3. 测试地图功能')
  console.log('\n========================================')

} catch (error) {
  console.error('❌ 错误：无法读取配置文件')
  console.error(error.message)
  process.exit(1)
}
