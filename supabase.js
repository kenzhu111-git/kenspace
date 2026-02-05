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

    initializeDefaults() {
        this.categories = [...DEFAULT_CATEGORIES];
        this.attributes = [...DEFAULT_ATTRIBUTES];
        this.photos = this.getDefaultPhotos();
        this.about = this.getDefaultAbout();
        this.saveCategories();
        this.saveAttributes();
        this.savePhotos();
        this.saveAbout();
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
    
    async getPhoto(id) {
        if (!this.isLoaded) await this.loadAll();
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return { data: null, error: { message: '作品不存在' } };
        return { data: photo, error: null };
    }
}

async function initSupabase() {
    if (window.supabase && window.supabase.isLoaded) {
        return window.supabase;
    }

    supabaseClient = new SimpleSupabaseClient();
    await supabaseClient.loadAll();
    window.supabase = supabaseClient;
    return supabaseClient;
}

window.initSupabase = initSupabase;
