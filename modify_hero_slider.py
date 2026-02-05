#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修改 script.js 使首页 Banner 轮播从 Supabase 动态加载数据
"""

def modify_hero_slider():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\script.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 修改 initHeroSlider 函数
    old_function = '''/**
 * Hero 轮播功能
 */
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.hero-btn.prev');
    const nextBtn = document.querySelector('.hero-btn.next');
    const indicators = document.querySelector('.hero-indicators');

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5秒自动切换

    // 创建指示器
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        if (indicators) indicators.appendChild(indicator);
    });

    // 切换到指定幻灯片
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');

        // 更新指示器
        if (indicators) {
            const indicatorDots = indicators.querySelectorAll('.indicator');
            indicatorDots[currentSlide].classList.remove('active');
            indicatorDots[index].classList.add('active');
        }

        currentSlide = index;
    }

    // 上一张
    function prevSlide() {
        const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(newIndex);
    }

    // 下一张
    function nextSlide() {
        const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        goToSlide(newIndex);
    }

    // 开始自动轮播
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // 停止自动轮播
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // 绑定事件
    if (prevBtn) prevBtn.addEventListener('click', function() {
        stopSlideshow();
        prevSlide();
        startSlideshow();
    });

    if (nextBtn) nextBtn.addEventListener('click', function() {
        stopSlideshow();
        nextSlide();
        startSlideshow();
    });

    // 鼠标悬停时暂停轮播
    slider.addEventListener('mouseenter', stopSlideshow);
    slider.addEventListener('mouseleave', startSlideshow);

    // 开始轮播
    startSlideshow();
}'''

    new_function = '''/**
 * Hero 轮播功能
 */
async function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    // 从 Supabase 加载 Banner 数据
    let banners = [];
    try {
        if (window.supabase && typeof window.supabase.getBanners === 'function') {
            console.log('[HeroSlider] 从 Supabase 加载 Banner 数据...');
            const { data, error } = await window.supabase.getBanners();
            if (!error && data && data.length > 0) {
                banners = data;
                console.log('[HeroSlider] 成功加载', banners.length, '个 Banner');
            } else {
                console.log('[HeroSlider] 无 Banner 数据，使用静态内容');
            }
        } else {
            console.log('[HeroSlider] Supabase 不可用，使用静态内容');
        }
    } catch (error) {
        console.error('[HeroSlider] 加载 Banner 失败:', error);
    }

    // 如果有 Banner 数据，动态生成轮播内容
    if (banners.length > 0) {
        // 清空现有内容
        slider.innerHTML = '';
        
        // 按 sort_order 排序
        banners.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        // 生成幻灯片
        banners.forEach((banner, index) => {
            const slide = document.createElement('div');
            slide.className = `slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url('${banner.image_url}')`;
            slide.innerHTML = `
                <div class="slide-content">
                    <h1>${banner.title || ''}</h1>
                    <p>${banner.description || ''}</p>
                </div>
            `;
            slider.appendChild(slide);
        });
        
        console.log('[HeroSlider] 已动态生成 Banner 轮播');
    }

    // 继续初始化轮播功能（无论静态还是动态生成的内容）
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.hero-btn.prev');
    const nextBtn = document.querySelector('.hero-btn.next');
    const indicators = document.querySelector('.hero-indicators');

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5秒自动切换

    // 如果有幻灯片，创建指示器
    if (slides.length > 0 && indicators) {
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(indicator);
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            slides[currentSlide].classList.remove('active');
            slides[index].classList.add('active');

            // 更新指示器
            if (indicators) {
                const indicatorDots = indicators.querySelectorAll('.indicator');
                if (indicatorDots[currentSlide]) indicatorDots[currentSlide].classList.remove('active');
                if (indicatorDots[index]) indicatorDots[index].classList.add('active');
            }

            currentSlide = index;
        }
    }

    // 上一张
    function prevSlide() {
        const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(newIndex);
    }

    // 下一张
    function nextSlide() {
        const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        goToSlide(newIndex);
    }

    // 开始自动轮播
    function startSlideshow() {
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, intervalTime);
        }
    }

    // 停止自动轮播
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // 绑定事件
    if (prevBtn) prevBtn.addEventListener('click', function() {
        stopSlideshow();
        prevSlide();
        startSlideshow();
    });

    if (nextBtn) nextBtn.addEventListener('click', function() {
        stopSlideshow();
        nextSlide();
        startSlideshow();
    });

    // 鼠标悬停时暂停轮播
    slider.addEventListener('mouseenter', stopSlideshow);
    slider.addEventListener('mouseleave', startSlideshow);

    // 开始轮播
    startSlideshow();
}'''

    if old_function in content:
        content = content.replace(old_function, new_function)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("=" * 60)
        print("✅ 首页 Banner 动态加载修改完成！")
        print("=" * 60)
        print()
        print("📝 改进内容：")
        print("  1. initHeroSlider 改为 async 函数")
        print()
        print("  2. 优先从 Supabase 加载 Banner 数据")
        print("     - 调用 window.supabase.getBanners()")
        print("     - 按 sort_order 排序")
        print("     - 动态生成轮播 HTML")
        print()
        print("  3. 如果没有 Banner 数据，使用静态 HTML")
        print("     - 向后兼容")
        print("     - 不影响现有功能")
        print()
        print("  4. 改进错误处理")
        print("     - 详细的日志输出")
        print("     - 异常捕获")
        print()
        print("  5. 轮播逻辑优化")
        print("     - 只有1个幻灯片时不自动轮播")
        print("     - 索引边界检查")
        print()
        print("⚠️  部署后请测试：")
        print("  1. 访问首页 https://kenspace.online")
        print("  2. 清除浏览器缓存或 Ctrl+Shift+R 强制刷新")
        print("  3. 验证 Banner 轮播显示新上传的图片")
        print("  4. 测试轮播切换功能正常")
        print()
        print("💡 提示：")
        print("  - 如果还显示旧图片，请彻底清除浏览器缓存")
        print("  - Chrome: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)")
        print("  - 或按 F12 → Network → 勾选 Disable cache")
    else:
        print("❌ 未找到需要修改的代码")

if __name__ == '__main__':
    modify_hero_slider()
