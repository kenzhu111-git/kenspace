#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在 supabase.js 中添加 about 相关方法
getAbout() 和 updateAbout()
"""

def add_about_methods():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\supabase.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 添加 about 数据的初始化（在 initializeDefaults 方法中）
    old_initialize = '''    initializeDefaults() {
        this.categories = [...DEFAULT_CATEGORIES];
        this.attributes = [...DEFAULT_ATTRIBUTES];
        this.photos = this.getDefaultPhotos();
        this.saveCategories();
        this.saveAttributes();
        this.savePhotos();
        this.isLoaded = true;
    }'''
    
    new_initialize = '''    initializeDefaults() {
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
    
    # 2. 添加 getDefaultAbout 方法
    old_getDefault = '''    // 获取默认数据 - 返回空数组
    getDefaultPhotos() {
        return [];
    }'''
    
    new_getDefault = '''    // 获取默认数据 - 返回空数组
    getDefaultPhotos() {
        return [];
    }
    
    // 获取默认关于数据
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
    
    # 3. 添加 saveAbout 方法
    old_savePhotos = '''    async savePhotos() {
        try {
            localStorage.setItem('photos', JSON.stringify(this.photos));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }'''
    
    new_savePhotos = '''    async savePhotos() {
        try {
            localStorage.setItem('photos', JSON.stringify(this.photos));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async saveAbout() {
        try {
            localStorage.setItem('about', JSON.stringify(this.about));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }'''
    
    # 4. 添加 loadAbout 方法（在 loadAll 方法中）
    old_loadPhotos = '''            await this.loadPhotos();
            this.isLoaded = true;'''
    
    new_loadPhotos = '''            await this.loadPhotos();
            await this.loadAbout();
            this.isLoaded = true;'''
    
    # 5. 添加 loadAbout 方法
    old_loadPhotosMethod = '''    async loadPhotos() {
        try {
            const localPhotos = localStorage.getItem('photos');
            if (localPhotos) {
this.photos = JSON.parse(localPhotos);
            } else {
                this.photos = this.getDefaultPhotos();
                this.savePhotos();
            }
            return { data: this.photos, count: this.photos.length };
        } catch (error) {
            this.photos = this.getDefaultPhotos();
            this.savePhotos();
            return { data: this.photos, count: this.photos.length, error: error.message };
        }
    }'''
    
    new_loadPhotosMethod = '''    async loadPhotos() {
        try {
            const localPhotos = localStorage.getItem('photos');
            if (localPhotos) {
this.photos = JSON.parse(localPhotos);
            } else {
                this.photos = this.getDefaultPhotos();
                this.savePhotos();
            }
            return { data: this.photos, count: this.photos.length };
        } catch (error) {
            this.photos = this.getDefaultPhotos();
            this.savePhotos();
            return { data: this.photos, count: this.photos.length, error: error.message };
        }
    }
    
    async loadAbout() {
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
    
    # 6. 添加 getAbout 和 updateAbout 方法（在 getPhoto 方法之前）
    old_getPhoto = '''    async getPhoto(id) {
        if (!this.isLoaded) await this.loadAll();
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return { data: null, error: { message: '作品不存在' } };
        return { data: photo, error: null };
    }'''
    
    new_getPhoto = '''    async getAbout() {
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
    
    fixes = []
    
    # 执行替换
    if old_initialize in content:
        content = content.replace(old_initialize, new_initialize)
        fixes.append("✅ initializeDefaults: 添加 about 数据初始化")
    else:
        fixes.append("ℹ️ initializeDefaults: 格式已不同")
    
    if old_getDefault in content:
        content = content.replace(old_getDefault, new_getDefault)
        fixes.append("✅ getDefaultAbout: 添加默认关于数据")
    else:
        fixes.append("ℹ️ getDefaultAbout: 格式已不同")
    
    if old_savePhotos in content:
        content = content.replace(old_savePhotos, new_savePhotos)
        fixes.append("✅ saveAbout: 添加保存关于数据方法")
    else:
        fixes.append("ℹ️ saveAbout: 格式已不同")
    
    if old_loadPhotos in content:
        content = content.replace(old_loadPhotos, new_loadPhotos)
        fixes.append("✅ loadAll: 添加 loadAbout() 调用")
    else:
        fixes.append("ℹ️ loadAll: 格式已不同")
    
    if old_loadPhotosMethod in content:
        content = content.replace(old_loadPhotosMethod, new_loadPhotosMethod)
        fixes.append("✅ loadAbout: 添加加载关于数据方法")
    else:
        fixes.append("ℹ️ loadAbout: 格式已不同")
    
    if old_getPhoto in content:
        content = content.replace(old_getPhoto, new_getPhoto)
        fixes.append("✅ getAbout/updateAbout: 添加关于数据操作方法")
    else:
        fixes.append("ℹ️ getAbout/updateAbout: 格式已不同")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("🚀 supabase.js about 方法添加完成！")
    print("=" * 60)
    print()
    
    for fix in fixes:
        print(fix)
    
    print()
    print("📊 新增方法说明：")
    print("  getDefaultAbout()")
    print("    - 返回默认的关于信息数据结构")
    print("    - 包含 name, title, bio, avatar_url, contact, social_links")
    print()
    print("  loadAbout()")
    print("    - 从 localStorage 加载关于数据")
    print("    - 如果不存在，使用默认值并保存")
    print()
    print("  saveAbout()")
    print("    - 将关于数据保存到 localStorage")
    print()
    print("  getAbout()")
    print("    - 返回当前关于数据")
    print("    - 自动调用 loadAll() 确保数据已加载")
    print()
    print("  updateAbout(updates)")
    print("    - 更新关于数据")
    print("    - 自动保存到 localStorage")
    print()
    print("💡 数据存储：")
    print("  - 关于数据存储在 localStorage 的 'about' 键")
    print("  - 与 photos、categories、attributes 分开存储")
    print()
    print("⚠️  部署后请测试：")
    print("  1. 访问首页，检查关于信息是否加载")
    print("  2. 访问后台管理，检查关于编辑功能")
    print("  3. 修改关于信息后刷新页面，验证保存成功")

if __name__ == '__main__':
    add_about_methods()
