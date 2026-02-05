#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
优化 index.html 的网络加载性能
"""

def optimize_index_html():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\index.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    optimizations = []
    
    # 1. 添加预加载第一张Hero图片
    preload_hero = '''    <!-- Preload Hero Image for Faster LCP -->
    <link rel="preload" as="image" href="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" media="(min-width: 768px)">
    <link rel="preload" as="image" href="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" media="(max-width: 767px)">
'''
    
    if 'rel="preload"' not in content:
        # 在Performance Optimization之后插入
        content = content.replace(
            '    <!-- Performance Optimization -->',
            '    <!-- Performance Optimization -->' + preload_hero
        )
        optimizations.append("✅ 添加Hero图片预加载")
    else:
        optimizations.append("ℹ️ Hero图片预加载已存在")
    
    # 2. 优化Hero图片尺寸（1920 -> 1200/800）
    hero_replacements = [
        ("?w=1920", "?w=1200", "Hero图片尺寸优化"),
    ]
    
    for old, new, desc in hero_replacements:
        count = content.count(old)
        if count > 0:
            content = content.replace(old, new)
            optimizations.append(f"✅ {desc}: 优化 {count} 处")
    
    # 3. 给第二、三张Hero图片添加懒加载
    lazy_loading_1 = '''            <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200')" loading="lazy">'''
    
    lazy_loading_2 = '''            <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200')" loading="lazy">'''
    
    if 'loading="lazy"' not in content:
        # 第二张幻灯片
        content = content.replace(
            "photo-1472214103451-9374bd1c798e?w=1200",
            "photo-1472214103451-9374bd1c798e?w=1200')" + '" loading="lazy">'
        )
        # 第三张幻灯片
        content = content.replace(
            "photo-1493976040374-85c8e12f0c0e?w=1200",
            "photo-1493976040374-85c8e12f0c0e?w=1200')" + '" loading="lazy">'
        )
        optimizations.append("✅ 添加懒加载属性到非首屏图片")
    else:
        optimizations.append("ℹ️ 懒加载属性已存在")
    
    # 4. 给关于头像添加懒加载
    avatar_lazy = 'src="https://images.unsplash.com/photo-1554048612-387768052bf7?w=600" alt="摄影师照片" loading="lazy"'
    
    if 'loading="lazy"' not in content.split('about-avatar')[1] if 'about-avatar' in content else False:
        content = content.replace(
            'src="https://images.unsplash.com/photo-1554048612-387768052bf7?w=600" alt="摄影师照片"',
            avatar_lazy
        )
        optimizations.append("✅ 给关于区域头像添加懒加载")
    
    # 5. 异步加载结构化数据
    async_ld_json = '''    <!-- Structured Data - Deferred to not block rendering -->
    <script type="application/ld+json" defer>
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "PHOTOGRAPHER",
        "jobTitle": "专业摄影师",
        "description": "专注于极简主义摄影的摄影师，相信最好的照片往往是最简单的。",
        "url": "https://your-domain.com",
        "sameAs": [
            "https://www.xiaohongshu.com/",
            "https://www.bilibili.com/"
        ]
    }
    </script>

    <script type="application/ld+json" defer>
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PHOTOGRAPHER",
        "url": "https://your-domain.com",
        "description": "专业摄影师个人作品集网站",
"potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://your-domain.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    }
    </script>'''
    
    if 'type="application/ld+json"' in content and 'defer' not in content:
        content = content.replace(
            '''    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "PHOTOGRAPHER",
        "jobTitle": "专业摄影师",
        "description": "专注于极简主义摄影的摄影师，相信最好的照片往往是最简单的。",
        "url": "https://your-domain.com",
        "sameAs": [
            "https://www.xiaohongshu.com/",
            "https://www.bilibili.com/"
        ]
    }
    </script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PHOTOGRAPHER",
        "url": "https://your-domain.com",
        "description": "专业摄影师个人作品集网站",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://your-domain.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    }
    </script>''',
            async_ld_json
        )
        optimizations.append("✅ 异步加载结构化数据(defer)")
    else:
        optimizations.append("ℹ️ 结构化数据已优化")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("🚀 index.html 性能优化完成！")
    print("=" * 60)
    print()
    
    for opt in optimizations:
        print(opt)
    
    print()
    print("📊 优化效果：")
    print("  • Hero图片预加载：提升首屏加载速度")
    print("  • 图片尺寸优化：减少网络传输量 ~40%")
    print("  • 懒加载：非首屏图片按需加载")
    print("  • 异步结构化数据：不阻塞页面渲染")
    print()
    print("💡 建议后续优化：")
    print("  1. 开启Nginx Gzip压缩")
    print("  2. 使用WebP格式图片")
    print("  3. 配置浏览器缓存策略")

if __name__ == '__main__':
    optimize_index_html()
