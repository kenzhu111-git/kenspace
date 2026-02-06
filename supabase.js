/**
 * Supabase 客户端配置
 * PHOTOGRAPHER - 个人摄影网站
 * 
 * 修复：将照片数据存储到 Supabase 数据库（而非 localStorage）
 * 解决本地和线上数据不同步的问题
 */

// Supabase 配置
const SUPABASE_URL = 'https://gtgcqywkekfofdcbkaek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z2NxeXdrZWtmb2ZkY2JrYWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzU5MjksImV4cCI6MjA4NDA1MTkyOX0.TK6DBOio6-eYi_gjtb-gvxGisgqvkGqZkQ80fU7CvTI';

// 存储桶名称
const STORAGE_BUCKET = 'photos';

// 数据版本号
const DATA_VERSION = '4';

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

// ==================== 数据库操作函数 ====================

/**
 * 通用数据库查询函数
 */
async function dbQuery(table, method = 'GET', body = null, id = null) {
    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    if (id) {
        url += `?id=eq.${id}`;
    }
    
    const headers = {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    };
    
    if (method === 'GET') {
        headers['Range'] = '0-999'; // 获取所有记录
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.text();
            console.error(`[DB] ${method} ${table} 失败:`, error);
            return { data: null, error: { message: error } };
        }
        
        // 获取返回数据
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return { data, error: null };
        }
        return { data: null, error: null };
    } catch (error) {
        console.error(`[DB] ${method} ${table} 异常:`, error);
        return { data: null, error };
    }
}

/**
 * 照片数据库操作
 */
const PhotoDB = {
    async getAll() {
        console.log('[PhotoDB] 从数据库获取所有照片...');
        const result = await dbQuery('photos', 'GET');
        if (result.error) {
            console.error('[PhotoDB] 获取失败:', result.error);
            return { data: [], error: result.error };
        }
        console.log('[PhotoDB] 获取到照片数量:', result.data?.length || 0);
        return { data: result.data || [], error: null };
    },
    
    async insert(photoData) {
        console.log('[PhotoDB] 保存照片到数据库:', photoData.title);
        const photo = {
            ...photoData,
            id: photoData.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            is_active: photoData.is_active !== undefined ? photoData.is_active : true
        };
        
        const result = await dbQuery('photos', 'POST', photo);
        if (result.error) {
            console.error('[PhotoDB] 保存失败:', result.error);
            return { error: result.error };
        }
        console.log('[PhotoDB] 保存成功:', photo.id);
        return { error: null };
    },
    
    async update(id, updates) {
        console.log('[PhotoDB] 更新照片:', id);
        const result = await dbQuery('photos', 'PATCH', updates, id);
        if (result.error) {
            console.error('[PhotoDB] 更新失败:', result.error);
            return { error: result.error };
        }
        return { error: null };
    },
    
    async delete(id) {
        console.log('[PhotoDB] 删除照片:', id);
        const result = await dbQuery('photos', 'DELETE', null, id);
        if (result.error) {
            console.error('[PhotoDB] 删除失败:', result.error);
            return { error: result.error };
        }
        return { error: null };
    }
};

// ==================== Supabase 客户端类 ====================

class SimpleSupabaseClient {
    constructor() {
        this.photos = [];
        this.categories = [];
        this.attributes = [];
        this.isLoaded = false;
    }

