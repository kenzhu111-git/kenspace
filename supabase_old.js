/**
 * Supabase 客户端配�?
 * PHOTOGRAPHER - 个人摄影网站
 */

// Supabase 配置
const SUPABASE_URL = 'https://gtgcqywkekfofdcbkaek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z2NxeXdrZWtmb2ZkY2JrYWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzU5MjksImV4cCI6MjA4NDA1MTkyOX0.TK6DBOio6-eYi_gjtb-gvxGisgqvkGqZkQ80fU7CvTI';

// 存储桶名�?
const STORAGE_BUCKET = 'photos';

// 数据版本号（修改时递增，强制清除旧缓存�?
const DATA_VERSION = '2';  // 2026-02-02 更新图片

// 测试 Supabase Storage 是否可用
async function testSupabaseStorage() {
    console.log('[Supabase Storage] 测试连接...');
    try {
        // 测试列出文件（需要权限）
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
            console.log('[Supabase Storage] �?连接成功�?);
            return true;
        } else {
            const error = await response.text();
            console.error('[Supabase Storage] �?连接失败:', error);
            return false;
        }
    } catch (error) {
        console.error('[Supabase Storage] �?连接错误:', error.message);
        return false;
    }
}

// 默认分类 - 古典摄影工艺
const DEFAULT_CATEGORIES = [
    { id: 'digital', name: '数码', description: '数码相机拍摄的作�? },
    { id: 'film', name: '胶片', description: '传统胶片摄影作品' },
    { id: 'wetplate', name: '湿版', description: '湿版摄影工艺作品' },
    { id: 'carbon', name: '碳素', description: '碳素印相工艺作品' },
    { id: 'cyanotype', name: '蓝晒', description: '蓝晒摄影工艺作品' },
    { id: 'vandyke', name: '范戴�?, description: '范戴克棕印相工艺作品' }
];

// 默认属�?
const DEFAULT_ATTRIBUTES = [
    { id: 'size', name: '作品尺寸', description: '作品的物理尺�?, unit: 'cm' },
    { id: 'negative_size', name: '底片尺寸', description: '底片的尺寸规�?, unit: '' },
    { id: 'other', name: '其他', description: '其他属性信�?, unit: '' }
];

// 初始�?Supabase 客户�?
let supabaseClient = null;

// 使用JSONbin.io作为简单的后端存储替代方案
// 因为浏览器端直接使用Supabase会有安全问题
const API_BASE_URL = 'https://api.jsonbin.io/v3/b';
const BIN_ID = '6797a5a6acd3cb34a89d3c4c'; // 需要创�?

// 模拟Supabase客户�?
class SimpleSupabaseClient {
    constructor() {
        this.photos = [];
        this.categories = [];
        this.attributes = [];
        this.isLoaded = false;
    }

    // 加载所有数�?
    async loadAll() {
        console.log('══════════════════════════════════════════�?);
        console.log('[loadAll] �?STARTING LOAD ALL OPERATION �?);
        console.log('[loadAll] Current isLoaded state:', this.isLoaded);
        console.log('[loadAll] DATA_VERSION:', DATA_VERSION);
        
        // 检查数据版本，如果版本不匹配则清除旧数�?
        const savedVersion = localStorage.getItem('data_version');
        if (savedVersion !== DATA_VERSION) {
            console.log('[loadAll] ⚠️ 数据版本不匹配，清除旧缓�?..');
            console.log('[loadAll] 旧版�?', savedVersion, '新版�?', DATA_VERSION);
            localStorage.removeItem('photos');
            localStorage.removeItem('categories');
            localStorage.removeItem('attributes');
            localStorage.setItem('data_version', DATA_VERSION);
            console.log('[loadAll] �?已清除旧缓存并更新版本号');
        }
        
        try {
            // 加载分类
            console.log('[loadAll] Loading categories...');
            const localCategories = localStorage.getItem('categories');
            console.log('[loadAll] localStorage categories:', localCategories ? 'Found' : 'Not found');
            
            if (localCategories) {
                this.categories = JSON.parse(localCategories);
                console.log('[loadAll] �?Categories loaded from localStorage, count:', this.categories.length);
            } else {
                this.categories = [...DEFAULT_CATEGORIES];
                console.log('[loadAll] ⚠️ No categories in localStorage, using defaults, count:', this.categories.length);
                this.saveCategories();
            }

            // 加载属�?
            console.log('[loadAll] Loading attributes...');
            const localAttributes = localStorage.getItem('attributes');
            if (localAttributes) {
                this.attributes = JSON.parse(localAttributes);
                console.log('[loadAll] �?Attributes loaded from localStorage, count:', this.attributes.length);
            } else {
                this.attributes = [...DEFAULT_ATTRIBUTES];
                console.log('[loadAll] ⚠️ No attributes in localStorage, using defaults');
                this.saveAttributes();
            }

            // 加载作品
            console.log('[loadAll] Loading photos...');
            await this.loadPhotos();
            
            this.isLoaded = true;
            console.log('[loadAll] �?All data loaded successfully');
            console.log('[loadAll] Final state - isLoaded:', this.isLoaded);
            console.log('[loadAll] Categories count:', this.categories.length);
            console.log('[loadAll] Attributes count:', this.attributes.length);
            console.log('[loadAll] Photos count:', this.photos.length);
            console.log('[loadAll] �?LOAD ALL OPERATION COMPLETED �?);
            console.log('══════════════════════════════════════════�?);
        } catch (error) {
            console.error('[loadAll] �?Error during loadAll:', error);
            console.error('[loadAll] Error name:', error.name);
            console.error('[loadAll] Error message:', error.message);
            this.initializeDefaults();
        }
    }

    // 加载作品数据
    async loadPhotos() {
        console.log('[loadPhotos] Attempting to load photos from localStorage...');
        try {
            const localPhotos = localStorage.getItem('photos');
            console.log('[loadPhotos] localStorage.getItem result:', localPhotos ? `Found ${localPhotos.length} chars` : 'NULL');
            
            if (localPhotos) {
                this.photos = JSON.parse(localPhotos);
                console.log('[loadPhotos] �?Successfully parsed photos, count:', this.photos.length);
                
                if (this.photos.length > 0) {
                    console.log('[loadPhotos] First photo title:', this.photos[0]?.title);
                    console.log('[loadPhotos] Last photo title:', this.photos[this.photos.length - 1]?.title);
                }
            } else {
                console.log('[loadPhotos] ⚠️ No photos found in localStorage, using defaults');
                this.photos = this.getDefaultPhotos();
                console.log('[loadPhotos] Default photos count:', this.photos.length);
                
                // 保存默认数据
                console.log('[loadPhotos] Saving default photos to localStorage...');
                await this.savePhotos();
                console.log('[loadPhotos] �?Default photos saved');
            }
            
            // 返回加载结果
            return { data: this.photos, count: this.photos.length };
        } catch (error) {
            console.error('[loadPhotos] �?Error loading photos:', error);
            console.error('[loadPhotos] Error name:', error.name);
            console.error('[loadPhotos] Error message:', error.message);
            
            // 出错时使用默认数�?
            console.log('[loadPhotos] Using default photos due to error');
            this.photos = this.getDefaultPhotos();
            this.savePhotos();
            return { data: this.photos, count: this.photos.length, error: error.message };
        }
    }

    // 初始化默认�?
    initializeDefaults() {
        this.categories = [...DEFAULT_CATEGORIES];
        this.attributes = [...DEFAULT_ATTRIBUTES];
        this.photos = this.getDefaultPhotos();
        this.saveCategories();
        this.saveAttributes();
        this.savePhotos();
        this.isLoaded = true;
    }

    // 获取默认数据
    getDefaultPhotos() {
        return [];
            
    }

    // 保存分类
    async saveCategories() {
        try {
            const dataToSave = JSON.stringify(this.categories);
            console.log('[saveCategories] Saving to localStorage:', dataToSave);
            localStorage.setItem('categories', dataToSave);
            const verify = localStorage.getItem('categories');
            console.log('[saveCategories] Verified in localStorage:', verify);
            return { success: true };
        } catch (error) {
            console.error('保存分类失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 保存属�?
    async saveAttributes() {
        try {
            localStorage.setItem('attributes', JSON.stringify(this.attributes));
            return { success: true };
        } catch (error) {
            console.error('保存属性失�?', error);
            return { success: false, error: error.message };
        }
    }

    // ============ 分类操作 ============

    // 获取所有分�?
    async getCategories() {
        console.log('[getCategories] isLoaded:', this.isLoaded);
        // 不再无条件调用loadAll，而是确保已加�?
        if (!this.isLoaded) {
            console.log('[getCategories] Calling loadAll()');
            await this.loadAll();
        } else {
            console.log('[getCategories] Already loaded, categories count:', this.categories.length);
        }
        console.log('[getCategories] Returning categories:', this.categories);
        return { data: this.categories, error: null };
    }

    // 添加分类
    async addCategory(category) {
        console.log('[addCategory] Starting with category:', category);
        console.log('[addCategory] isLoaded before check:', this.isLoaded);
        
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            console.log('[addCategory] Loading all data first...');
            await this.loadAll();
        }
        
        const newCategory = {
            ...category,
            id: category.id || crypto.randomUUID(),
            created_at: new Date().toISOString()
        };
        
        console.log('[addCategory] Adding to categories array:', newCategory);
        this.categories.push(newCategory);
        console.log('[addCategory] Categories count before save:', this.categories.length);
        
        const saveResult = await this.saveCategories();
        console.log('[addCategory] Save result:', saveResult);
        console.log('[addCategory] Verifying localStorage:', localStorage.getItem('categories'));
        
        return { data: [newCategory], error: null };
    }

    // 更新分类
    async updateCategory(id, updates) {
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) {
            return { error: { message: '分类不存�? } };
        }
        
        this.categories[index] = { ...this.categories[index], ...updates };
        await this.saveCategories();
        
        return { data: [this.categories[index]], error: null };
    }

    // 删除分类
    async deleteCategory(id) {
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        // 检查是否有作品使用此分�?
        const hasPhotos = this.photos.some(p => p.category === id);
        if (hasPhotos) {
            return { error: { message: '该分类下有作品，无法删除' } };
        }
        
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) {
            return { error: { message: '分类不存�? } };
        }
        
        this.categories.splice(index, 1);
        await this.saveCategories();
        
        return { data: [{ id }], error: null };
    }

    // ============ 属性操�?============

    // 获取所有属�?
    async getAttributes() {
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        return { data: this.attributes, error: null };
    }

    // 添加属�?
    async addAttribute(attribute) {
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        const newAttribute = {
            ...attribute,
            id: attribute.id || crypto.randomUUID(),
            created_at: new Date().toISOString()
        };
        
        this.attributes.push(newAttribute);
        await this.saveAttributes();
        
        return { data: [newAttribute], error: null };
    }

    // 更新属�?
    async updateAttribute(id, updates) {
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        const index = this.attributes.findIndex(a => a.id === id);
        if (index === -1) {
            return { error: { message: '属性不存在' } };
        }
        
        this.attributes[index] = { ...this.attributes[index], ...updates };
        await this.saveAttributes();
        
        return { data: [this.attributes[index]], error: null };
    }

    // 删除属�?
    async deleteAttribute(id) {
        // 如果还没有加载，先加�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        const index = this.attributes.findIndex(a => a.id === id);
        if (index === -1) {
            return { error: { message: '属性不存在' } };
        }
        
        this.attributes.splice(index, 1);
        await this.saveAttributes();
        
        return { data: [{ id }], error: null };
    }

    // 保存数据
    async savePhotos() {
        try {
            const photosToSave = JSON.stringify(this.photos);
            console.log('[savePhotos] Attempting to save photos...');
            console.log('[savePhotos] this.photos count:', this.photos.length);
            console.log('[savePhotos] Data to save:', photosToSave.substring(0, 200) + '...');
            
            localStorage.setItem('photos', photosToSave);
            
            // Verify the save
            const savedData = localStorage.getItem('photos');
            console.log('[savePhotos] Verified localStorage photos:', savedData ? `Length: ${savedData.length}` : 'NULL');
            console.log('[savePhotos] Successfully saved photos to localStorage');
            
            return { success: true };
        } catch (error) {
            console.error('[savePhotos] Error saving photos:', error);
            console.error('[savePhotos] Error name:', error.name);
            console.error('[savePhotos] Error message:', error.message);
            return { success: false, error: error.message };
        }
    }

    // 获取所有作�?
    async select(table, options = {}) {
        // 如果还没有加载，先加载所有数�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        let result = [...this.photos];
        
        // 筛选条�?
        if (options.filter) {
            if (options.filter.category) {
                result = result.filter(p => p.category === options.filter.category);
            }
            if (options.filter.is_active !== undefined) {
                result = result.filter(p => p.is_active === options.filter.is_active);
            }
        }
        
        // 排序
        if (options.order) {
            const field = options.order.field || 'sort_order';
            const ascending = options.order.ascending !== false;
            result.sort((a, b) => {
                if (ascending) {
                    return (a[field] || 0) - (b[field] || 0);
                } else {
                    return (b[field] || 0) - (a[field] || 0);
                }
            });
        }
        
        return { data: result, error: null };
    }

    // 获取单个作品
    async getOne(table, id) {
        // 如果还没有加载，先加载所有数�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        const photo = this.photos.find(p => p.id === id);
        return { data: photo, error: null };
    }

    // 插入作品
    async insert(table, record) {
        console.log('══════════════════════════════════════════�?);
        console.log('[insert] �?STARTING INSERT OPERATION �?);
        console.log('[insert] table:', table);
        console.log('[insert] record keys:', Object.keys(record));
        console.log('[insert] isLoaded before check:', this.isLoaded);
        console.log('[insert] this.photos.length before:', this.photos.length);
        
        // 如果还没有加载，先加载所有数�?
        if (!this.isLoaded) {
            console.log('[insert] ⚠️ isLoaded is false, loading all data first...');
            await this.loadAll();
            console.log('[insert] After loadAll, this.photos.length:', this.photos.length);
        }
        
        // 生成新照片对�?
        const newPhoto = {
            ...record,
            id: crypto.randomUUID(),
            is_active: true,
            sort_order: this.photos.length + 1,
            created_at: new Date().toISOString()
        };
        
        console.log('[insert] Created newPhoto with id:', newPhoto.id);
        console.log('[insert] Pushing to this.photos array...');
        
        this.photos.push(newPhoto);
        
        console.log('[insert] �?this.photos.length after push:', this.photos.length);
        console.log('[insert] Last photo in array:', this.photos[this.photos.length - 1]?.title);
        
        // 保存到localStorage
        console.log('[insert] Calling savePhotos()...');
        const saveResult = await this.savePhotos();
        
        console.log('[insert] saveResult:', saveResult);
        
        if (!saveResult.success) {
            console.error('[insert] �?savePhotos failed!');
            return { data: null, error: { message: '保存失败: ' + saveResult.error } };
        }
        
        // 验证保存结果
        const verifyResult = await this.loadPhotos();
        console.log('[insert] Verified photos count:', this.photos.length);
        
        console.log('[insert] �?INSERT OPERATION COMPLETED SUCCESSFULLY �?);
        console.log('══════════════════════════════════════════�?);
        
        return { data: [newPhoto], error: null };
    }

    // 更新作品
    async update(table, id, updates) {
        console.log('[update] Starting update for id:', id);
        console.log('[update] updates:', updates);
        console.log('[update] isLoaded before check:', this.isLoaded);
        
        // 如果还没有加载，先加载所有数�?
        if (!this.isLoaded) {
            console.log('[update] Loading all data first...');
            await this.loadAll();
        }
        
        const index = this.photos.findIndex(p => p.id === id);
        console.log('[update] Found index:', index);
        
        if (index === -1) {
            console.error('[update] Photo not found with id:', id);
            return { error: { message: '作品不存�? } };
        }
        
        console.log('[update] Before update:', this.photos[index]);
        this.photos[index] = { ...this.photos[index], ...updates };
        console.log('[update] After update:', this.photos[index]);
        
        const saveResult = await this.savePhotos();
        console.log('[update] Save result:', saveResult);
        console.log('[update] Photos count after save:', this.photos.length);
        
        return { data: [this.photos[index]], error: null };
    }

    // 删除作品
    async delete(table, id) {
        // 如果还没有加载，先加载所有数�?
        if (!this.isLoaded) {
            await this.loadAll();
        }
        
        const index = this.photos.findIndex(p => p.id === id);
        if (index === -1) {
            return { error: { message: '作品不存�? } };
        }
        
        this.photos.splice(index, 1);
        await this.savePhotos();
        
        return { data: [{ id }], error: null };
    }

    // 上传图片�?Supabase Storage
    async upload(bucket, path, file) {
        console.log('========================================');
        console.log('[upload] 开始上传图�?..');
        console.log('[upload] bucket:', bucket);
        console.log('[upload] path:', path);
        console.log('[upload] file name:', file.name);
        console.log('[upload] file size:', (file.size / 1024).toFixed(2), 'KB');
        
        // 检查文件大小（限制 10MB�?
        if (file.size > 10 * 1024 * 1024) {
            console.error('[upload] 文件太大，超�?10MB 限制');
            throw new Error('文件大小不能超过 10MB');
        }
        
        try {
            // 创建 FormData
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('[upload] 准备调用 Supabase Storage API...');
            console.log('[upload] URL:', `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`);
            
            // 使用 Supabase Storage API
            const response = await fetch(
                `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY
                    },
                    body: formData
                }
            );
            
            console.log('[upload] 响应状�?', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('[upload] Supabase Storage 上传失败:', errorText);
                
                // 尝试获取更详细的错误信息
                try {
                    const errorJson = JSON.parse(errorText);
                    console.error('[upload] 错误详情:', errorJson);
                } catch (e) {
                    // 忽略解析错误
                }
                
                throw new Error(`上传失败 (${response.status}): ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('[upload] 上传成功:', result);
            
            // 构建公开访问 URL
            // Supabase Storage v1 公开访问 URL 格式
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
            console.log('[upload] 公开访问 URL:', publicUrl);
            console.log('========================================');
            
            return { data: { path: publicUrl }, error: null };
        } catch (error) {
            console.error('[upload] 上传过程中发生错�?', error.message);
            console.log('[upload] 将尝试降级方�?..');
            console.log('========================================');
            
            // 如果 Supabase Storage 不可用，提示用户
            console.error('========================================');
            console.error('�?Supabase Storage 上传失败');
            console.error('💡 请检查：');
            console.error('   1. 存储�?"photos" 是否已创建？');
            console.error('   2. CORS 配置是否正确�?);
            console.error('   3. 存储桶是否为 Public�?);
            console.error('========================================');
            
            // 降级�?base64（仅限小文件�?
            if (file.size < 500 * 1024) { // 500KB 以下才尝�?base64
                console.log('[upload] 尝试使用 base64 降级方案...');
                return this.uploadAsBase64(path, file);
            } else {
                throw new Error('Supabase Storage 不可用，且文件太大无法使�?base64 存储。请检�?Supabase Storage 配置�?);
            }
        }
    }
    
    // 降级方案：将图片存储�?base64（仅用于开发测试）
    async uploadAsBase64(path, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('[uploadAsBase64] 文件已转换为 base64，长�?', e.target.result.length);
                resolve({ data: { path: e.target.result }, error: null });
            };
            reader.onerror = (error) => {
                console.error('[uploadAsBase64] 转换失败:', error);
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    // 上传作品图片（简化版�?
    async uploadPhoto(file) {
        console.log('[uploadPhoto] 开始上传作品图�?..');
        console.log('[uploadPhoto] 文件�?', file.name);
        console.log('[uploadPhoto] 文件大小:', (file.size / 1024).toFixed(2), 'KB');

        // 生成唯一的文件名
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `photos/${timestamp}_${randomStr}.${extension}`;

        console.log('[uploadPhoto] 生成的文件名:', filename);

        // 上传�?Supabase Storage
        const result = await this.upload(STORAGE_BUCKET, filename, file);

        if (result.error) {
            console.error('[uploadPhoto] 上传失败:', result.error);
            return { data: null, error: result.error };
        }

        console.log('[uploadPhoto] 上传成功！URL:', result.data.path);
        return result;
    }

    // 上传缩略图（400px�?
    async uploadThumbnail(file) {
        console.log('[uploadThumbnail] 开始上传缩略图...');

        // 生成缩略�?
        const thumbnailDataUrl = await this.generateThumbnail(file, 400);

        // �?base64 转换�?Blob 并上�?
        const thumbnailBlob = this.dataURLtoBlob(thumbnailDataUrl);

        // 生成唯一的缩略图文件�?
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `thumbnails/${timestamp}_${randomStr}.jpg`;

        console.log('[uploadThumbnail] 缩略图文件名:', filename);

        // 上传�?Supabase Storage
        const result = await this.upload(STORAGE_BUCKET, filename, thumbnailBlob);

        if (result.error) {
            console.error('[uploadThumbnail] 上传失败:', result.error);
            return { data: null, error: result.error };
        }

        console.log('[uploadThumbnail] 上传成功！URL:', result.data.path);
        return result;
    }

    // 生成缩略�?
    generateThumbnail(file, maxSize = 400) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height = Math.round(height * maxSize / width);
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = Math.round(width * maxSize / height);
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // �?DataURL 转换�?Blob
    dataURLtoBlob(dataURL) {
        const arr = dataURL.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);

        // 注意：需要使用临时变量来循环，因�?n 是常�?
        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }

        return new Blob([u8arr], { type: mime });
    }

    // 删除存储的图�?
    async deletePhotoImage(imageUrl) {
        try {
            // �?URL 中提取文件名
            const urlParts = imageUrl.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
            if (urlParts.length !== 2) {
                console.error('[deletePhotoImage] 无效�?URL 格式:', imageUrl);
                return { error: null }; // 不一定是错误，可能是 base64
            }

            const filename = urlParts[1];
            console.log('[deletePhotoImage] 要删除的文件:', filename);

            const response = await fetch(
                `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filename}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY
                    }
                }
            );

            if (response.ok) {
                console.log('[deletePhotoImage] 文件已删�?', filename);
                return { error: null };
            } else {
                const errorText = await response.text();
                console.error('[deletePhotoImage] 删除失败:', errorText);
                return { error: errorText };
            }
        } catch (error) {
            console.error('[deletePhotoImage] 删除过程中发生错�?', error);
            return { error: error.message };
        }
    }

    // ============ 关于我数据操�?============

    // 获取关于我数�?
    async getAbout() {
        console.log('[getAbout] 获取关于我数�?..');
        try {
            const localAbout = localStorage.getItem('about');
            console.log('[getAbout] localStorage about:', localAbout ? 'Found' : 'Not found');
            
            if (localAbout) {
                const aboutData = JSON.parse(localAbout);
                console.log('[getAbout] 成功解析关于我数�?', aboutData);
                return { data: aboutData, error: null };
            } else {
                // 返回默认数据
                const defaultAbout = {
                    name: '',
                    title: '',
                    bio: '',
                    contact: '',
                    avatar_url: ''
                };
                console.log('[getAbout] 没有找到数据，返回默�?', defaultAbout);
                return { data: defaultAbout, error: null };
            }
        } catch (error) {
            console.error('[getAbout] 获取关于我数据失�?', error);
            return { data: null, error: error.message };
        }
    }

    // 保存关于我数�?
    async saveAbout(data) {
        console.log('========================================');
        console.log('[saveAbout] �?开始保存关于我数据 �?);
        console.log('[saveAbout] 收到的原始数�?', JSON.stringify(data, null, 2));
        
        // 检查字�?
        console.log('[saveAbout] 所有字�?');
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (typeof value === 'string' && value.startsWith('data:image')) {
                console.log(`  - ${key}: [图片数据, ${value.length} 字符]`);
            } else {
                console.log(`  - ${key}: ${value}`);
            }
        });
        
        try {
            const dataToSave = JSON.stringify(data);
            console.log('[saveAbout] 序列化后的数据总长�?', dataToSave.length, '字符');
            
            console.log('[saveAbout] 尝试保存�?localStorage...');
            localStorage.setItem('about', dataToSave);
            console.log('[saveAbout] �?数据已写�?localStorage');
            
            // 验证保存结果
            const savedData = localStorage.getItem('about');
            console.log('[saveAbout] �?localStorage 读取验证...');
            
            if (savedData) {
                const parsed = JSON.parse(savedData);
                console.log('[saveAbout] �?验证成功�?);
                console.log('[saveAbout] 保存的字�?', Object.keys(parsed));
                console.log('[saveAbout] 小红书二维码:', parsed.xiaohongshu_qrcode ? `有数�?(${parsed.xiaohongshu_qrcode.length} 字符)` : '�?);
                console.log('[saveAbout] B站二维码:', parsed.bilibili_qrcode ? `有数�?(${parsed.bilibili_qrcode.length} 字符)` : '�?);
                console.log('========================================');
                return { data: data, error: null };
            } else {
                console.error('[saveAbout] �?验证失败，数据未找到');
                console.log('========================================');
                return { data: null, error: { message: '保存验证失败 - 数据未写�?localStorage' } };
            }
        } catch (error) {
            console.error('[saveAbout] �?保存失败!');
            console.error('[saveAbout] 错误类型:', error.name);
            console.error('[saveAbout] 错误信息:', error.message);
            
            if (error.name === 'QuotaExceededError') {
                console.error('[saveAbout] 💡 提示: localStorage 存储空间已满�?);
                console.error('[saveAbout] 💡 建议: 请删除一些图片数据后再试');
            }
            
            console.log('========================================');
            return { data: null, error: error.message };
        }
    }

    // ============ Banner 轮播图数据操�?============

    // 获取 Banner 数据
    async getBanners() {
        console.log('[getBanners] 获取 Banner 数据...');
        try {
            const localBanners = localStorage.getItem('banners');
            console.log('[getBanners] localStorage banners:', localBanners ? 'Found' : 'Not found');

            if (localBanners) {
                const banners = JSON.parse(localBanners);
                console.log('[getBanners] �?成功加载 Banner 数据，数�?', banners.length);
                return { data: banners, error: null };
            } else {
                // 返回默认 Banner 数据
                const defaultBanners = [
                    {
                        id: 1,
                        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
                        title: '光影之间',
                        description: '捕捉生活中的每一个瞬�?,
                        sort_order: 1
                    },
                    {
                        id: 2,
                        image_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920',
                        title: '自然之美',
                        description: '探索大自然的无限魅力',
                        sort_order: 2
                    },
                    {
                        id: 3,
                        image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920',
                        title: '城市脉络',
                        description: '记录都市的节奏与韵律',
                        sort_order: 3
                    }
                ];
                console.log('[getBanners] 使用默认 Banner 数据');
                return { data: defaultBanners, error: null };
            }
        } catch (error) {
            console.error('[getBanners] 获取 Banner 数据失败:', error);
            return { data: null, error: error.message };
        }
    }

    // 保存 Banner 数据
    async saveBanners(banners) {
        console.log('========================================');
        console.log('[saveBanners] �?开始保�?Banner 数据 �?);
        console.log('[saveBanners] 收到�?Banner 数量:', banners.length);

        try {
            const dataToSave = JSON.stringify(banners);
            console.log('[saveBanners] 序列化后的数据长�?', dataToSave.length, '字符');

            console.log('[saveBanners] 尝试保存�?localStorage...');
            localStorage.setItem('banners', dataToSave);
            console.log('[saveBanners] �?Banner 数据已写�?localStorage');

            // 验证保存结果
            const savedData = localStorage.getItem('banners');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                console.log('[saveBanners] �?验证成功！保存的 Banner 数量:', parsed.length);
                console.log('========================================');
                return { data: banners, error: null };
            } else {
                console.error('[saveBanners] �?验证失败，数据未找到');
                console.log('========================================');
                return { data: null, error: { message: '保存验证失败 - 数据未写�?localStorage' } };
            }
        } catch (error) {
            console.error('[saveBanners] �?保存失败!');
            console.error('[saveBanners] 错误信息:', error.message);

            if (error.name === 'QuotaExceededError') {
                console.error('[saveBanners] 💡 提示: localStorage 存储空间已满�?);
            }

            console.log('========================================');
            return { data: null, error: error.message };
        }
    }

    // 上传 Banner 图片
    async uploadBanner(file) {
        console.log('[uploadBanner] 开始上�?Banner 图片...');
        console.log('[uploadBanner] 文件�?', file.name);
        console.log('[uploadBanner] 文件大小:', (file.size / 1024).toFixed(2), 'KB');

        // 生成唯一的文件名
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `banners/${timestamp}_${randomStr}.${extension}`;

        console.log('[uploadBanner] 生成的文件名:', filename);

        // 上传�?Supabase Storage
        const result = await this.upload(STORAGE_BUCKET, filename, file);

        if (result.error) {
            console.error('[uploadBanner] 上传失败:', result.error);
            return { data: null, error: result.error };
        }

        console.log('[uploadBanner] 上传成功！URL:', result.data.path);
        return result;
    }
}

// 创建客户端实�?
supabaseClient = new SimpleSupabaseClient();

// 初始化加载所有数�?
supabaseClient.loadAll();

// 导出
window.supabase = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
window.DEFAULT_ATTRIBUTES = DEFAULT_ATTRIBUTES;

