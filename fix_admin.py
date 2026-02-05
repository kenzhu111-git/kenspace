#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 admin.html 文件，添加 initSupabase() 初始化调用
"""

def fix_admin_html():
    # 读取文件
    with open('C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找需要修复的代码段
    old_code = '''        // Initialize
        document.addEventListener('DOMContentLoaded', async function() {
            initNavigation();'''
    
    new_code = '''        // Initialize
        document.addEventListener('DOMContentLoaded', async function() {
            // 初始化 Supabase 客户端
            await initSupabase();
            
            initNavigation();'''
    
    # 检查是否已经修复过
    if 'await initSupabase();' in content:
        print("✅ 文件已经修复过，无需重复修复")
        return
    
    # 执行替换
    if old_code in content:
        new_content = content.replace(old_code, new_code)
        
        # 写入文件
        with open('C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ admin.html 修复成功！")
        print("   已添加: await initSupabase();")
    else:
        print("❌ 未找到需要修复的代码段")
        print("   请检查文件格式是否正确")

if __name__ == '__main__':
    fix_admin_html()