    async loadAll() {
        console.log('[loadAll] 开始加载数据...');
        
        // 从数据库加载照片（而不是 localStorage）
        const photosResult = await PhotoDB.getAll();
        this.photos = photosResult.data || [];
        
        // 分类和属性仍然使用 localStorage（这些不跨域同步）
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

        // 加载其他数据
        await this.loadAbout();
        await this.loadBanners();
        
        this.isLoaded = true;
        console.log('[loadAll] 数据加载完成，照片数量:', this.photos.length);
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

    // ==================== 照片 CRUD 操作 ====================
    
    async select(table, options = {}) {
        if (!this.isLoaded) await this.loadAll();
        
        if (table === 'photos') {
            let result = [...this.photos];
            
            // 应用过滤
            if (options.filters) {
                for (const [field, value] of Object.entries(options.filters)) {
                    if (value) {
                        result = result.filter(p => p[field] === value);
                    }
                }
            }
            
            // 应用排序
            if (options.order) {
                const { field, ascending = true } = options.order;
                result.sort((a, b) => {
                    const aVal = a[field] || 0;
                    const bVal = b[field] || 0;
                    return ascending ? (aVal - bVal) : (bVal - aVal);
                });
            }
            
            return { data: result, error: null };
        }
        
        return { data: null, error: { message: '不支持的表: ' + table } };
    }

    async insert(table, data) {
        if (!this.isLoaded) await this.loadAll();
        
        if (table === 'photos') {
            // 保存到数据库
            const dbResult = await PhotoDB.insert(data);
            if (dbResult.error) {
                return { error: dbResult.error };
            }
            
            // 添加到本地缓存
            const newPhoto = {
                ...data,
                id: data.id || crypto.randomUUID(),
                created_at: new Date().toISOString(),
                is_active: data.is_active !== undefined ? data.is_active : true,
                sort_order: data.sort_order || this.photos.length + 1
            };
            this.photos.push(newPhoto);
            
            return { data: [newPhoto], error: null };
        }
        
        return { error: { message: '不支持的表: ' + table } };
    }

    async update(table, id, updates) {
        if (!this.isLoaded) await this.loadAll();
        
        if (table === 'photos') {
            // 更新数据库
            const dbResult = await PhotoDB.update(id, updates);
            if (dbResult.error) {
                return { error: dbResult.error };
            }
            
            // 更新本地缓存
            const index = this.photos.findIndex(p => p.id === id);
            if (index !== -1) {
                this.photos[index] = { ...this.photos[index], ...updates };
            }
            
            return { data: [this.photos[index]], error: null };
        }
        
        return { error: { message: '不支持的表: ' + table } };
    }

    async delete(table, id) {
        if (!this.isLoaded) await this.loadAll();
        
        if (table === 'photos') {
            // 从数据库删除
            const dbResult = await PhotoDB.delete(id);
            if (dbResult.error) {
                return { error: dbResult.error };
            }
            
            // 从本地缓存删除
            const index = this.photos.findIndex(p => p.id === id);
            if (index !== -1) {
                this.photos.splice(index, 1);
            }
            
            return { data: [{ id }], error: null };
        }
        
        return { error: { message: '不支持的表: ' + table } };
    }

    async getPhoto(id) {
        if (!this.isLoaded) await this.loadAll();
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return { data: null, error: { message: '作品不存在' } };
        return { data: photo, error: null };
    }

    // ==================== 其他数据操作（保持 localStorage） ====================

    async getCategories() {
        if (!this.isLoaded) await this.loadAll();
        return { data: this.categories, error: null };
    }

    async addCategory(category) {
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
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) return { error: { message: '分类不存在' } };
        this.categories[index] = { ...this.categories[index], ...updates };
        await this.saveCategories();
        return { data: [this.categories[index]], error: null };
    }

    async deleteCategory(id) {
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
        const newAttr = {
            ...attribute,
            id: attribute.id || crypto.randomUUID(),
            created_at: new Date().toISOString()
        };
        this.attributes.push(newAttr);
        await this.saveAttributes();
        return { data: [newAttr], error: null };
    }

    async updateAttribute(id, updates) {
        const index = this.attributes.findIndex(a => a.id === id);
        if (index === -1) return { error: { message: '属性不存在' } };
        this.attributes[index] = { ...this.attributes[index], ...updates };
        await this.saveAttributes();
        return { data: [this.attributes[index]], error: null };
    }

    async deleteAttribute(id) {
        const index = this.attributes.findIndex(a => a.id === id);
        if (index === -1) return { error: { message: '属性不存在' } };
        this.attributes.splice(index, 1);
        await this.saveAttributes();
        return { data: [{ id }], error: null };
    }

    // ==================== 关于和 Banner 数据（保持 localStorage） ====================

    async loadAbout() {
        try {
            const localAbout = localStorage.getItem('about');
            if (localAbout) {
                this.about = JSON.parse(localAbout);
            } else {
                this.about = this.getDefaultAbout();
                this.saveAbout();
            }
        } catch (error) {
            this.about = this.getDefaultAbout();
            this.saveAbout();
        }
    }

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

    async saveAbout() {
        try {
            localStorage.setItem('about', JSON.stringify(this.about));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
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

    async loadBanners() {
        try {
            const localBanners = localStorage.getItem('banners');
            if (localBanners) {
                this.banners = JSON.parse(localBanners);
            } else {
                this.banners = this.getDefaultBanners();
                this.saveBanners();
            }
        } catch (error) {
            this.banners = this.getDefaultBanners();
            this.saveBanners();
        }
    }

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

    async saveBanners() {
try {
            localStorage.setItem('banners', JSON.stringify(this.banners));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
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

    // ==================== 文件上传（保持不变） ====================

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
            const response = await fetch(
                `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${fileName}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                    body: file
                }
            );

            if (response.ok) {
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
                console.log('[uploadFile] 上传成功:', publicUrl);
                return { data: { path: publicUrl, name: fileName }, error: null };
            } else {
                console.warn('[uploadFile] Supabase Storage 上传失败，使用本地存储');
                return this.uploadToLocal(file, folder);
            }
        } catch (error) {
            console.warn('[uploadFile] 上传出错，使用本地存储:', error.message);
            return this.uploadToLocal(file, folder);
        }
    }

    uploadToLocal(file, folder) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const dataUrl = e.target.result;
                resolve({ data: { path: dataUrl, name: file.name }, error: null });
            };
            reader.onerror = function(error) {
                resolve({ data: null, error: { message: '文件读取失败' } });
            };
            reader.readAsDataURL(file);
        });
    }

    async uploadBanner(file) {
        return this.uploadFile(file, 'banners');
    }

    async uploadPhoto(file) {
        return this.uploadFile(file, 'photos');
    }

    async uploadAvatar(file) {
        return this.uploadFile(file, 'avatars');
    }

    async uploadQRCode(file, platform) {
        return this.uploadFile(file, `qrcodes/${platform}`);
    }
}

// 初始化函数
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
