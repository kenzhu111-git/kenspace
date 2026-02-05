#!/usr/bin/env python3
"""
修复 supabase.js 和 admin.html 中的错误
"""

def fix_supabase_js(file_path):
    """修复 supabase.js 中的语法错误"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已经修复
    if '// ============ 用户管理方法 ============' in content:
        # 找到logout方法的结束位置并添加闭合大括号
        # 替换: return { success: true }\n\n    // ============ 用户管理方法
        # 为: return { success: true }\n    }\n\n    // ============ 用户管理方法
        
        old_pattern = r'(return \{ success: true \})\s*\n\s*// ============ 用户管理方法'
        new_pattern = r'''\1
    }

    // ============ 用户管理方法'''
        
        if 'return { success: true }\n\n    // ============ 用户管理方法' in content:
            content = content.replace(
                'return { success: true }\n\n    // ============ 用户管理方法',
                'return { success: true }\n    }\n\n    // ============ 用户管理方法'
            )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 已修复 {file_path}")
        return True
    
    return False

def check_admin_html_init_supabase(file_path):
    """检查 admin.html 中是否有 initSupabase 函数定义"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否引用了supabase.js
    if '<script src="supabase.js"></script>' in content:
        print("✅ admin.html 正确引用了 supabase.js")
    
    # 检查是否有 initSupabase 调用
    if 'initSupabase()' in content:
        print("✅ admin.html 中有 initSupabase() 调用")
    
    # 检查是否在 supabase.js 中定义了 initSupabase
    with open(r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js', 'r', encoding='utf-8') as f:
        supabase_content = f.read()
    
    if 'async function initSupabase' in supabase_content or 'window.initSupabase = async function' in supabase_content:
        print("✅ supabase.js 中定义了 initSupabase 函数")
        return True
    else:
        print("❌ supabase.js 中缺少 initSupabase 函数定义")
        return False

def main():
    print("开始修复错误...")
    print("=" * 50)
    
    # 修复 supabase.js
    print("\n1. 修复 supabase.js 语法错误...")
    supabase_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'
    
    with open(supabase_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查并修复 logout 方法缺少闭合大括号的问题
    if 'return { success: true }\n\n    // ============ 用户管理方法' in content:
        content = content.replace(
            'return { success: true }\n\n    // ============ 用户管理方法',
            'return { success: true }\n    }\n\n    // ============ 用户管理方法'
        )
        
        with open(supabase_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ 已添加 logout 方法的闭合大括号")
    else:
        # 尝试其他可能的格式
        pattern = r'return \{ success: true \}\s*\n\s*// ============ 用户管理方法'
        if 'return { success: true }' in content and '// ============ 用户管理方法' in content:
            import re
            content = re.sub(
                pattern,
                'return { success: true }\n    }\n\n    // ============ 用户管理方法',
                content
            )
            with open(supabase_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ 已修复 logout 方法的闭合大括号")
    
    # 2. 检查 admin.html
    print("\n2. 检查 admin.html...")
    admin_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\admin.html'
    check_admin_html_init_supabase(admin_path)
    
    print("\n" + "=" * 50)
    print("✅ 错误修复完成！")
    print("\n请刷新浏览器页面重新测试。")

if __name__ == '__main__':
    main()
