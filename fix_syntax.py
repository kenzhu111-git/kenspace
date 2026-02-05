#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 admin.html 中的语法错误
"""

def fix_syntax_error():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到有问题的代码段（在 DOMContentLoaded 外部的 await）
    bad_code = '''        });
            
            initNavigation();
            await loadDashboard();
            await loadCategories();
            await loadAttributes();
            await loadPhotos();
            await loadCategoryDropdown();
            await loadAttributeFields();
            initUploadForm();
            initImagePreview();
            initCategoryForm();
            initAttributeForm();
            initPhotoForm();
            initAboutForm();
            initAvatarPreview();
        });'''

    # 正确的代码应该是把这些放到 initAdminPage 函数调用中
    # 但由于我们已经修改了 initAdminPage 的调用，这里只需要删除多余的代码
    good_code = '''        });'''

    if bad_code in content:
        content = content.replace(bad_code, good_code)
        print("✅ 修复语法错误：删除函数外部的 await")
        
        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print()
        print("=" * 60)
        print("✅ 语法错误已修复！")
        print("=" * 60)
        print()
        print("📝 问题原因：")
        print("  - DOMContentLoaded 事件处理函数被过早关闭")
        print("  - 后续的 await 代码跑到了函数外部")
        print("  - 导致 JavaScript 语法错误")
        print()
        print("💡 解决方案：")
        print("  - 删除函数外部的 await 代码")
        print("  - 这些代码已经在 initAdminPage() 中调用")
        print()
        print("⚠️  部署后请重新测试：")
        print("  1. 访问后台管理页面")
        print("  2. 检查是否正常显示登录界面")
        print("  3. 测试登录功能")
    else:
        print("❌ 未找到需要修复的代码模式")
        print("   错误位置可能已经变化")

if __name__ == '__main__':
    fix_syntax_error()
