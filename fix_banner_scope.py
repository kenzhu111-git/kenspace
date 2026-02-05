#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 admin.html 中的 bannerItem 变量作用域问题
"""

def fix_banner_variable_scope():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 修复事件处理函数中的变量作用域
    old_handler = '''            fileInputs.forEach((input, index) => {
                input.addEventListener('change', async function(e) {
                    const file = e.target.files[0];
                    if (!file) return;

                    // 显示本地预览
                    const reader = new FileReader();
reader.onload = function(e) {
                        const bannerItem = input.closest('.banner-item');
                        const previewImg = bannerItem.querySelector('.banner-preview img');
                        previewImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);

                    // 自动上传到 Supabase 并保存
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
                    }
                });
            });'''

    new_handler = '''            fileInputs.forEach((input, index) => {
                input.addEventListener('change', async function(e) {
                    const file = e.target.files[0];
                    if (!file) return;

                    // 获取 bannerItem（在事件处理函数顶部定义）
                    const bannerItem = input.closest('.banner-item');
                    if (!bannerItem) {
                        console.error('[Banner] 未找到 bannerItem 元素');
                        showToast('错误：未找到Banner元素', 'error');
                        return;
                    }

                    // 显示本地预览
                    const reader = new FileReader();
                    reader.onload = function(e) {
const previewImg = bannerItem.querySelector('.banner-preview img');
                        if (previewImg) {
                            previewImg.src = e.target.result;
                        }
                    };
                    reader.readAsDataURL(file);

                    // 自动上传到 Supabase 并保存
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
                        if (urlInput) {
                            urlInput.value = result.data.path;
                        }

                        // 更新预览图
                        const previewImg = bannerItem.querySelector('.banner-preview img');
                        if (previewImg) {
                            previewImg.src = result.data.path;
                        }

                        // 立即保存到数据库
                        const { data: banners } = await window.supabase.getBanners();
                        const bannerIndex = Array.from(container.querySelectorAll('.banner-item')).indexOf(bannerItem);
                        
                        if (bannerIndex >= 0 && bannerIndex < banners.length) {
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
                        } else {
                            console.error('[Banner] 无效的 bannerIndex:', bannerIndex);
                            showToast('保存失败：无效的Banner索引', 'error');
                        }
                    } catch (error) {
                        console.error('[Banner] 上传异常:', error);
                        showToast('上传失败: ' + error.message, 'error');
                    }
                });
            });'''

    if old_handler in content:
        content = content.replace(old_handler, new_handler)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("=" * 60)
        print("✅ bannerItem 变量作用域问题已修复！")
        print("=" * 60)
        print()
        print("📝 修复内容：")
        print("  1. 将 bannerItem 移到事件处理函数顶部定义")
        print("     - 确保在整个函数中都可访问")
        print()
        print("  2. 添加 null 检查")
        print("     - 检查 bannerItem 是否存在")
        print("     - 检查 urlInput 和 previewImg 是否存在")
        print()
        print("  3. 修复 bannerIndex 计算")
        print("     - 使用 container.querySelectorAll 获取元素列表")
        print("     - 添加边界检查防止数组越界")
        print()
        print("  4. 改进错误处理")
        print("     - 添加详细的错误日志")
        print("     - 显示更友好的错误提示")
        print()
        print("⚠️  部署后请测试：")
        print("  1. 访问后台管理")
        print("  2. 进入 Banner 管理")
        print("  3. 选择一个图片文件上传")
        print("  4. 验证自动上传和保存功能正常")
        print("  5. 检查控制台无错误")
    else:
        print("❌ 未找到需要修复的代码模式")
        print("   错误位置可能已经变化")

if __name__ == '__main__':
    fix_banner_variable_scope()
