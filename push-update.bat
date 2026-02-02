@echo off
chcp 65001 >nul
echo 🚀 推送更新到 GitHub
echo =======================

echo [1/5] 添加文件...
git add .

echo [2/5] 提交更改...
git commit -m "修复: 更新城市废墟和自然纹理图片 - %date% %time%"

echo [3/5] 拉取最新代码...
git pull origin main --allow-unrelated-histories

echo [4/5] 推送到 GitHub...
git push origin main

echo [5/5] 完成！
echo.
echo ✅ 更新已推送到 GitHub！
echo 🌐 请刷新浏览器查看更改

pause
