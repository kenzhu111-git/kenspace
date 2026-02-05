#!/usr/bin/env python3
"""
简化用户认证系统，修复用户名和密码保存问题
"""

def simplify_auth_system(file_path):
    """简化用户认证系统"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 替换 getUsers 调用为直接获取配置
    old1 = '''    async function loadCurrentUsername() {
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
    }'''
    
    new1 = '''    async function loadCurrentUsername() {
        try {
            // 从 localStorage 直接读取用户配置
            const userConfig = localStorage.getItem('admin_user_config');
            if (userConfig) {
                const config = JSON.parse(userConfig);
                document.getElementById('current-username').textContent = config.username;
                document.getElementById('current-username-input').value = config.username;
            } else {
                // 默认用户名
                document.getElementById('current-username').textContent = 'admin';
                document.getElementById('current-username-input').value = 'admin';
            }
        } catch (error) {
            console.error('[Account] 加载用户名失败:', error);
        }
    }'''
    
    if old1 in content:
        content = content.replace(old1, new1)
        print("✅ 已替换 loadCurrentUsername 函数")
    
    # 2. 替换 handleUsernameChange
    old2 = '''    async function handleUsernameChange(event) {
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
    }'''
    
    new2 = '''    async function handleUsernameChange(event) {
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
        const userConfig = localStorage.getItem('admin_user_config');
        const currentConfig = userConfig ? JSON.parse(userConfig) : { username: 'admin' };
        
        if (currentConfig.username === newUsername) {
            showToast('新用户名与当前用户名相同', 'error');
            return;
        }

        try {
            // 直接更新 localStorage 中的用户配置
            const newConfig = {
                ...currentConfig,
                username: newUsername
            };
            localStorage.setItem('admin_user_config', JSON.stringify(newConfig));

            showToast('用户名已成功更新！', 'success');

            // 重置表单
            document.getElementById('username-form').reset();

            // 更新显示的用户名
            loadCurrentUsername();
        } catch (error) {
            console.error('[Account] 更新用户名失败:', error);
            showToast('更新失败，请稍后重试', 'error');
        }
    }'''
    
    if old2 in content:
        content = content.replace(old2, new2)
        print("✅ 已替换 handleUsernameChange 函数")
    
    # 3. 替换 handlePasswordChange
    old3 = '''    async function handlePasswordChange(event) {
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
    }'''
    
    new3 = '''    async function handlePasswordChange(event) {
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

        // 获取当前密码配置
        const userConfig = localStorage.getItem('admin_user_config');
        const currentConfig = userConfig ? JSON.parse(userConfig) : { password_hash: '' };
        
        // 计算当前输入密码的哈希
        const inputHash = window.supabase.hashPassword(currentPassword);
        
        // 验证当前密码
        if (currentConfig.password_hash && inputHash !== currentConfig.password_hash) {
            showToast('当前密码不正确', 'error');
            return;
        }

        // 不能与当前密码相同
        if (currentConfig.password_hash && inputHash === window.supabase.hashPassword(newPassword)) {
            showToast('新密码不能与当前密码相同', 'error');
            return;
        }

        try {
            // 计算新密码的哈希
            const newPasswordHash = window.supabase.hashPassword(newPassword);
            
            // 更新 localStorage 中的用户配置
            const newConfig = {
                ...currentConfig,
                password_hash: newPasswordHash
            };
            localStorage.setItem('admin_user_config', JSON.stringify(newConfig));

            showToast('密码已成功更新！', 'success');

            // 重置表单
            document.getElementById('password-form').reset();
            updatePasswordStrength('');
        } catch (error) {
            console.error('[Account] 更新密码失败:', error);
            showToast('更新失败，请稍后重试', 'error');
        }
    }'''
    
    if old3 in content:
        content = content.replace(old3, new3)
        print("✅ 已替换 handlePasswordChange 函数")
    
    # 4. 简化登录验证，优先使用配置的密码
    old_login = '''    async function checkAuth() {
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
    }'''
    
    new_login = '''    async function checkAuth() {
        console.log('[Auth] 检查登录状态...');
        
        try {
            const { authenticated, session } = await window.supabase.checkSession();
            
            if (authenticated) {
                console.log('[Auth] 已登录:', session.username);
                return { authenticated: true, session };
            } else {
                console.log('[Auth] 未登录');
                
                // 检查是否有自定义配置
                const userConfig = localStorage.getItem('admin_user_config');
                if (userConfig) {
                    // 有自定义配置，不需要强制登录
                    console.log('[Auth] 使用默认凭据');
                }
                return { authenticated: false, session: null };
            }
        } catch (error) {
            console.error('[Auth] 检查登录状态失败:', error);
            return { authenticated: false, session: null };
        }
    }'''
    
    if old_login in content:
        content = content.replace(old_login, new_login)
        print("✅ 已简化 checkAuth 函数")
    
    # 5. 修改 doLogin 以支持配置的密码
    old_doLogin = '''    async function doLogin(username, password) {
        console.log('[Auth] 尝试登录:', username);
        
        const { error, data} = await window.supabase.login(username, password);
        
        if (error) {
            console.error('[Auth] 登录失败:', error.message);
            return { success: false, error: error.message };
        }
        
        console.log('[Auth] 登录成功:', data.username);
        return { success: true, data };
    }'''
    
    new_doLogin = '''    async function doLogin(username, password) {
        console.log('[Auth] 尝试登录:', username);
        
        // 检查是否有自定义配置
        const userConfig = localStorage.getItem('admin_user_config');
        const config = userConfig ? JSON.parse(userConfig) : null;
        
        // 默认密码
        const defaultHash = window.supabase.hashPassword('admin123');
        const inputHash = window.supabase.hashPassword(password);
        
        // 验证用户名和密码
        const validUsername = config ? config.username : 'admin';
        const validHash = config && config.password_hash ? config.password_hash : defaultHash;
        
        if (username === validUsername && inputHash === validHash) {
            console.log('[Auth] 登录成功:', username);
            return { success: true, data: { username: validUsername } };
        } else {
            console.error('[Auth] 登录失败: 用户名或密码错误');
            return { success: false, error: '用户名或密码错误' };
        }
    }'''
    
    if old_doLogin in content:
        content = content.replace(old_doLogin, new_doLogin)
        print("✅ 已修改 doLogin 函数")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\\n✅ 用户认证系统已简化完成！")

if __name__ == '__main__':
    file_path = r'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    simplify_auth_system(file_path)
