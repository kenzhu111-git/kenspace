#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 supabase.js 的语法错误
删除 class 定义后多余的花括号
"""

def fix_syntax_error():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\supabase.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到并删除多余的闭合花括号
    # 问题代码：
    #         return { data: photo, error: null };
    #     }
    # }
    #     <-- 多余的 } 在这里
    #     // 上传文件到 Supabase Storage
    
    old_pattern = '''        return { data: photo, error: null };
    }
}

    // 上传文件到 Supabase Storage
    async uploadFile(file, folder = 'banners') {'''

    new_pattern = '''        return { data: photo, error: null };
    }
    
    // 上传文件到 Supabase Storage
    async uploadFile(file, folder = 'banners') {'''

    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("=" * 60)
        print("✅ supabase.js 语法错误已修复！")
        print("=" * 60)
        print()
        print("📝 修复内容：")
        print("  - 删除 class 定义后多余的花括号")
        print("  - 保持所有上传方法在 class 内部")
        print()
        print("⚠️  部署后请测试：")
        print("  1. 访问后台管理页面")
        print("  2. 测试 Banner 图片上传")
        print("  3. 检查控制台无错误")
    else:
        print("❌ 未找到需要修复的代码模式")
        print("   错误位置可能已经变化")

if __name__ == '__main__':
    fix_syntax_error()
