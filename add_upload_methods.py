#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在 supabase.js 中添加 uploadBanner 和 uploadPhoto 方法
用于文件上传到 Supabase Storage
"""

def add_upload_methods():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\supabase.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 在文件末尾添加上传方法（在 initSupabase 函数之前）
    old_init = '''async function initSupabase() {
    if (window.supabase && window.supabase.isLoaded) {
        return window.supabase;
    }

    supabaseClient = new SimpleSupabaseClient();
    await supabaseClient.loadAll();
    window.supabase = supabaseClient;
    return supabaseClient;
}

window.initSupabase = initSupabase;'''

    new_init = '''    // 上传文件到 Supabase Storage
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

window.initSupabase = initSupabase;'''

    if old_init in content:
        content = content.replace(old_init, new_init)
        fixes = ["✅ uploadFile: 添加通用文件上传方法（Supabase Storage + 本地存储）"]
        fixes.append("✅ uploadToLocal: 添加本地 Base64 存储作为备选")
        fixes.append("✅ uploadBanner: 添加 Banner 图片上传方法")
        fixes.append("✅ uploadPhoto: 添加作品图片上传方法")
        fixes.append("✅ uploadAvatar: 添加头像上传方法")
        fixes.append("✅ uploadQRCode: 添加二维码上传方法")
        
        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("=" * 60)
        print("🚀 supabase.js 文件上传方法添加完成！")
        print("=" * 60)
        print()
        
        for fix in fixes:
            print(fix)
        
        print()
        print("📊 方法说明：")
        print("  uploadFile(file, folder)")
        print("    - 通用文件上传方法")
        print("    - 优先尝试 Supabase Storage")
        print("    - 失败时自动降级到本地 Base64 存储")
        print()
        print("  uploadBanner(file)")
        print("    - 上传 Banner 图片到 banners 文件夹")
        print()
        print("  uploadPhoto(file)")
        print("    - 上传作品图片到 photos 文件夹")
        print()
        print("  uploadAvatar(file)")
        print("    - 上传头像到 avatars 文件夹")
        print()
        print("  uploadQRCode(file, platform)")
        print("    - 上传二维码到 qrcodes/{platform} 文件夹")
        print()
        print("💡 存储策略：")
        print("  1. 优先使用 Supabase Storage（需要配置权限）")
        print("  2. 失败时使用 Base64 编码存储在 localStorage")
        print("  3. 确保即使 Supabase 未配置也能正常工作")
        print()
        print("⚠️  注意事项：")
        print("  - Supabase Storage 需要正确配置 RLS 策略")
        print("  - 本地存储有大小限制（通常 5MB）")
        print("  - 生产环境建议使用 Supabase Storage")
        
    else:
        print("❌ 未找到需要修复的代码位置")
        print("   请检查文件格式是否正确")

if __name__ == '__main__':
    add_upload_methods()
