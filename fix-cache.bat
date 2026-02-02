@echo off
chcp 65001 >nul
echo 🚀 推送修复更新到 GitHub
echo ===========================
echo 修复内容：添加数据版本控制，强制清除浏览器缓存

echo [1/5] 添加文件...
git add .

echo [2/5] 提交更改...
git commit -m "修复: 添加数据版本控制，强制清除浏览器缓存 - 2026-02-02"

echo [3/5] 拉取最新代码...
git pull origin main

echo [4/5] 推送到 GitHub...
git push origin main

echo [5/5] 完成！
echo.
echo ✅ 更新已推送！
echo.
echo 📋 下一步操作：
echo    1. 访问前端页面: https://ufod1fi7ijge.space.minimaxi.com/
echo    2. 按 F12 打开开发者工具
echo    3. 刷新页面（或按 Ctrl+F5 强制刷新）
echo    4. 检查图片是否已更新

pause
