#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在 supabase.js 中添加用户认证功能
"""

def add_auth_system():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\supabase.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 在 initializeDefaults 方法中添加默认管理员用户
    old_initialize = '''    initializeDefaults() {
        this.categories = [...DEFAULT_CATEGORIES];
        this.attributes = [...DEFAULT_ATTRIBUTES];
        this.photos = this.getDefaultPhotos();
        this.about = this.getDefaultAbout();
        this.banners = this.getDefaultBanners();
        this.saveCategories();
        this.saveAttributes();
        this.savePhotos();
        this.saveAbout();
        this.saveBanners();
        this.isLoaded = true;
    }'''

    new_initialize = '''    initializeDefaults() {
        this.categories = [...DEFAULT_CATEGORIES];
        this.attributes = [...DEFAULT_ATTRIBUTES];
        this.photos = this.getDefaultPhotos();
        this.about = this.getDefaultAbout();
        this.banners = this.getDefaultBanners();
        this.users = this.getDefaultUsers();
        this.saveCategories();
        this.saveAttributes();
        this.savePhotos();
        this.saveAbout();
        this.saveBanners();
        this.saveUsers();
        this.isLoaded = true;
    }'''

    if old_initialize in content:
        content = content.replace(old_initialize, new_initialize)
        print("✅ initializeDefaults: 添加 users 数据初始化")
    
    # 添加 getDefaultUsers 方法
    old_get_default_banners = '''    // 获取默认 Banner 数据
    getDefaultBanners() {'''

    new_get_default_banners = '''    // 获取默认管理员用户
    getDefaultUsers() {
        // 默认管理员账号（密码为 admin123）
        // 实际使用时建议修改密码
        return [
            {
                id: 'admin-1',
                username: 'admin',
                password_hash: this.hashPassword('admin123'),
                role: 'admin',
                created_at: new Date().toISOString()
            }
        ];
    }

    // 简单的密码哈希函数（实际项目中建议使用更安全的方式）
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    // 获取默认 Banner 数据
    getDefaultBanners() {'''

    if old_get_default_banners in content:
        content = content.replace(old_get_default_banners, new_get_default_banners)
        print("✅ getDefaultUsers: 添加默认管理员账号")
    
    # 在 loadAll 中添加 loadUsers 调用
    old_load_all = '''            await this.loadPhotos();
            await this.loadAbout();
            await this.loadBanners();
            this.isLoaded = true;'''

    new_load_all = '''            await this.loadPhotos();
            await this.loadAbout();
            await this.loadBanners();
            await this.loadUsers();
            this.isLoaded = true;'''

    if old_load_all in content:
        content = content.replace(old_load_all, new_load_all)
        print("✅ loadAll: 添加 loadUsers() 调用")
    
    # 添加 loadUsers 方法
    old_load_banners = '''    async loadBanners() {
        try {
            const localBanners = localStorage.getItem('banners');
            if (localBanners) {
                this.banners = JSON.parse(localBanners);
            } else {
                this.banners = this.getDefaultBanners();
                this.saveBanners();
            }
            return { data: this.banners, count: this.banners.length };
        } catch (error) {
            this.banners = this.getDefaultBanners();
            this.saveBanners();
            return { data: this.banners, count: this.banners.length, error: error.message };
        }
    }'''

    new_load_banners = '''    async loadBanners() {
        try {
            const localBanners = localStorage.getItem('banners');
            if (localBanners) {
                this.banners = JSON.parse(localBanners);
            } else {
                this.banners = this.getDefaultBanners();
                this.saveBanners();
            }
            return { data: this.banners, count: this.banners.length };
        } catch (error) {
            this.banners = this.getDefaultBanners();
            this.saveBanners();
            return { data: this.banners, count: this.banners.length, error: error.message };
        }
    }
    
    async loadUsers() {
        try {
            const localUsers = localStorage.getItem('users');
            if (localUsers) {
                this.users = JSON.parse(localUsers);
            } else {
                this.users = this.getDefaultUsers();
                this.saveUsers();
            }
            return { data: this.users, count: this.users.length };
        } catch (error) {
            this.users = this.getDefaultUsers();
            this.saveUsers();
            return { data: this.users, count: this.users.length, error: error.message };
        }
    }
    
    async saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }'''

    if old_load_banners in content:
        content = content.replace(old_load_banners, new_load_banners)
        print("✅ loadUsers/saveUsers: 添加用户数据操作方法")
    
    # 添加用户认证方法（在 deleteBanner 方法之后）
    old_delete_banner = '''    async deleteBanner(id) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) return { error: { message: 'Banner不存在' } };
        this.banners.splice(index, 1);
        await this.saveBanners();
        return { data: [{ id }], error: null };
    }'''

    new_delete_banner = '''    async deleteBanner(id) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) return { error: { message: 'Banner不存在' } };
        this.banners.splice(index, 1);
        await this.saveBanners();
        return { data: [{ id }], error: null };
    }

    // ============ 用户认证 ============
    
    async login(username, password) {
        if (!this.isLoaded) await this.loadAll();
        
        const user = this.users.find(u => u.username === username);
        if (!user) {
            return { error: { message: '用户名不存在' }, data: null };
        }
        
        const passwordHash = this.hashPassword(password);
        if (user.password_hash !== passwordHash) {
            return { error: { message: '密码错误' }, data: null };
        }
        
        // 登录成功，生成 session
        const session = {
            user_id: user.id,
            username: user.username,
            role: user.role,
            token: this.generateToken(),
            expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
        };
        
        // 保存 session
        localStorage.setItem('admin_session', JSON.stringify(session));
        
        console.log('[auth] 用户登录成功:', username);
        return { error: null, data: session };
    }
    
    async logout() {
        localStorage.removeItem('admin_session');
        console.log('[auth] 用户已退出');
        return { success: true };
    }
    
    async checkSession() {
        const sessionStr = localStorage.getItem('admin_session');
        if (!sessionStr) {
            return { authenticated: false, session: null };
        }
        
        try {
            const session = JSON.parse(sessionStr);
            
            // 检查是否过期
            if (Date.now() > session.expires_at) {
                this.logout();
                return { authenticated: false, session: null };
            }
            
            return { authenticated: true, session };
        } catch (error) {
            return { authenticated: false, session: null };
        }
    }
    
    generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }'''

    if old_delete_banner in content:
        content = content.replace(old_delete_banner, new_delete_banner)
        print("✅ auth: 添加用户认证方法")
    
    # 保存文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print()
    print("=" * 60)
    print("✅ 用户认证系统添加完成！")
    print("=" * 60)
    print()
    print("📝 新增功能：")
    print()
    print("  1. 用户数据存储")
    print("     - users 表存储管理员账号")
    print("     - 默认账号: admin / admin123")
    print()
    print("  2. 认证方法")
    print("     - login(username, password)")
    print("     - logout()")
    print("     - checkSession()")
    print()
    print("  3. Session 管理")
    print("     - Session 存储在 localStorage")
    print("     - 有效期 7 天")
    print("     - 自动过期清理")
    print()
    print("  4. 密码安全")
    print("     - 简单哈希（生产环境建议使用更安全的方式）")
    print("     - 实际使用时建议修改默认密码")
    print()
    print("⚠️  重要提示：")
    print("  - 默认账号: admin")
    print("  - 默认密码: admin123")
    print("  - 建议首次登录后立即修改密码！")
    print()
    print("💡 后续步骤：")
    print("  1. 修改 admin.html 添加登录界面")
    print("  2. 实现未登录时重定向到登录页")
    print("  3. 添加登出功能")

if __name__ == '__main__':
    add_auth_system()
