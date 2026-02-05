/**
 * Supabase 客户端配置
 * PHOTOGRAPHER - 个人摄影网站
 */

// Supabase 配置
const SUPABASE_URL = 'https://gtgcqywkekfofdcbkaek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z2NxeXdrZWtmb2ZkY2JrYWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzU5MjksImV4cCI6MjA4NDA1MTkyOX0.TK6DBOio6-eYi_gjtb-gvxGisgqvkGqZkQ80fU7CvTI';

// 存储桶名称
const STORAGE_BUCKET = 'photos';

// 数据版本号
const DATA_VERSION = '3';

// 测试 Supabase Storage 是否可用
async function testSupabaseStorage() {
    console.log('[Supabase Storage] 测试连接...');
    try {
        const response = await fetch(
            `${SUPABASE_URL}/storage/v1/object/list/${STORAGE_BUCKET}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prefix: '', limit: 1 })
            }
        );

        if (response.ok) {
            console.log('[Supabase Storage] 连接成功');
            return true;
        } else {
            const error = await response.text();
            console.error('[Supabase Storage] 连接失败:', error);
            return false;
        }
    } catch (error) {
        console.error('[Supabase Storage] 连接错误:', error.message);
        return false;
    }
}

// 默认分类
const DEFAULT_CATEGORIES = [
    { id: 'digital', name: '数码', description: '数码相机拍摄的作品' },
    { id: 'film', name: '胶片', description: '传统胶片摄影作品' },
    { id: 'wetplate', name: '湿版', description: '湿版摄影工艺作品' },
    { id: 'carbon', name: '碳素', description: '碳素印相工艺作品' },
    { id: 'cyanotype', name: '蓝晒', description: '蓝晒摄影工艺作品' },
    { id: 'vandyke', name: '范戴克', description: '范戴克棕印相工艺作品' }
];

// 默认属性
const DEFAULT_ATTRIBUTES = [
    { id: 'size', name: '作品尺寸', description: '作品的物理尺寸', unit: 'cm' },
    { id: 'negative_size', name: '底片尺寸', description: '底片的尺寸规格', unit: '' },
    { id: 'other', name: '其他', description: '其他属性信息', unit: '' }
];

let supabaseClient = null;

// 模拟Supabase客户端
class SimpleSupabaseClient {
    constructor() {
        this.photos = [];
        this.categories = [];
        this.attributes = [];
        this.isLoaded = false;
    }

    async loadAll() {
        console.log('[loadAll] 开始加载数据');

        const savedVersion = localStorage.getItem('data_version');
        if (savedVersion !== DATA_VERSION) {
            localStorage.removeItem('photos');
            localStorage.removeItem('categories');
            localStorage.removeItem('attributes');
            localStorage.setItem('data_version', DATA_VERSION);
        }

        try {
            const localCategories = localStorage.getItem('categories');
            if (localCategories) {
                this.categories = JSON.parse(localCategories);
            } else {
                this.categories = [...DEFAULT_CATEGORIES];
                this.saveCategories();
            }

            const localAttributes = localStorage.getItem('attributes');
            if (localAttributes) {
                this.attributes = JSON.parse(localAttributes);
            } else {
                this.attributes = [...DEFAULT_ATTRIBUTES];
                this.saveAttributes();
            }

            await this.loadPhotos();
            await this.loadAbout();
            await this.loadBanners();
            await this.loadUsers();
            this.isLoaded = true;
            console.log('[loadAll] 数据加载完成');
        } catch (error) {
            this.initializeDefaults();
        }
    }

    async loadPhotos() {
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
    }

    // 获取用户列表
    async getUsers() {
        if (!this.isLoaded) await this.loadAll();
        return { users: this.users, error: null };
    }

    initializeDefaults() {
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
    }

    // 获取默认数据 - 返回空数组
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
    }
    
    // 获取默认管理员用户
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
    }

    async saveCategories() {
        try {
            localStorage.setItem('categories', JSON.stringify(this.categories));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async saveAttributes() {
        try {
            localStorage.setItem('attributes', JSON.stringify(this.attributes));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async savePhotos() {
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
    }
    
    async saveBanners() {
        try {
            localStorage.setItem('banners', JSON.stringify(this.banners));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCategories() {
        if (!this.isLoaded) await this.loadAll();
        return { data: this.categories, error: null };
    }

    async addCategory(category) {
        if (!this.isLoaded) await this.loadAll();
        const newCategory = {
            ...category,
            id: category.id || crypto.randomUUID(),
            created_at: new Date().toISOString()
        };
        this.categories.push(newCategory);
        await this.saveCategories();
        return { data: [newCategory], error: null };
    }

    async updateCategory(id, updates) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) return { error: { message: '分类不存在' } };
        this.categories[index] = { ...this.categories[index], ...updates };
        await this.saveCategories();
        return { data: [this.categories[index]], error: null };
    }

    async deleteCategory(id) {
        if (!this.isLoaded) await this.loadAll();
        const hasPhotos = this.photos.some(p => p.category === id);
        if (hasPhotos) return { error: { message: '该分类下有作品，无法删除' } };
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) return { error: { message: '分类不存在' } };
        this.categories.splice(index, 1);
        await this.saveCategories();
        return { data: [{ id }], error: null };
    }

    async getAttributes() {
        if (!this.isLoaded) await this.loadAll();
        return { data: this.attributes, error: null };
    }

    async addAttribute(attribute) {
        if (!this.isLoaded) await this.loadAll();
        const newAttribute = {
            ...attribute,
            id: attribute.id || crypto.randomUUID(),
            created_at: new Date().toISOString()
        };
        this.attributes.push(newAttribute);
        await this.saveAttributes();
        return { data: [newAttribute], error: null };
    }

    async updateAttribute(id, updates) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.attributes.findIndex(a => a.id === id);
        if (index === -1) return { error: { message: '属性不存在' } };
        this.attributes[index] = { ...this.attributes[index], ...updates };
        await this.saveAttributes();
        return { data: [this.attributes[index]], error: null };
    }

    async deleteAttribute(id) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.attributes.findIndex(a => a.id === id);
        if (index === -1) return { error: { message: '属性不存在' } };
        this.attributes.splice(index, 1);
        await this.saveAttributes();
        return { data: [{ id }], error: null };
    }

    async select(table, options = {}) {
        if (!this.isLoaded) await this.loadAll();
        let result = [...this.photos];

        if (options.filter) {
            if (options.filter.category) {
                result = result.filter(p => p.category === options.filter.category);
            }
            if (options.filter.is_active !== undefined) {
                result = result.filter(p => p.is_active === options.filter.is_active);
            }
        }

        if (options.order) {
            const field = options.order.field || 'sort_order';
            const ascending = options.order.ascending !== false;
            result.sort((a, b) => ascending ? (a[field] || 0) - (b[field] || 0) : (b[field] || 0) - (a[field] || 0));
        }

        return { data: result, error: null };
    }

    async insert(table, data) {
        if (!this.isLoaded) await this.loadAll();
        const newPhoto = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            is_active: data.is_active !== undefined ? data.is_active : true,
            sort_order: data.sort_order || this.photos.length + 1
        };
        this.photos.push(newPhoto);
        await this.savePhotos();
        return { data: [newPhoto], error: null };
    }

    async update(table, id, updates) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.photos.findIndex(p => p.id === id);
        if (index === -1) return { error: { message: '作品不存在' } };
        this.photos[index] = { ...this.photos[index], ...updates };
        await this.savePhotos();
        return { data: [this.photos[index]], error: null };
    }

    async delete(table, id) {
        if (!this.isLoaded) await this.loadAll();
        const index = this.photos.findIndex(p => p.id === id);
        if (index === -1) return { error: { message: '作品不存在' } };
        this.photos.splice(index, 1);
        await this.savePhotos();
        return { data: [{ id }], error: null };
    }

    async getAbout() {
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
        return { success: true }
    }

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
    }
    
    async getPhoto(id) {
        if (!this.isLoaded) await this.loadAll();
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return { data: null, error: { message: '作品不存在' } };
        return { data: photo, error: null };
    }
    
    // ========================================
    // 图片压缩优化工具
    // ========================================
    
    /**
     * 压缩图片文件
     * @param {File} file - 原始图片文件
     * @param {Object} options - 压缩选项
     * @param {number} options.maxWidth - 最大宽度（默认 1920）
     * @param {number} options.maxHeight - 最大高度（默认 1920）
     * @param {number} options.quality - 压缩质量 0-1（默认 0.85）
     * @param {string} options.type - 输出格式 'image/jpeg', 'image/webp', 'image/png'（默认 'image/jpeg'）
     * @returns {Promise<Blob>} - 压缩后的图片 Blob
     */
    async compressImage(file, options = {}) {
        const {
            maxWidth = 1920,
            maxHeight = 1920,
            quality = 0.85,
            type = 'image/jpeg'
        } = options;

        // 如果文件小于 200KB，不压缩
        if (file.size < 200 * 1024) {
            console.log(`[compressImage] 文件较小 (${(file.size / 1024).toFixed(1)}KB)，不压缩`);
            return file;
        }

        return new Promise((resolve, reject) => {
            console.log(`[compressImage] 开始压缩图片: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // 计算新的尺寸
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }

                    // 创建 Canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    // 白色背景（对于 JPEG/WebP）
                    if (type === 'image/jpeg' || type === 'image/webp') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, width, height);
                    }
                    
                    // 绘制缩放后的图片
                    ctx.drawImage(img, 0, 0, width, height);

                    // 压缩输出
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('图片压缩失败'));
                                return;
                            }

                            const compressRatio = (blob.size / file.size * 100).toFixed(1);
                            console.log(`[compressImage] ✅ 压缩完成: ${(blob.size / 1024).toFixed(1)}KB (${compressRatio}% of original)`);
                            resolve(blob);
                        },
                        type,
                        quality
                    );
                };
                
                img.onerror = () => reject(new Error('无法加载图片'));
                img.src = e.target.result;
};
            
            reader.onerror = () => reject(new Error('无法读取文件'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * 根据用途获取推荐的压缩参数
     * @param {string} usage - 用途: 'banner', 'photo', 'avatar', 'qrcode'
     * @returns {Object} - 压缩选项
     */
    getCompressOptions(usage) {
        const options = {
            banner: {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 0.85,
                type: 'image/jpeg'
            },
            photo: {
                maxWidth: 1600,
                maxHeight: 1600,
                quality: 0.85,
                type: 'image/jpeg'
            },
            avatar: {
                maxWidth: 400,
                maxHeight: 400,
                quality: 0.9,
                type: 'image/jpeg'
            },
            qrcode: {
                maxWidth: 600,
                maxHeight: 600,
                quality: 0.9,
                type: 'image/png'
            }
        };
        
        return options[usage] || options.photo;
    }

    /**
     * 上传并自动压缩图片
     * @param {File} file - 原始图片文件
     * @param {string} folder - 存储文件夹
     * @param {string} usage - 用途（用于选择压缩参数）
     * @returns {Promise<Object>} - 上传结果
     */
    async uploadAndCompress(file, folder = 'photos', usage = 'photo') {
        try {
            // 获取压缩参数
            const compressOptions = this.getCompressOptions(usage);
            
            // 压缩图片
            const compressedFile = await this.compressImage(file, compressOptions);
            
            // 创建新的 File 对象
            const extension = compressOptions.type.split('/')[1] || 'jpg';
            const newFileName = file.name.split('.')[0] + '_optimized.' + extension;
            const compressedBlob = new File([compressedFile], newFileName, {
                type: compressOptions.type
            });
            
            // 上传压缩后的文件
            return await this.uploadFile(compressedBlob, folder);
        } catch (error) {
            console.error(`[uploadAndCompress] ❌ 压缩上传失败:`, error);
            // 如果压缩失败，回退到原始文件上传
            console.warn('[uploadAndCompress] ⚠️ 回退到原始文件上传');
            return await this.uploadFile(file, folder);
        }
    }

    // 上传文件到 Supabase Storage
    async uploadFile(file, folder = 'banners') {
        try {
            // 检查 Supabase 配置
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                console.warn('Supabase 未配置，尝试使用本地存储');
                return this.uploadToLocal(file, folder);
            }

            // 生成唯一文件名
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop() || 'jpg';
            const fileName = `${folder}/${timestamp}-${random}.${extension}`;
            
            // 使用 Supabase Storage API
            // 注意：这需要 Storage RLS 权限配置正确
            const formData = new FormData();
            formData.append('file', file);

            // 尝试使用 fetch 上传（如果有权限）
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${fileName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: file
            });

            if (response.ok) {
                const result = await response.json();
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
                console.log('[uploadFile] 上传成功:', publicUrl);
                return { data: { path: publicUrl, name: fileName }, error: null };
            } else {
                // 如果上传失败，尝试本地存储
                console.warn('[uploadFile] Supabase Storage 上传失败，使用本地存储');
                return this.uploadToLocal(file, folder);
            }
        } catch (error) {
            console.warn('[uploadFile] 上传出错，使用本地存储:', error.message);
            return this.uploadToLocal(file, folder);
        }
    }

    // 上传到本地存储（作为备选方案）
    uploadToLocal(file, folder) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const dataUrl = e.target.result;
                console.log('[uploadToLocal] 文件已转换为 Base64');
                resolve({ data: { path: dataUrl, name: file.name }, error: null });
            };
            reader.onerror = function(error) {
                resolve({ data: null, error: { message: '文件读取失败' } });
            };
            reader.readAsDataURL(file);
        });
    }

    // 上传 Banner 图片
    async uploadBanner(file) {
        return this.uploadFile(file, 'banners');
    }

    // 上传作品图片
    async uploadPhoto(file) {
        return this.uploadFile(file, 'photos');
    }

    // 上传头像
    async uploadAvatar(file) {
        return this.uploadFile(file, 'avatars');
    }

    // 上传二维码
    async uploadQRCode(file, platform) {
        return this.uploadFile(file, `qrcodes/${platform}`);
    }
}

async function initSupabase() {
    if (window.supabase && window.supabase.isLoaded) {
        return window.supabase;
    }

    supabaseClient = new SimpleSupabaseClient();
    await supabaseClient.loadAll();
    window.supabase = supabaseClient;
    console.log('[initSupabase] Supabase 客户端初始化完成');
    return supabaseClient;
}

window.initSupabase = initSupabase;
