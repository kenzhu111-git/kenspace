#!/usr/bin/env python3
"""
修改硬编码的登录凭据并移除账户设置功能
"""

def update_credentials(file_path):
    """更新默认用户名和密码"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 更新默认用户
    old_user = '''return [
            {
                id: 'admin-1',
                username: 'admin',
                password_hash: this.hashPassword('admin123'),
                role: 'admin',
                created_at: new Date().toISOString()
            }
        ];'''
    
    new_user = '''// 硬编码管理员账户
        return [
            {
                id: 'admin-1',
                username: 'happyyuge',
                password_hash: this.hashPassword('kenspace10000'),
                role: 'admin',
                created_at: new Date().toISOString()
            }
        ];'''
    
    if old_user in content:
        content = content.replace(old_user, new_user)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已更新凭据: happyyuge / kenspace10000")
        return True
    else:
        print("❌ 未找到默认用户配置")
        return False

def remove_account_settings(admin_path):
    """从admin.html移除账户设置相关代码"""
    with open(admin_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. 移除侧边栏中的账户设置导航项
    content = content.replace('''<div class="nav-item" data-page="account">
                    <span class="nav-icon">👤</span>
                    <span>账户设置</span>
                </div>
                <div class="nav-item" data-page="settings">''', 
    '''<div class="nav-item" data-page="settings">''')
    
    # 2. 移除整个账户设置页面
    account_page_pattern = r'<!-- Account Settings Page -->.*?<section id="page-settings" class="admin-page">'
    content = re.sub(account_page_pattern, '<!-- Account Settings Page -->\n    <!-- 已移除 -->\n\n    <section id="page-settings" class="admin-page">', content, flags=re.DOTALL)
    
    # 3. 移除账户设置JS函数
    js_patterns = [
        r'// ============ 账户设置 ============\s*.*?initAccountSettings\(\);\s*\}',
        r'function initAccountSettings\(\)\s*\{.*?console\.log\(.Account. .初始化账户设置.\.\.\.\.\);\.*?loadCurrentUsername\(\);\s*\}',
        r'function loadCurrentUsername\(\).*?console\.error\(.\[Account\] 加载用户名失败:., error\);\.*?\}',
        r'function updatePasswordStrength\(password\)\s*\{.*?\}',
        r'async function handleUsernameChange\(event\)\s*\{.*?\}',
        r'async function handlePasswordChange\(event\)\s*\{.*?\}'
    ]
    
    for pattern in js_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # 4. 移除账户设置相关的CSS样式
    css_patterns = [
        r'/\* Account Settings Modal Styles \*/.*?\.password-hint \{.*?\}',
        r'\.account-modal.*?\}',
        r'\.account-tabs.*?\}',
        r'\.account-tab.*?\}',
        r'\.tab-content\s*\{.*?display: none;.*?\}',
        r'\.current-info.*?\.current-info \.value \{.*?font-size: 15px;.*?font-weight: 500;.*?color: #1a1a1a;.*?\}',
        r'\.password-strength.*?\.password-strength-bar\.strong \{.*?background: #4caf50;.*?\}'
    ]
    
    for pattern in css_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    if content != original_content:
        with open(admin_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ 已移除账户设置功能")
        return True
    else:
        print("⚠️ 未找到需要移除的账户设置代码")
        return False

import re

def main():
    print("=" * 60)
    print("修改硬编码凭据并移除账户设置功能")
    print("=" * 60)
    
    supabase_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'
    admin_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\admin.html'
    
    # 1. 更新凭据
    print("\n1. 更新默认凭据...")
    if update_credentials(supabase_path):
        print("   用户名: happyyuge")
        print("   密码: kenspace10000")
    
    # 2. 移除账户设置
    print("\n2. 移除账户设置功能...")
    if remove_account_settings(admin_path):
        print("   - 移除侧边栏导航项")
        print("   - 移除账户设置页面")
        print("   - 移除相关JS函数")
        print("   - 移除相关CSS样式")
    
    print("\n" + "=" * 60)
    print("✅ 修改完成！")
    print("\n新的登录凭据:")
    print("   用户名: happyyuge")
    print("   密码: kenspace10000")
    print("\n请刷新页面测试登录")

if __name__ == '__main__':
    main()
