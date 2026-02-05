#!/bin/bash
# 部署脚本 - 从GitHub拉取最新代码

echo "🚀 开始部署到生产环境..."
echo "================================"

# 切换到项目目录
cd /var/www/photographer

# 检查Git状态
echo "📦 检查Git状态..."
git status

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 检查是否成功
if [ $? -eq 0 ]; then
    echo "✅ 代码拉取成功!"
    
    # 验证文件是否存在
    if [ -f "admin.html" ] && [ -f "supabase.js" ]; then
        echo "✅ 文件验证通过!"
        
        # 显示文件修改时间
        ls -lh admin.html supabase.js
        
        echo ""
        echo "================================"
        echo "🎉 部署完成!"
        echo ""
        echo "请访问后台管理页面测试新功能:"
        echo "  https://kenspace.online/admin.html"
        echo ""
        echo "新增功能:"
        echo "  • 优化的登录界面样式"
        echo "  • 账户设置页面 (左侧菜单)"
        echo "  • 修改用户名功能"
        echo "  • 修改密码功能 (需要当前密码验证)"
        echo "  • 密码强度指示器"
    else
        echo "❌ 文件验证失败!"
        exit 1
    fi
else
    echo "❌ 代码拉取失败!"
    exit 1
fi
