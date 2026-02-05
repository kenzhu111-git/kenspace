#!/usr/bin/env python3
"""
修复 supabase.js 中的语法错误
"""

def fix_supabase_js(file_path):
    """修复 supabase.js 中的语法错误"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. 修复 verifyPassword 方法中多余的大括号
    # 查找: return false;\n    };\n    }\n\n    async checkSession
    # 替换为: return false;\n    }\n\n    async checkSession
    
    if 'return false;\n    };\n    }\n\n    async checkSession' in content:
        content = content.replace(
            'return false;\n    };\n    }\n\n    async checkSession',
            'return false;\n    }\n\n    async checkSession'
        )
        print("✅ 已修复 verifyPassword 方法中多余的大括号")
    else:
        # 尝试其他格式
        import re
        pattern = r'return false;\s*\}\s*\}\s*\n\s*async checkSession'
        if re.search(pattern, content):
            content = re.sub(
                pattern,
                'return false;\n    }\n\n    async checkSession',
                content
            )
            print("✅ 已修复 verifyPassword 方法中多余的大括号")
    
    # 2. 确保类正确闭合
    # 检查是否有类闭合的问题
    
    # 写入文件
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已保存修复到 {file_path}")
        return True
    else:
        print("⚠️ 未发现需要修复的内容或修复失败")
        return False

def main():
    print("开始修复 supabase.js 语法错误...")
    print("=" * 50)
    
    file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'
    
    success = fix_supabase_js(file_path)
    
    if success:
        print("\n" + "=" * 50)
        print("✅ 修复完成！")
        print("\n错误原因：")
        print("  verifyPassword() 方法末尾有多余的 '};' ")
        print("  正确的结构应该是 '}' 而非 '}; }'")
    else:
        print("\n" + "=" * 50)
        print("❌ 修复失败，请手动检查文件")

if __name__ == '__main__':
    main()
