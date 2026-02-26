@echo off
chcp 65001 >nul
echo ========================================
echo 高德地图API密钥配置工具
echo ========================================
echo.
echo 此工具将帮助您配置高德地图API密钥
echo.
echo 获取API密钥的步骤：
echo 1. 访问 https://console.amap.com/
echo 2. 注册/登录账号
echo 3. 创建应用并获取Web端(JS API)的Key
echo 4. 将Key粘贴到下面
echo.
echo ========================================
echo.

set /p API_KEY="请输入您的高德地图API密钥: "

if "%API_KEY%"=="" (
    echo.
    echo [错误] API密钥不能为空！
    pause
    exit /b 1
)

echo.
echo 正在配置API密钥...

if exist "src\config\amap.js" (
    powershell -Command "(Get-Content 'src\config\amap.js') -replace 'YOUR_AMAP_KEY', '%API_KEY%' | Set-Content 'src\config\amap.js'"
    echo.
    echo [成功] API密钥已配置！
    echo.
    echo 配置的密钥: %API_KEY%
    echo.
    echo 下一步：
    echo 1. 重启开发服务器（Ctrl+C 停止，然后运行 npm run dev）
    echo 2. 刷新浏览器页面
    echo 3. 地图应该可以正常加载
    echo.
) else (
    echo.
    echo [错误] 找不到配置文件 src\config\amap.js
    echo 请确保在项目根目录下运行此脚本
)

echo.
pause
