#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在 script.js 中添加调试代码，帮助诊断 supabase 初始化失败的原因
"""

def add_debug_code():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\script.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 在 DOMContentLoaded 开始处添加调试代码
    old_dom = '''// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化 Supabase 客户端
    await initSupabase();
    
    // 初始化各个模块
    initNavigation();'''

    new_dom = '''// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    console.log('========================================');
    console.log('[INIT] DOMContentLoaded 开始执行');
    console.log('[INIT] 时间:', new Date().toISOString());
    
    // 初始化 Supabase 客户端
    console.log('[INIT] 开始调用 initSupabase()...');
    try {
        await initSupabase();
        console.log('[INIT] ✓ initSupabase() 执行完成');
        console.log('[INIT] window.supabase:', window.supabase ? '已定义' : '未定义');
        console.log('[INIT] window.supabase.isLoaded:', window.supabase?.isLoaded);
    } catch (error) {
        console.error('[INIT] ✗ initSupabase() 执行失败:', error.message);
        console.error('[INIT] 错误堆栈:', error.stack);
    }
    
    // 初始化各个模块
    initNavigation();'''

    # 修复 loadAboutInfo 中的等待逻辑
    old_about_wait = '''        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadAboutInfo] 等待 supabase 初始化...');
            // 最多等待 3 秒
            for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 100));
                if (window.supabase && window.supabase.isLoaded) {
                    console.log('[loadAboutInfo] ✓ supabase 已就绪');
                    break;
                }
            }
        }'''

    new_about_wait = '''        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadAboutInfo] 等待 supabase 初始化...');
            // 最多等待 5 秒
            for (let i = 0; i < 50; i++) {
                await new Promise(r => setTimeout(r, 100));
                console.log('[loadAboutInfo] 检查 #' + (i+1) + ': window.supabase=' + 
                           (window.supabase ? '已定义, isLoaded=' + window.supabase.isLoaded : '未定义'));
                if (window.supabase && window.supabase.isLoaded) {
                    console.log('[loadAboutInfo] ✓ supabase 已就绪');
                    break;
                }
            }
        }'''

    # 修复 loadContactInfo 中的等待逻辑
    old_contact_wait = '''        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadContactInfo] 等待 supabase 初始化...');
            // 最多等待 3 秒
            for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 100));
                if (window.supabase && window.supabase.isLoaded) {
                    console.log('[loadContactInfo] ✓ supabase 已就绪');
                    break;
                }
            }
        }'''

    new_contact_wait = '''        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadContactInfo] 等待 supabase 初始化...');
            // 最多等待 5 秒
            for (let i = 0; i < 50; i++) {
                await new Promise(r => setTimeout(r, 100));
                console.log('[loadContactInfo] 检查 #' + (i+1) + ': window.supabase=' + 
                           (window.supabase ? '已定义, isLoaded=' + window.supabase.isLoaded : '未定义'));
                if (window.supabase && window.supabase.isLoaded) {
                    console.log('[loadContactInfo] ✓ supabase 已就绪');
                    break;
                }
            }
        }'''

    fixes = []
    
    # 执行修复
    if old_dom in content:
        content = content.replace(old_dom, new_dom)
        fixes.append("✅ 添加初始化过程详细日志")
    else:
        fixes.append("ℹ️ DOMContentLoaded: 格式已不同")
    
    if old_about_wait in content:
        content = content.replace(old_about_wait, new_about_wait)
        fixes.append("✅ loadAboutInfo: 增强等待日志(5秒)")
    else:
        fixes.append("ℹ️ loadAboutInfo等待: 格式已不同")
    
    if old_contact_wait in content:
        content = content.replace(old_contact_wait, new_contact_wait)
        fixes.append("✅ loadContactInfo: 增强等待日志(5秒)")
    else:
        fixes.append("ℹ️ loadContactInfo等待: 格式已不同")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("🚀 调试代码已添加！")
    print("=" * 60)
    print()
    
    for fix in fixes:
        print(fix)
    
    print()
    print("📊 新增调试信息：")
    print("  1. [INIT] 开始记录初始化全过程")
    print("  2. [INIT] 显示 initSupabase() 开始和结束时间")
    print("  3. [INIT] 如果失败，显示详细错误堆栈")
    print("  4. [loadAboutInfo/loadContactInfo] 每100ms检查一次supabase状态")
    print("  5. 最多等待5秒，每秒输出10次状态")
    print()
    print("💡 预期效果：")
    print("  - 控制台会显示详细的初始化过程")
    print("  - 我们可以看到 supabase 是在哪一步失败的")
    print("  - 根据日志可以准确定位问题")
    print()
    print("⚠️  部署后请刷新页面并查看控制台完整日志！")

if __name__ == '__main__':
    add_debug_code()
