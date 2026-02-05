#!/usr/bin/env python3

# 修复 supabase.js 中 verifyPassword 方法结尾多余的分号

file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并修复
old = '''        }
    };
    }
    
    async checkSession'''

new = '''        }
    }
    
    async checkSession'''

if old in content:
    content = content.replace(old, new)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已修复 verifyPassword 方法结尾的多余 '};'")
else:
    # 尝试查找其他格式
    import re
    pattern = r'}\s*\}\s*;\s*\n\s*async checkSession'
    replacement = '}\n    }\n\n    async checkSession'
    new_content = re.sub(pattern, replacement, content, count=1)
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ 已使用正则表达式修复")
    else:
        print("❌ 未找到需要修复的内容")
