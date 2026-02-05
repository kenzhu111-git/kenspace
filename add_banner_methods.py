#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在 supabase.js 中添加 Banner 相关的 CRUD 方法
"""

def add_banner_methods():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\supabase.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixes = []
    
    # 1. 添加 banners 数据初始化（在 initializeDefaults 方法中）
    old_initialize = '''    initializeDefaults() {
        this.categories = [...DEFAULT_CATEGORIES];
        this.attributes = [...DEFAULT_ATTRIBUTES];
        this.photos = this.getDefaultPhotos();
        this.about = this.getDefaultAbout();
        this.saveCategories();
        this.saveAttributes();
        this.savePhotos();
        this.saveAbout();
        this.isLoaded = true;
    }'''
    
    new_initialize = '''    initializeDefaults() {
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
    
    if old_initialize in content:
        content = content.replace(old_initialize, new_initialize)
        fixes.append("✅ initializeDefaults: 添加 banners 数据初始化")
    else:
        fixes.append("ℹ️ initializeDefaults: 格式已不同")
    
    # 2. 添加 getDefaultBanners 方法（在 getDefaultAbout 之后）
    old_default_about = '''    // 获取默认关于数据
    getDefaultAbout() {
        return {
            name: 'PHOTOGRAPHER',
            title: '我是一名专注于极简主义摄影的摄影师',
            bio: '在我的镜头下，我试图捕捉那些被忽视的美好瞬间——光影的交错、空间的静谧、以及生活中转瞬即逝的诗意。',
            avatar_url: '',
            contact: '',
            social_links: {}
        };
    }'''
    
    new_default_about = '''    // 获取默认关于数据
    getDefaultAbout() {
        return {
            name: 'PHOTOGRAPHER',
            title: '我是一名专注于极简主义摄影的摄影师',
            bio: '在我的镜头下，我试图捕捉那些被忽视的美好瞬间——光影的交错、空间的静谧、以及生活中转瞬即逝的诗意。',
            avatar_url: '',
            contact: '',
            social_links: {}
        };
    }
    
    // 获取默认 Banner 数据
    getDefaultBanners() {
        return [
            {
                id: 'banner-1',
                title: '光影之间',
                description: '捕捉生活中的每一个瞬间',
                image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
                link: '#',
                sort_order: 1
            },
            {
                id: 'banner-2',
                title: '自然之美',
                description: '探索大自然的无限魅力',
                image_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920',
                link: '#',
                sort_order: 2
            },
            {
                id: 'banner-3',
                title: '城市脉络',
                description: '记录都市的节奏与韵律',
                image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920',
                link: '#',
                sort_order: 3
            }
        ];
    }'''
    
    if old_default_about in content:
        content = content.replace(old_default_about, new_default_about)
        fixes.append("✅ getDefaultBanners: 添加默认Banner数据")
    else:
        fixes.append("ℹ️ getDefaultBanners: 格式已不同")
    
    # 3. 添加 loadBanners 方法（在 loadAbout 方法之后）
    old_load_about = '''    async loadAbout() {
        try {
            const localAbout = localStorage.getItem('about');
            if (localAbout) {
                this.about = JSON.parse(localAbout);
            } else {
                this.about = this.getDefaultAbout();
                this.saveAbout();
            }
            return { data: this.about, error: null };
        } catch (error) {
            this.about = this.getDefaultAbout();
            this.saveAbout();
            return { data: this.about, error: error.message };
        }
    }'''
    
    new_load_about = '''    async loadAbout() {
        try {
            const localAbout = localStorage.getItem('about');
            if (localAbout) {
                this.about = JSON.parse(localAbout);
            } else {
                this.about = this.getDefaultAbout();
                this.saveAbout();
            }
            return { data: this.about, error: null };
        } catch (error) {
            this.about = this.getDefaultAbout();
            this.saveAbout();
            return { data: this.about, error: error.message };
        }
    }
    
    async loadBanners() {
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
    
    if old_load_about in content:
        content = content.replace(old_load_about, new_load_about)
        fixes.append("✅ loadBanners: 添加加载Banner数据方法")
    else:
        fixes.append("ℹ️ loadBanners: 格式已不同")
    
    # 4. 添加 saveBanners 方法（在 saveAbout 方法之后）
    old_save_about = '''    async saveAbout() {
        try {
            localStorage.setItem('about', JSON.stringify(this.about));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }'''
    
    new_save_about = '''    async saveAbout() {
        try {
            localStorage.setItem('about', JSON.stringify(this.about));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async saveBanners() {
        try {
            localStorage.setItem('banners', JSON.stringify(this.banners));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }'''
    
    if old_save_about in content:
        content = content.replace(old_save_about, new_save_about)
        fixes.append("✅ saveBanners: 添加保存Banner数据方法")
    else:
        fixes.append("ℹ️ saveBanners: 格式已不同")
    
    # 5. 在 loadAll 方法中调用 loadBanners
    old_load_all = '''            await this.loadPhotos();
            await this.loadAbout();
            this.isLoaded = true;'''
    
    new_load_all = '''            await this.loadPhotos();
            await this.loadAbout();
            await this.loadBanners();
            this.isLoaded = true;'''
    
    if old_load_all in content:
        content = content.replace(old_load_all, new_load_all)
        fixes.append("✅ loadAll: 添加 loadBanners() 调用")
    else:
        fixes.append("ℹ️ loadAll: 格式已不同")
    
    # 6. 添加 Banner CRUD 方法（在 getPhoto 方法之前）
    old_get_photo = '''    async getAbout() {
        if (!this.isLoaded) await this.loadAll();
        return { data: this.about, error: null };
    }
    
    async updateAbout(updates) {
        if (!this.isLoaded) await this.loadAll();
        this.about = { ...this.about, ...updates };
        await this.saveAbout();
        return { data: [this.about], error: null };
    }
    
    async getPhoto(id) {
        if (!this.isLoaded) await this.loadAll();
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return { data: null, error: { message: '作品不存在' } };
        return { data: photo, error: null };
    }'''
    
    new_get_photo = '''    async getAbout() {
        if (!this.isLoaded) await this.loadAll();
        return { data: this.about, error: null };
    }
    
    async updateAbout(updates) {
        if (!this.isLoaded) await this.loadAll();
        this.about = { ...this.about, ...updates };
        await this.saveAbout();
        return { data: [this.about], error: null };
    }
    
    async getBanners() {
        if (!this.isLoaded) await this.loadAll();
        return { data: this.banners, error: null };
    }
    
    async addBanner(banner) {
        if (!this.isLoaded) await this.loadAll();
        const newBanner = {
            ...banner,
            id: banner.id || 'banner-' + Date.now(),
            created_at: new Date().toISOString(),
            sort_order: banner.sort_order || this.banners.length + 1
        };
        this.banners.push(newBanner);
        await this.saveBanners();
        return { data: [newBanner], error: null };
    }
    
    async updateBanner(id, updates) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) return { error: { message: 'Banner不存在' } };
        this.banners[index] = { ...this.banners[index], ...updates };
        await this.saveBanners();
        return { data: [this.banners[index]], error: null };
    }
    
    async deleteBanner(id) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) return { error: { message: 'Banner不存在' } };
        this.banners.splice(index, 1);
        await this.saveBanners();
        return { data: [{ id }], error: null };
    }
    
    async getPhoto(id) {
        if (!this.isLoaded) await this.loadAll();
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return { data: null, error: { message: '作品不存在' } };
        return { data: photo, error: null };
    }'''
    
    if old_get_photo in content:
        content = content.replace(old_get_photo, new_get_photo)
        fixes.append("✅ Banner CRUD: 添加 getBanners, addBanner, updateBanner, deleteBanner 方法")
    else:
        fixes.append("ℹ️ Banner CRUD: 格式已不同")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("🚀 supabase.js Banner 方法添加完成！")
    print("=" * 60)
    print()
    
    for fix in fixes:
        print(fix)
    
    print()
    print("📊 新增方法说明：")
    print("  getDefaultBanners()")
    print("    - 返回3个默认Banner（与首页Hero轮播对应）")
    print()
    print("  loadBanners()")
    print("    - 从 localStorage 加载 Banner 数据")
    print("    - 如果不存在，使用默认值并保存")
    print()
    print("  saveBanners()")
    print("    - 将 Banner 数据保存到 localStorage")
    print()
    print("  getBanners()")
    print("    - 返回所有 Banner 数据")
    print()
    print("  addBanner(banner)")
    print("    - 添加新的 Banner")
    print("    - 自动生成 ID 和 sort_order")
    print()
    print("  updateBanner(id, updates)")
    print("    - 更新指定 Banner")
    print()
    print("  deleteBanner(id)")
    print("    - 删除指定 Banner")
    print()
    print("💡 数据存储：")
    print("  - Banner 数据存储在 localStorage 的 'banners' 键")
    print("  - 默认包含3个Banner，对应首页Hero轮播")
    print()
    print("⚠️  部署后请测试：")
    print("  1. 访问后台管理页面")
    print("  2. 点击 Banner 管理")
    print("  3. 测试添加、编辑、删除 Banner 功能")

if __name__ == '__main__':
    add_banner_methods()
