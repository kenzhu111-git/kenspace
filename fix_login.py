#!/usr/bin/env python3

# 修复登录和验证函数

file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\admin.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修复 doLogin 函数
old1 = '''        async function doLogin(username, password) {
            console.log('[Auth] 尝试登录:', username);
            
            const { error, data} = await window.supabase.login(username, password);
            
            if (error) {
                console.error('[Auth] 登录失败:', error.message);
                return { success: false, error: error.message };
            }
            
            console.log('[Auth] 登录成功:', data.username);
            return { success: true, data };
        }'''

new1 = '''        async function doLogin(username, password) {
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

if old1 in content:
    content = content.replace(old1, new1)
    print("✅ 已修复 doLogin 函数")
else:
    print("⚠️ 未找到 doLogin 函数")

# 2. 修复 checkAuth 函数，添加配置检测
old2 = '''        async function checkAuth() {
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

new2 = '''        async function checkAuth() {
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
                // 检查是否有自定义配置，如果有则允许访问
                const userConfig = localStorage.getItem('admin_user_config');
                if (userConfig) {
                    console.log('[Auth] 检测到自定义配置，允许访问');
                    const config = JSON.parse(userConfig);
                    return { authenticated: true, session: { username: config.username } };
                }
                return { authenticated: false, session: null };
            }
        }'''

if old2 in content:
    content = content.replace(old2, new2)
    print("✅ 已修复 checkAuth 函数")
else:
    print("⚠️ 未找到 checkAuth 函数")

# 写入文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\\n✅ 登录函数修复完成！")
