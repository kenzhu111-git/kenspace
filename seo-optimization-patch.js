/**
 * SEO 优化补丁
 * PHOTOGRAPHER - 个人摄影网站
 *
 * 替换 index.html 中的 <head> 部分
 */

// 在 <head> 标签内的代码替换
const seoHeadCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- SEO Meta Tags -->
    <title>PHOTOGRAPHER | 专业摄影师个人作品集 - 极简主义摄影</title>
    <meta name="description" content="PHOTOGRAPHER - 专注于极简主义摄影的个人作品集网站。展示风景、建筑、人像、城市、极简、街拍等摄影作品，记录光影交错的美好瞬间。">
    <meta name="keywords" content="摄影师, 摄影作品集, 个人网站, 极简摄影, 风景摄影, 建筑摄影, 人像摄影, 城市摄影, 街拍, 艺术摄影">
    <meta name="author" content="PHOTOGRAPHER">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://your-domain.com/">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://your-domain.com/">
    <meta property="og:title" content="PHOTOGRAPHER | 专业摄影师个人作品集">
    <meta property="og:description" content="专注于极简主义摄影的个人作品集，记录光影交错的美好瞬间。">
    <meta property="og:image" content="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200">
    <meta property="og:site_name" content="PHOTOGRAPHER">
    <meta property="og:locale" content="zh_CN">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://your-domain.com/">
    <meta name="twitter:title" content="PHOTOGRAPHER | 专业摄影师个人作品集">
    <meta name="twitter:description" content="专注于极简主义摄影的个人作品集，记录光影交错的美好瞬间。">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200">

    <!-- Structured Data - Person -->
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
        ],
        "knowsAbout": ["Photography", "Minimalist Art", "Landscape Photography"]
    }
    </script>

    <!-- Structured Data - WebSite -->
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
    </script>

    <!-- Performance Optimization -->
    <link rel="preconnect" href="https://images.unsplash.com">
    <link rel="dns-prefetch" href="https://images.unsplash.com">
    <link rel="preload" as="image" href="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920">

    <!-- Favicon -->
    <link rel="icon" href="data:;base64,=">
    <link rel="apple-touch-icon" href="https://images.unsplash.com/photo-1554048612-387768052bf7?w=180">

    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">

    <!-- Critical CSS for faster rendering -->
    <style>
        .navbar { will-change: transform; }
        .hero-slider { will-change: opacity; }
        .work-gallery { will-change: transform; }
        img { opacity: 0; transition: opacity 0.3s ease; }
        img.loaded { opacity: 1; }
    </style>
</head>`;

// 图片懒加载优化
const lazyLoadScript = `
// 图片懒加载
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
});

// 将此代码添加到 script.js 的末尾
`;

// 使用说明
const usageInstructions = `
========================================
SEO 优化补丁使用说明
========================================

1. 备份原文件
   - 复制 index.html 为 index.html.backup
   - 复制 script.js 为 script.js.backup

2. 应用 SEO 优化
   a) 打开 index.html
   b) 找到 <head> 标签（约第 2 行）
   c) 替换为 seoHeadCode 中的代码
   d) 修改 canonical URL 为您的实际域名

3. 应用懒加载优化
   a) 打开 script.js
   b) 在文件末尾添加 lazyLoadScript 中的代码
   c) 在 HTML 中为 img 添加 loading="lazy" 属性

4. 测试验证
   - 使用 Google PageSpeed Insights 测试
   - 使用 Google Search Console 检查索引
   - 验证社交媒体分享预览

========================================
`;
