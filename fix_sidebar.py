#!/usr/bin/env python3

# 修复侧边栏HTML结构

file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\admin.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并修复损坏的结构
old = '''                <div class="nav-item" data-page="settings">
                <div class="nav-item" data-page="account">
                    <span class="nav-icon">👤</span>
                    <span>账户设置</span>
                </div>
                    <span class="nav-icon">⚙️</span>
                    <span>系统设置</span>
                </div>'''

new = '''                <div class="nav-item" data-page="account">
                    <span class="nav-icon">👤</span>
                    <span>账户设置</span>
                </div>
                <div class="nav-item" data-page="settings">
                    <span class="nav-icon">⚙️</span>
                    <span>系统设置</span>
                </div>'''

if old in content:
    content = content.replace(old, new)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已修复侧边栏HTML结构")
else:
    print("❌ 未找到需要修复的内容")
