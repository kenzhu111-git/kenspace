/**
 * Supabase API 服务补丁
 * PHOTOGRAPHER - 个人摄影网站
 *
 * 完整的 Supabase REST API 集成
 */

class SupabaseAPI {
    constructor() {
        // 从环境变量获取配置
        this.url = this.getEnv('VITE_SUPABASE_URL') || 'https://your-project.supabase.co';
        this.key = this.getEnv('VITE_SUPABASE_ANON_KEY') || 'your-anon-key';
        this.bucket = this.getEnv('VITE_STORAGE_BUCKET') || 'photos';
    }

    getEnv(name) {
        try {
            return import.meta ? import.meta.env[name] : process.env[name];
        } catch {
            return null;
        }
    }

    // 通用请求
    async request(endpoint, options = {}) {
        const url = `${this.url}${endpoint}`;
        const headers = {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.status === 204 ? { success: true } : response.json();
        } catch (error) {
            console.error(`[SupabaseAPI] Error: ${endpoint}`, error);
            throw error;
        }
    }

    // ========== 照片 CRUD ==========
    async getPhotos(options = {}) {
        let query = '/rest/v1/photos?select=*';
        if (options.category) query += `&category=eq.${options.category}`;
        if (options.isActive !== undefined) query += `&is_active=eq.${options.isActive}`;
        query += '&order=sort_order.asc';
        return this.request(query);
    }

    async getPhoto(id) {
        const result = await this.request(`/rest/v1/photos?id=eq.${id}&select=*`);
        return result[0] || null;
    }

    async createPhoto(data) {
        return this.request('/rest/v1/photos', {
            method: 'POST',
            body: JSON.stringify({ ...data, created_at: new Date().toISOString() })
        });
    }

    async updatePhoto(id, data) {
        return this.request(`/rest/v1/photos?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ ...data, updated_at: new Date().toISOString() })
        });
    }

    async deletePhoto(id) {
        return this.request(`/rest/v1/photos?id=eq.${id}`, { method: 'DELETE' });
    }

    // ========== 分类 CRUD ==========
    async getCategories() {
        return this.request('/rest/v1/categories?select=*&order=name.asc');
    }

    async createCategory(data) {
        return this.request('/rest/v1/categories', {
            method: 'POST',
            body: JSON.stringify({ ...data, created_at: new Date().toISOString() })
        });
    }

    async updateCategory(id, data) {
        return this.request(`/rest/v1/categories?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async deleteCategory(id) {
        return this.request(`/rest/v1/categories?id=eq.${id}`, { method: 'DELETE' });
    }

    // ========== 属性 CRUD ==========
    async getAttributes() {
        return this.request('/rest/v1/attributes?select=*&order=name.asc');
    }

    async createAttribute(data) {
        return this.request('/rest/v1/attributes', {
            method: 'POST',
            body: JSON.stringify({ ...data, created_at: new Date().toISOString() })
        });
    }

    async updateAttribute(id, data) {
        return this.request(`/rest/v1/attributes?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async deleteAttribute(id) {
        return this.request(`/rest/v1/attributes?id=eq.${id}`, { method: 'DELETE' });
    }

    // ========== 存储操作 ==========
    async uploadImage(file, path) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(
                `${this.url}/storage/v1/object/${this.bucket}/${path}`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.key}` },
                    body: formData
                }
            );

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            return { success: true, url: this.getPublicUrl(result.path) };
        } catch (error) {
            console.error('[SupabaseAPI] Upload failed:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteImage(path) {
        const response = await fetch(
            `${this.url}/storage/v1/object/${this.bucket}/${path}`,
            {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${this.key}` }
            }
        );
        return { success: response.ok };
    }

    getPublicUrl(path) {
        return `${this.url}/storage/v1/object/public/${this.bucket}/${path}`;
    }
}

// 使用方法:
// 1. 在项目根目录创建 supabase-api.js
// 2. 复制以上代码到文件
// 3. 在 HTML 中引入: <script src="supabase-api.js"></script>
// 4. 使用: const api = new SupabaseAPI();
// 5. 调用: api.getPhotos().then(data => console.log(data));
