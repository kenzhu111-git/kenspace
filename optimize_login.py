#!/usr/bin/env python3
"""
优化登录界面样式并添加修改密码和用户名功能
"""
import re

def read_file(file_path):
    """读取文件内容"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(file_path, content):
    """写入文件内容"""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def add_login_styles(file_path):
    """添加优化后的登录界面样式"""
    content = read_file(file_path)

    # 检查是否已经存在登录样式，如果存在则跳过
    if '/* Login Overlay Styles */' in content:
        print("登录样式已存在，跳过添加")
        return

    # 在admin.html的<style>标签末尾添加登录界面样式
    login_styles = '''
    /* Login Overlay Styles */
    .login-overlay {
        position: fixed;
        inset: 0;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(10px);
    }

    .login-overlay.active {
        display: flex;
    }

    .login-container {
        background: #ffffff;
        border-radius: 16px;
        padding: 48px 40px;
        width: 100%;
        max-width: 420px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
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
        margin-bottom: 36px;
    }

    .login-header h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        letter-spacing: 0.15em;
        margin-bottom: 8px;
    }

    .login-header p {
        font-size: 14px;
        color: #666;
        letter-spacing: 0.05em;
    }

    .login-form .form-group {
        margin-bottom: 24px;
    }

    .login-form .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        letter-spacing: 0.02em;
    }

    .login-form .form-group input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e5e5;
        border-radius: 10px;
        font-size: 15px;
        transition: all 0.3s ease;
        background: #fafafa;
    }

    .login-form .form-group input:focus {
        outline: none;
        border-color: #1a1a1a;
        background: #fff;
        box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.1);
    }

    .login-form .form-group input::placeholder {
        color: #999;
    }

    .login-error {
        background: #fff0f0;
        border: 1px solid #ffcdd2;
        color: #c62828;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 13px;
        margin-bottom: 20px;
        text-align: center;
    }

    .login-form .btn-block {
        width: 100%;
        padding: 16px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 10px;
        margin-top: 12px;
        transition: all 0.3s ease;
        background: #1a1a1a;
        color: #fff;
        letter-spacing: 0.05em;
    }

    .login-form .btn-block:hover {
        background: #333;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .login-form .btn-block:active {
        transform: translateY(0);
    }

    .login-footer {
        text-align: center;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #eee;
    }

    .login-footer p {
        font-size: 12px;
        color: #999;
    }

    /* Admin User Info Styles */
    .admin-user-info {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }

    .admin-user-info .username {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .admin-user-info .logout-btn {
        padding: 6px 14px;
        font-size: 12px;
        color: #fff;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
    }

    .admin-user-info .logout-btn:hover {
        background: rgba(255, 255, 255, 0.25);
    }

    /* Account Settings Modal Styles */
    .account-modal .modal {
        max-width: 450px;
    }

    .account-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        background: #f5f5f5;
        padding: 6px;
        border-radius: 10px;
    }

    .account-tab {
        flex: 1;
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .account-tab.active {
        background: #fff;
        color: #1a1a1a;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .account-tab:hover:not(.active) {
        color: #333;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .current-info {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 20px;
    }

    .current-info .label {
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
    }

    .current-info .value {
        font-size: 15px;
        font-weight: 500;
        color: #1a1a1a;
    }

    .password-strength {
        height: 4px;
        background: #e5e5e5;
        border-radius: 2px;
        margin-top: 8px;
        overflow: hidden;
    }

    .password-strength-bar {
        height: 100%;
        width: 0;
        transition: all 0.3s ease;
        border-radius: 2px;
    }

    .password-strength-bar.weak {
        width: 33%;
        background: #ff5252;
    }

    .password-strength-bar.medium {
        width: 66%;
        background: #ffc107;
    }

    .password-strength-bar.strong {
        width: 100%;
        background: #4caf50;
    }

    .password-hint {
        font-size: 12px;
        color: #999;
        margin-top: 8px;
    }
'''

    # 在 </style> 标签前插入样式
    pattern = r'(</style>)'
    replacement = login_styles + r'\n\1'
    content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

    # 更新样式部分
    write_file(file_path, content)
    print(f"✅ 已添加登录界面优化样式到 {file_path}")

def add_account_management_to_supabase(file_path):
    """在supabase.js中添加账户管理方法"""
    content = read_file(file_path)

    # 检查是否已存在账户管理方法
    if 'updateUser' in content:
        print("账户管理方法已存在，跳过添加")
        return

    # 在SimpleSupabaseClient类中添加updateUser方法
    # 找到login方法的结束位置，添加updateUser方法
    login_method_pattern = r'(async logout\(\).*?\{.*?\})'
    replacement = r'''\1

    // ============ 用户管理方法 ============

    /**
     * 更新用户信息（用户名/密码）
     * @param {Object} updates - 更新的字段 {username, password, new_password}
     * @returns {Object} {success, error}
     */
    async updateUser(updates) {
        console.log('[Supabase] 更新用户信息:', updates);

        try {
// 获取当前用户
            const { users } = await this.getUsers();
            if (!users || users.length === 0) {
                return { error: { message: '未找到用户数据' } };
            }
            const currentUser = users[0];

            // 验证密码（如果是修改密码）
            if (updates.password) {
                const passwordHash = this.hashPassword(updates.password);
                if (passwordHash !== currentUser.password_hash) {
                    return { error: { message: '当前密码不正确' } };
                }
            }

            // 准备更新数据
            const userData = {
                id: currentUser.id,
                username: updates.username || currentUser.username,
                role: currentUser.role || 'admin',
                updated_at: new Date().toISOString()
            };

            // 如果要修改密码
            if (updates.new_password && updates.new_password.length >= 6) {
                userData.password_hash = this.hashPassword(updates.new_password);
            } else if (updates.new_password) {
                return { error: { message: '新密码长度至少6个字符' } };
            }

            // 保存用户数据
            const saveResult = await this.saveUsers([userData]);
            if (saveResult.error) {
                return { error: saveResult.error };
            }

            console.log('[Supabase] 用户信息更新成功');
            return { success: true, data: userData };
        } catch (error) {
            console.error('[Supabase] 更新用户信息失败:', error);
            return { error: { message: error.message } };
        }
    }

    /**
     * 验证当前密码
     * @param {string} password - 当前密码
     * @returns {boolean} 是否正确
     */
    async verifyPassword(password) {
        try {
            const { users } = await this.getUsers();
            if (!users || users.length === 0) {
                return false;
            }
            const currentUser = users[0];
            const passwordHash = this.hashPassword(password);
            return passwordHash === currentUser.password_hash;
        } catch (error) {
            console.error('[Supabase] 验证密码失败:', error);
            return false;
        }
    }'''

    content = re.sub(login_method_pattern, replacement, content, flags=re.DOTALL)
    write_file(file_path, content)
    print(f"✅ 已添加账户管理方法到 {file_path}")

def add_account_settings_ui(file_path):
    """在admin.html中添加账户设置页面和模态框"""
    content = read_file(file_path)

    # 检查是否已存在账户设置页面
    if 'page-account-settings' in content:
        print("账户设置页面已存在，跳过添加")
        return

    # 1. 在侧边栏导航中添加账户设置选项
    sidebar_nav_pattern = r'(<div class="nav-item" data-page="settings">)'
    sidebar_replacement = r'''\1
                <div class="nav-item" data-page="account">
                    <span class="nav-icon">👤</span>
                    <span>账户设置</span>
                </div>'''
    content = re.sub(sidebar_nav_pattern, sidebar_replacement, content)

    # 2. 在Settings页面后添加Account Settings页面
    settings_page_pattern = r'(<!-- Settings Page -->.*?</section>)'
    account_page = r'''\1

    <!-- Account Settings Page -->
    <section id="page-account" class="admin-page">
        <div class="page-header">
            <h2>账户设置</h2>
            <p>管理您的账户信息</p>
        </div>

        <div class="card">
            <h3>当前账户信息</h3>
            <div class="current-info">
                <div class="label">用户名</div>
                <div class="value" id="current-username">加载中...</div>
            </div>
            <div class="current-info">
                <div class="label">账户角色</div>
                <div class="value">管理员</div>
            </div>
        </div>

        <div class="card">
            <div class="account-tabs">
                <button class="account-tab active" data-tab="username">修改用户名</button>
                <button class="account-tab" data-tab="password">修改密码</button>
            </div>

            <!-- Username Tab -->
            <div id="tab-username" class="tab-content active">
                <form id="username-form">
                    <div class="form-group">
                        <label for="current-username-input">当前用户名</label>
                        <input type="text" id="current-username-input" readonly>
                    </div>
                    <div class="form-group">
                        <label for="new-username">新用户名 *</label>
                        <input type="text" id="new-username" required minlength="3" maxlength="20" placeholder="输入新用户名（3-20个字符）">
                    </div>
                    <div class="form-group">
                        <label for="confirm-username">确认新用户名 *</label>
                        <input type="text" id="confirm-username" required placeholder="再次输入新用户名">
                    </div>
                    <button type="submit" class="btn btn-primary">更新用户名</button>
                </form>
            </div>

            <!-- Password Tab -->
            <div id="tab-password" class="tab-content">
                <form id="password-form">
                    <div class="form-group">
                        <label for="current-password">当前密码 *</label>
                        <input type="password" id="current-password" required placeholder="输入当前密码">
                    </div>
                    <div class="form-group">
                        <label for="new-password">新密码 *</label>
                        <input type="password" id="new-password" required minlength="6" placeholder="输入新密码（至少6个字符）">
                        <div class="password-strength">
                            <div class="password-strength-bar" id="password-strength-bar"></div>
                        </div>
                        <p class="password-hint">密码强度指示器</p>
                    </div>
                    <div class="form-group">
                        <label for="confirm-new-password">确认新密码 *</label>
                        <input type="password" id="confirm-new-password" required placeholder="再次输入新密码">
                    </div>
                    <button type="submit" class="btn btn-primary">更新密码</button>
                </form>
            </div>
        </div>
    </section>'''
    content = re.sub(settings_page_pattern, account_page, content, flags=re.DOTALL)

    write_file(file_path, content)
    print(f"✅ 已添加账户设置页面到 {file_path}")

def add_account_settings_js(file_path):
    """在admin.html的JavaScript部分添加账户设置功能"""
    content = read_file(file_path)

    # 检查是否已存在账户设置JS代码
    if 'initAccountSettings' in content:
        print("账户设置JS代码已存在，跳过添加")
        return

    # 在initAdminPage函数中添加账户设置初始化
    init_admin_pattern = r'(async function initAdminPage\(\).*?\{)'
    init_replacement = r'''\1
            // 初始化账户设置
            initAccountSettings();'''
    content = re.sub(init_admin_pattern, init_replacement, content)

    # 在文件末尾添加账户设置相关函数（在</script>标签前）
    account_js_functions = '''

    // ============ 账户设置 ============

    function initAccountSettings() {
        console.log('[Account] 初始化账户设置...');

        // 初始化标签切换
        document.querySelectorAll('.account-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.dataset.tab;

                // 切换标签状态
                document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // 切换内容
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                document.getElementById('tab-' + tabId)?.classList.add('active');
            });
        });

        // 初始化用户名表单
        const usernameForm = document.getElementById('username-form');
        if (usernameForm) {
            usernameForm.addEventListener('submit', handleUsernameChange);
        }

        // 初始化密码表单
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', handlePasswordChange);
            // 密码强度检测
            const newPasswordInput = document.getElementById('new-password');
            if (newPasswordInput) {
                newPasswordInput.addEventListener('input', function() {
                    updatePasswordStrength(this.value);
                });
            }
        }

        // 加载当前用户名
        loadCurrentUsername();
    }

    async function loadCurrentUsername() {
        try {
            const { users } = await window.supabase.getUsers();
            if (users && users.length > 0) {
                const username = users[0].username;
                document.getElementById('current-username').textContent = username;
                document.getElementById('current-username-input').value = username;
            }
        } catch (error) {
            console.error('[Account] 加载用户名失败:', error);
        }
    }

    function updatePasswordStrength(password) {
        const strengthBar = document.getElementById('password-strength-bar');
        if (!strengthBar) return;

        let strength = 0;

        if (password.length >= 6) strength += 1;
        if (password.length >= 10) strength += 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

        strengthBar.className = 'password-strength-bar';
        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    async function handleUsernameChange(event) {
        event.preventDefault();

        const newUsername = document.getElementById('new-username').value.trim();
        const confirmUsername = document.getElementById('confirm-username').value.trim();

        // 验证输入
        if (!newUsername || newUsername.length < 3) {
            showToast('用户名至少需要3个字符', 'error');
            return;
        }

        if (newUsername !== confirmUsername) {
            showToast('两次输入的用户名不一致', 'error');
            return;
        }

        // 获取当前用户名
        const { users } = await window.supabase.getUsers();
        if (users && users.length > 0 && users[0].username === newUsername) {
            showToast('新用户名与当前用户名相同', 'error');
            return;
        }

        try {
            // 更新用户名（不需要当前密码验证，因为只有管理员自己使用）
            const result = await window.supabase.updateUser({ username: newUsername });

            if (result.error) {
                showToast(result.error.message, 'error');
                return;
            }

            showToast('用户名已成功更新！', 'success');

            // 重置表单
            document.getElementById('username-form').reset();

            // 更新显示的用户名
            loadCurrentUsername();
        } catch (error) {
            console.error('[Account] 更新用户名失败:', error);
            showToast('更新失败，请稍后重试', 'error');
        }
    }

    async function handlePasswordChange(event) {
        event.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        // 验证输入
        if (!currentPassword) {
            showToast('请输入当前密码', 'error');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            showToast('新密码至少需要6个字符', 'error');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showToast('两次输入的密码不一致', 'error');
            return;
        }

        // 验证当前密码
        const isValid = await window.supabase.verifyPassword(currentPassword);
        if (!isValid) {
            showToast('当前密码不正确', 'error');
            return;
        }

        // 不能与当前密码相同
        if (currentPassword === newPassword) {
            showToast('新密码不能与当前密码相同', 'error');
            return;
        }

        try {
            const result = await window.supabase.updateUser({
                password: currentPassword,
                new_password: newPassword
            });

            if (result.error) {
                showToast(result.error.message, 'error');
                return;
            }

            showToast('密码已成功更新！', 'success');

            // 重置表单
            document.getElementById('password-form').reset();
            updatePasswordStrength('');
        } catch (error) {
            console.error('[Account] 更新密码失败:', error);
            showToast('更新失败，请稍后重试', 'error');
        }
    }
'''

    # 在最后一个</script>标签前添加
    script_pattern = r'(</script>)'
    content = re.sub(script_pattern, account_js_functions + r'\1', content)

    write_file(file_path, content)
    print(f"✅ 已添加账户设置JS功能到 {file_path}")

def main():
    """主函数"""
    print("开始优化登录界面和添加账户设置功能...")
    print("=" * 50)

    # 文件路径
    admin_html_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\admin.html'
    supabase_js_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'

    # 1. 添加优化后的登录界面样式
    print("\n1. 添加登录界面优化样式...")
    add_login_styles(admin_html_path)

    # 2. 在supabase.js中添加账户管理方法
    print("\n2. 添加账户管理方法到 supabase.js...")
    add_account_management_to_supabase(supabase_js_path)

    # 3. 添加账户设置页面UI
    print("\n3. 添加账户设置页面UI...")
    add_account_settings_ui(admin_html_path)

    # 4. 添加账户设置JS功能
    print("\n4. 添加账户设置JS功能...")
    add_account_settings_js(admin_html_path)

    print("\n" + "=" * 50)
    print("✅ 所有优化完成！")
    print("\n更新内容：")
    print("  • 登录界面样式优化（现代化设计、动画效果）")
    print("  • 新增\"账户设置\"页面")
    print("  • 支持修改用户名")
    print("  • 支持修改密码（需要当前密码验证）")
    print("  • 密码强度指示器")
    print("\n请刷新后台管理页面查看效果。")

if __name__ == '__main__':
    main()
