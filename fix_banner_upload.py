#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 admin.html 中的 Banner 上传和保存逻辑
"""

def fix_banner_upload():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixes = []
    
    # 1. 修复 Banner HTML 模板，添加隐藏的 URL 存储字段
    old_banner_html = '''                    <div class="banner-item" data-id="${banner.id}">
                        <div class="banner-preview">
                            <img src="${banner.image_url}" alt="Banner ${index + 1}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'">
                        </div>
                        <div class="banner-info">
                            <div class="form-group">
                                <label>标题</label>
                                <input type="text" class="banner-title" value="${banner.title || ''}" placeholder="输入标题">
                            </div>
                            <div class="form-group">
                                <label>描述</label>
                                <input type="text" class="banner-description" value="${banner.description || ''}" placeholder="输入描述">
                            </div>
                            <div class="form-group">
                                <label>图片 URL 或上传</label>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <input type="text" class="banner-url" value="${banner.image_url}" placeholder="图片 URL" style="flex: 1;">
                                    <input type="file" class="banner-upload" accept="image/*" style="width: 120px;">
                                </div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-sm btn-primary" onclick="saveSingleBanner(${index})">保存</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteBanner(${index})">删除</button>
                            </div>
                        </div>
                    </div>'''

    new_banner_html = '''                    <div class="banner-item" data-id="${banner.id}">
                        <div class="banner-preview">
                            <img src="${banner.image_url}" alt="Banner ${index + 1}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'">
                        </div>
                        <div class="banner-info">
                            <div class="form-group">
                                <label>标题</label>
                                <input type="text" class="banner-title" value="${banner.title || ''}" placeholder="输入标题">
                            </div>
                            <div class="form-group">
                                <label>描述</label>
                                <input type="text" class="banner-description" value="${banner.description || ''}" placeholder="输入描述">
                            </div>
                            <div class="form-group">
                                <label>图片上传（选择文件后自动保存）</label>
                                <input type="file" class="banner-upload" accept="image/*" style="width: 100%;">
                                <input type="hidden" class="banner-url" value="${banner.image_url}">
                                <small style="color: #666;">选择图片后会自动上传并更新，无需手动保存</small>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-sm btn-danger" onclick="deleteBanner(${index})">删除</button>
                            </div>
                        </div>
                    </div>'''

    if old_banner_html in content:
        content = content.replace(old_banner_html, new_banner_html)
        fixes.append("✅ Banner HTML: 添加隐藏URL字段，简化保存流程")
        fixes.append("   - 移除手动URL输入框")
        fixes.append("   - 选择文件后自动上传并保存")
        fixes.append("   - 添加提示文字说明流程")
    else:
        fixes.append("ℹ️ Banner HTML: 格式已不同")

    # 2. 优化文件上传处理，自动保存
    old_upload_handler = '''                    // 自动上传到 Supabase
                    try {
                        const result = await window.supabase.uploadBanner(file);
                        if (result.error) {
                            showToast('上传失败: ' + result.error.message, 'error');
                            return;
                        }

                        // 更新 URL 输入框
                        const urlInput = bannerItem.querySelector('.banner-url');
                        urlInput.value = result.data.path;
                        showToast('图片已上传', 'success');
                    } catch (error) {
                        showToast('上传失败: ' + error.message, 'error');
                    }'''

    new_upload_handler = '''                    // 自动上传到 Supabase 并保存
                    try {
                        console.log('[Banner] 开始上传文件:', file.name);
                        const result = await window.supabase.uploadBanner(file);
                        
                        if (result.error) {
                            console.error('[Banner] 上传失败:', result.error);
                            showToast('上传失败: ' + result.error.message, 'error');
                            return;
                        }

                        console.log('[Banner] 上传成功:', result.data.path);

                        // 更新隐藏的URL字段
                        const urlInput = bannerItem.querySelector('.banner-url');
                        urlInput.value = result.data.path;

                        // 更新预览图
                        const previewImg = bannerItem.querySelector('.banner-preview img');
                        previewImg.src = result.data.path;

                        // 立即保存到数据库
                        const { data: banners } = await window.supabase.getBanners();
                        const bannerIndex = Array.from(bannerItems).indexOf(bannerItem);
                        banners[bannerIndex] = {
                            ...banners[bannerIndex],
                            image_url: result.data.path
                        };

                        const { error: saveError } = await window.supabase.saveBanners(banners);
                        if (saveError) {
                            showToast('保存失败: ' + saveError.message, 'error');
                            return;
                        }

                        console.log('[Banner] 已自动保存');
                        showToast('✅ 图片已上传并保存', 'success');
                    } catch (error) {
                        console.error('[Banner] 上传异常:', error);
                        showToast('上传失败: ' + error.message, 'error');
                    }'''

    if old_upload_handler in content:
        content = content.replace(old_upload_handler, new_upload_handler)
        fixes.append("✅ 上传处理: 优化自动上传和保存逻辑")
        fixes.append("   - 添加详细日志")
        fixes.append("   - 上传成功后立即更新预览图")
        fixes.append("   - 自动保存到数据库")
        fixes.append("   - 无需手动点击保存按钮")
    else:
        fixes.append("ℹ️ 上传处理: 格式已不同")

    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("🚀 Banner 上传和保存逻辑优化完成！")
    print("=" * 60)
    print()
    
    for fix in fixes:
        print(fix)
    
    print()
    print("📊 改进说明：")
    print("  1. 简化操作流程")
    print("     - 选择图片文件")
    print("     - 自动上传")
    print("     - 自动保存")
    print("     - 无需手动点击保存")
    print()
    print("  2. 用户体验优化")
    print("     - 移除手动URL输入框（易出错）")
    print("     - 上传后立即看到预览效果")
    print("     - 显示清晰的提示文字")
    print()
    print("  3. 错误处理")
    print("     - 添加详细日志便于调试")
    print("     - 保存失败时显示错误提示")
    print()
    print("⚠️  部署后请测试：")
    print("  1. 访问后台管理")
    print("  2. 进入 Banner 管理")
    print("  3. 选择一个图片文件")
    print("  4. 等待自动上传和保存")
    print("  5. 验证预览图已更新")
    print("  6. 刷新页面，确认数据已持久化")

if __name__ == '__main__':
    fix_banner_upload()
