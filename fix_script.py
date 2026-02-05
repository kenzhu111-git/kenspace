#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 script.js 的初始化顺序问题
添加 initSupabase() 调用
"""

def fix_script_js():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\script.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 旧的初始化代码
    old_init = '''// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化各个模块
    initNavigation();'''
    
    # 新的初始化代码
    new_init = '''// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化 Supabase 客户端
    await initSupabase();
    
    // 初始化各个模块
    initNavigation();'''
    
    # 检查是否已经修复
    if 'await initSupabase();' in content:
        print("✅ script.js 已经修复过，无需重复修复")
        return
    
    # 执行替换
    if old_init in content:
        new_content = content.replace(old_init, new_init)
        
        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ script.js 修复成功！")
        print("   已添加: await initSupabase();")
        print()
        print("📝 修复说明：")
        print("   之前的问题：")
        print("   - script.js 在 DOMContentLoaded 时立即调用 initWorkGallery()")
        print("   - 但此时 window.supabaseClient 还是 undefined")
        print("   - 导致 getCategories() 调用失败")
        print()
        print("   解决方案：")
        print("   - 在初始化各个模块之前，先调用 await initSupabase();")
        print("   - 确保 supabaseClient 被正确初始化后再加载数据")
    else:
        print("❌ 未找到需要修复的代码段")
        print("   请检查文件格式是否正确")

if __name__ == '__main__':
    fix_script_js()
