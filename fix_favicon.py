#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 index.html 中的 favicon 引用
"""

def fix_favicon():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\index.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 旧的favicon代码
    old_favicon = '''    <!-- Favicon -->
    <link rel="icon" href="data:;base64,=">
    <link rel="apple-touch-icon" href="https://images.unsplash.com/photo-1554048612-387768052bf7">'''
    
    # 新的favicon代码
    new_favicon = '''    <!-- Favicon -->
    <link rel="icon" href="icon.png" type="image/png">
    <link rel="apple-touch-icon" href="icon.png">'''
    
    # 检查是否已经修复
    if 'href="icon.png"' in content:
        print("✅ favicon 已经修复过，无需重复修复")
        return
    
    # 执行替换
    if old_favicon in content:
        new_content = content.replace(old_favicon, new_favicon)
        
        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ index.html favicon 修复成功！")
        print("   已将 favicon 指向本地 icon.png 文件")
    else:
        print("❌ 未找到需要修复的 favicon 代码")
        print("   请检查文件格式是否正确")

if __name__ == '__main__':
    fix_favicon()
