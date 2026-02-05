#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修改 admin.html 添加用户登录功能
"""

def add_login_page():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 在 body 开始处添加登录遮罩层
    old_body_start = '''    <!-- Toast Container -->
    <div class="toast-container" id="toast-container"></div>

    <script src="supabase.js"></script>
    <script>'''

    new_body_start = '''    <!-- Toast Container -->
    <div class="toast-container" id="toast-container"></div>

    <!-- Login Overlay -->
    <div id="login-overlay" class="login-overlay" style="display: none;">
        <div class="login-container">
            <div class="login-header">
                <h1>PHOTOGRAPHER</h1>
                <p>后台管理系统</p>
            </div>
            <form id="login-form" class="login-form">
                <div class="form-group">
                    <label for="login-username">用户名</label>
                    <input type="text" id="login-username" placeholder="请输入用户名" required>
                </div>
                <div class="form-group">
                    <label for="login-password">密码</label>
                    <input type="password" id="login-password" placeholder="请输入密码" required>
                </div>
                <div id="login-error" class="login-error" style="display: none;"></div>
                <button type="submit" class="btn btn-primary btn-block">登录</button>
            </form>
            <div class="login-footer">
                <p>© 2026 PHOTOGRAPHER</p>
            </div>
        </div>
    </div>

    <script src="supabase.js"></script>
    <script>'''

    if old_body_start in content:
        content = content.replace(old_body_start, new_body_start)
        print("✅ 添加登录遮罩层 HTML")
    
    # 2. 在样式部分添加登录样式（在最后一个 style 标签之后）
    old_style_end = '''    <style>
        .navbar { will-change: transform; }
        .hero-slider { will-change: opacity; }
        .work-gallery { will-change: transform; }
    </style>'''

    new_style_end = '''    <style>
        .navbar { will-change: transform; }
        .hero-slider { will-change: opacity; }
        .work-gallery { will-change: transform; }

        /* Login Styles */
        .login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .login-container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .login-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .login-header p {
            color: #666;
            font-size: 14px;
        }

        .login-form .form-group {
margin-bottom: 20px;
        }

        .login-form label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }

        .login-form input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        .login-form input:focus {
            outline: none;
            border-color: #0066cc;
        }

        .login-error {
            background: #fee;
            border: 1px solid #fcc;
            color: #c00;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .btn-block {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            font-weight: 600;
        }

        .login-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
        }

        .login-footer p {
            color: #999;
            font-size: 12px;
        }

        /* Admin user info */
        .admin-user-info {
            position: absolute;
            right: 80px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            gap: 10px;
            color: #666;
            font-size: 14px;
        }

        .admin-user-info .username {
            font-weight: 500;
            color: #333;
        }

        .admin-user-info .logout-btn {
            background: none;
            border: 1px solid #e5e5e5;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
        }

        .admin-user-info .logout-btn:hover {
            background: #dc3545;
            border-color: #dc3545;
            color: white;
        }
    </style>'''

    if old_style_end in content:
        content = content.replace(old_style_end, new_style_end)
        print("✅ 添加登录界面样式")
    
    # 3. 在 script 开头添加登录检查逻辑
    old_script_start = '''    <script>
        // Global State
        let currentPage = 'dashboard';
        let categories = [];
        let attributes = [];
        let deleteTarget = { type: '', id: '', message: '' };
        let photoCategoryCounts = {};

        // Initialize
        document.addEventListener('DOMContentLoaded', async function() {
            // 初始化 Supabase 客户端
            await initSupabase();'''

    new_script_start = '''    <script>
        // Global State
        let currentPage = 'dashboard';
        let categories = [];
        let attributes = [];
        let deleteTarget = { type: '', id: '', message: '' };
        let photoCategoryCounts = {};
        let isLoggedIn = false;

        // ============ Authentication ============

        async function checkAuth() {
            console.log('[Auth] 检查登录状态...');
            
            try {
                const { authenticated, session } = await window.supabase.checkSession();
                
                if (authenticated) {
                    console.log('[Auth] 已登录:', session.username);
                    return { authenticated: true, session };
                } else {
                    console.log('[Auth] 未登录');
                    return { authenticated: false, session: null };
                }
            } catch (error) {
                console.error('[Auth] 检查登录状态失败:', error);
                return { authenticated: false, session: null };
            }
        }

        async function doLogin(username, password) {
            console.log('[Auth] 尝试登录:', username);
            
            const { error, data} = await window.supabase.login(username, password);
            
            if (error) {
                console.error('[Auth] 登录失败:', error.message);
                return { success: false, error: error.message };
            }
            
            console.log('[Auth] 登录成功:', data.username);
            return { success: true, data };
        }

        async function doLogout() {
            console.log('[Auth] 退出登录');
            await window.supabase.logout();
        }

        function showLoginPage() {
            const overlay = document.getElementById('login-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
            
            // 隐藏管理页面
            const adminContainer = document.querySelector('.admin-container');
            if (adminContainer) {
                adminContainer.style.display = 'none';
            }
        }

        function hideLoginPage() {
            const overlay = document.getElementById('login-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
            
            // 显示管理页面
            const adminContainer = document.querySelector('.admin-container');
            if (adminContainer) {
                adminContainer.style.display = 'flex';
            }
        }

        function showAdminUserInfo(username) {
            const navbar = document.querySelector('.nav-container');
            if (!navbar) return;
            
            // 移除已存在的用户信息
            const existing = navbar.querySelector('.admin-user-info');
            if (existing) {
                existing.remove();
            }
            
            // 创建用户信息元素
            const userInfo = document.createElement('div');
            userInfo.className = 'admin-user-info';
            userInfo.innerHTML = `
                <span class="username">👤 ${username}</span>
                <button class="logout-btn" onclick="handleLogout()">退出</button>
            `;
            
            navbar.appendChild(userInfo);
        }

        async function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            
            if (!username || !password) {
                errorEl.textContent = '请输入用户名和密码';
                errorEl.style.display = 'block';
                return;
            }
            
            const result = await doLogin(username, password);
            
            if (result.success) {
                errorEl.style.display = 'none';
                hideLoginPage();
                showAdminUserInfo(result.data.username);
                showToast('登录成功，欢迎回来！', 'success');
                
                // 初始化管理页面
                await initAdminPage();
            } else {
                errorEl.textContent = result.error;
                errorEl.style.display = 'block';
            }
        }

        async function handleLogout() {
            await doLogout();
            
            // 移除用户信息
            const userInfo = document.querySelector('.admin-user-info');
            if (userInfo) {
                userInfo.remove();
            }
            
            showLoginPage();
            showToast('已退出登录', 'success');
        }

        async function initAdminPage() {
            // 初始化各个模块
            initNavigation();
            await loadDashboard();
            await loadCategories();
            await loadAttributes();
            await loadPhotos();
            await loadCategoryDropdown();
            await loadAttributeFields();
            initUploadForm();
            initImagePreview();
            initCategoryForm();
            initAttributeForm();
            initPhotoForm();
            initAboutForm();
            initAvatarPreview();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', async function() {
            console.log('[Init] 后台管理系统启动...');
            
            // 初始化 Supabase
            await initSupabase();
            
            // 检查登录状态
            const { authenticated, session } = await checkAuth();
            
            if (authenticated) {
                console.log('[Init] 用户已登录，显示管理页面');
                hideLoginPage();
                showAdminUserInfo(session.username);
                await initAdminPage();
            } else {
                console.log('[Init] 用户未登录，显示登录页面');
                showLoginPage();
            }
            
            // 绑定登录表单
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
        });'''

    if old_script_start in content:
        content = content.replace(old_script_start, new_script_start)
        print("✅ 添加登录检查和表单处理逻辑")
    
    # 保存文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print()
    print("=" * 60)
    print("✅ 登录功能添加完成！")
    print("=" * 60)
    print()
    print("📝 新增功能：")
    print()
    print("  1. 登录界面")
    print("     - 全屏登录遮罩层")
    print("     - 用户名/密码输入")
    print("     - 错误提示")
    print("     - 响应式设计")
    print()
    print("  2. 认证流程")
    print("     - 自动检查登录状态")
    print("     - 未登录显示登录界面")
    print("     - 登录成功后显示管理页面")
    print()
    print("  3. 用户体验")
    print("     - 显示当前用户名")
    print("     - 一键退出登录")
    print("     - Toast 提示")
    print()
    print("  4. 安全保障")
    print("     - Session 存储")
    print("     - 7天有效期")
    print("     - 自动过期处理")
    print()
    print("⚠️  重要提示：")
    print("  - 默认账号: admin")
    print("  - 默认密码: admin123")
    print("  - 建议首次登录后立即修改密码！")
    print()
    print("💡 使用方法：")
    print("  1. 访问后台管理页面")
    print("  2. 输入用户名和密码")
    print("  3. 点击登录")
    print("  4. 管理功能正常使用")
    print("  5. 点击右上角\"退出\"按钮登出")

if __name__ == '__main__':
    add_login_page()
