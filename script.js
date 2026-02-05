/**
 * PHOTOGRAPHER - 个人摄影网站
 * JavaScript 交互逻辑
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    console.log('========================================');
    console.log('[INIT] DOMContentLoaded 开始执行');
    console.log('[INIT] 时间:', new Date().toISOString());
    
    // 初始化 Supabase 客户端
    console.log('[INIT] 开始调用 initSupabase()...');
    try {
        await initSupabase();
        console.log('[INIT] ✓ initSupabase() 执行完成');
        console.log('[INIT] window.supabase:', window.supabase ? '已定义' : '未定义');
        console.log('[INIT] window.supabase.isLoaded:', window.supabase?.isLoaded);
    } catch (error) {
        console.error('[INIT] ✗ initSupabase() 执行失败:', error.message);
        console.error('[INIT] 错误堆栈:', error.stack);
    }
    
    // 初始化各个模块
    initNavigation();
    await initHeroSlider();
    await initWorkGallery();
    await initLightbox();
    initContactForm();
    initScrollAnimations();

    // 加载关于信息
    await loadAboutInfo();
    await loadContactInfo();
});

/**
 * 导航栏功能
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 移动端菜单切换
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // 点击导航链接平滑滚动
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // 关闭移动端菜单
                    if (navLinks) {
                        navLinks.classList.remove('active');
                        if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
                    }

                    // 平滑滚动
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // 更新活动状态
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // 滚动时更新导航高亮
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/**
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
}

/**
 * 作品展示功能
 */
async function initWorkGallery() {
    const gallery = document.querySelector('.work-gallery');
    const filterContainer = document.querySelector('.work-filter');
    
    if (!gallery) return;
    
    let categories = [];
    
    // 动态加载分类
    try {
        const { data: cats } = await window.supabase.getCategories();
        categories = cats || [];
    } catch (error) {
        console.error('加载分类失败:', error);
        // 使用默认分类
        categories = [
            { id: 'digital', name: '数码' },
            { id: 'film', name: '胶片' },
            { id: 'wetplate', name: '湿版' },
            { id: 'carbon', name: '碳素' },
            { id: 'cyanotype', name: '蓝晒' },
            { id: 'vandyke', name: '范戴克' }
        ];
    }
    
    // 将分类数据存储在全局，以便 Lightbox 使用
    window.galleryCategories = categories;
    
    // 生成筛选按钮
    if (filterContainer) {
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-category="all">全部</button>
            ${categories.map(cat => `
                <button class="filter-btn" data-category="${cat.id}">${cat.name}</button>
            `).join('')}
        `;
    }
    
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 从 Supabase 加载作品
    let photos = [];
    try {
        if (window.supabase && typeof window.supabase.select === 'function') {
            const { data } = await window.supabase.select('photos', {
                filter: { is_active: true },
                order: { field: 'sort_order', ascending: true }
            });
            photos = data || [];
        } else {
            console.warn('supabase not ready, using empty photos');
            photos = [];
        }
    } catch (error) {
        console.warn('加载作品失败，使用空列表:', error.message);
        photos = [];
    }

    // 获取分类名称的辅助函数
    function getCategoryName(categoryId) {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : categoryId;
    }

    // 渲染作品
    function renderWorks(category = 'all') {
        const filteredPhotos = category === 'all' 
            ? photos 
            : photos.filter(photo => photo.category === category);

        gallery.innerHTML = '';

        if (filteredPhotos.length === 0) {
            gallery.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <p style="font-size: 1.1rem;">暂无作品</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">请到后台管理添加作品</p>
                </div>
            `;
            return;
        }

        filteredPhotos.forEach((photo, index) => {
            const workItem = document.createElement('div');
            workItem.className = 'work-item';
            workItem.dataset.category = photo.category;
            workItem.dataset.index = index;

            workItem.innerHTML = `
                <img src="${photo.thumbnail_url}" alt="${photo.title}" loading="lazy">
                <div class="work-overlay">
                    <h3>${photo.title}</h3>
                    <p>${getCategoryName(photo.category)} • ${photo.year}</p>
                </div>
            `;

            // 点击打开 Lightbox
            workItem.addEventListener('click', function() {
                const globalIndex = photos.findIndex(p => p.id === photo.id);
                openLightbox(globalIndex);
            });

            gallery.appendChild(workItem);

            // 添加延迟动画
            setTimeout(() => {
                workItem.classList.add('visible');
            }, index * 50);
        });

        // 重新初始化滚动动画
        initScrollAnimations();
    }

        // 筛选功能
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;

                // 更新按钮状态
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // 渲染作品
                renderWorks(category);
            });
        });

    // 初始渲染
    renderWorks();
}

/**
 * Lightbox 功能
 */
async function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; // 如果lightbox不存在，直接返回

    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const progress = lightbox.querySelector('.lightbox-progress');

    let currentIndex = 0;
    let photos = [];

    // 从 Supabase 加载作品
    try {
        if (window.supabase && typeof window.supabase.select === 'function') {
            const { data } = await window.supabase.select('photos', {
                filter: { is_active: true },
                order: { field: 'sort_order', ascending: true }
            });
            photos = data || [];
        } else {
            console.warn('supabase not ready, using empty photos');
            photos = [];
        }
    } catch (error) {
        console.warn('加载作品失败，使用空列表:', error.message);
        photos = [];
    }

    // 分类名称映射 - 从全局变量获取
    const categories = window.galleryCategories || [];
    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : id;
    };

    // 创建进度指示器
    photos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `progress-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => openLightbox(index));
        if (progress) progress.appendChild(dot);
    });

    // 打开 Lightbox
    window.openLightbox = function(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 关闭 Lightbox
    window.closeLightbox = function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // 更新 Lightbox 内容
    async function updateLightbox() {
        const photo = photos[currentIndex];
        
        if (lightboxImg) {
            lightboxImg.src = photo.image_url;
            lightboxImg.alt = photo.title;
        }
        
        if (lightboxTitle) {
            lightboxTitle.textContent = photo.title;
        }
        
        if (lightboxMeta) {
            lightboxMeta.textContent = `${getCategoryName(photo.category)} • ${photo.year}`;
        }
        
        // 更新属性显示
        const attributesContainer = document.getElementById('lightboxAttributes');
        if (attributesContainer && photo.attributes) {
            try {
                const { data: attributes } = await window.supabase.getAttributes();
                
                const attrHtml = attributes
                    .filter(attr => photo.attributes[attr.id])
                    .map(attr => {
                        const value = photo.attributes[attr.id];
                        return `
                            <div class="lightbox-attribute">
                                <span class="lightbox-attribute-label">${attr.name}:</span>
                                ${value}${attr.unit ? ` ${attr.unit}` : ''}
                            </div>
                        `;
                    })
                    .join('');
                
                attributesContainer.innerHTML = attrHtml;
            } catch (error) {
                console.error('加载属性失败:', error);
                attributesContainer.innerHTML = '';
            }
        }

        // 更新进度指示器
        if (progress) {
            const dots = progress.querySelectorAll('.progress-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    // 上一张
    function prevPhoto() {
        currentIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
        updateLightbox();
    }

    // 下一张
    function nextPhoto() {
        currentIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
        updateLightbox();
    }

    // 绑定事件
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);

    // 点击背景关闭
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevPhoto();
                break;
            case 'ArrowRight':
                nextPhoto();
                break;
        }
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextPhoto();
            } else {
                prevPhoto();
            }
        }
    }
}

/**
 * 联系表单功能
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 获取表单数据
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // 简单验证
        if (!data.name || !data.email || !data.message) {
            showNotification('请填写所有字段', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('请输入有效的邮箱地址', 'error');
            return;
        }

        // 模拟发送
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        // 模拟网络请求
        setTimeout(() => {
            showNotification('消息已发送！我们会尽快回复您。', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// 验证邮箱格式
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 移除已存在的通知
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // 样式
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 32px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        animation: 'slideUp 0.3s ease',
        backgroundColor: type === 'success' ? '#333' : '#e53935'
    });

    // 添加动画样式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            @keyframes slideDown {
                from { opacity: 1; transform: translate(-50%, 0); }
                to { opacity: 0; transform: translate(-50%, 20px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * 滚动动画功能
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.work-item');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * 图片懒加载优化
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.removeAttribute('loading');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * 页面加载完成后初始化懒加载
 */
window.addEventListener('load', initLazyLoad);

/**
 * 加载关于我信息
 */
async function loadAboutInfo() {
    console.log('========================================');
    console.log('[loadAboutInfo] 开始加载关于我信息...');

    try {
        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadAboutInfo] 等待 supabase 初始化...');
            // 最多等待 5 秒
            for (let i = 0; i < 50; i++) {
                await new Promise(r => setTimeout(r, 100));
                console.log('[loadAboutInfo] 检查 #' + (i+1) + ': window.supabase=' + 
                           (window.supabase ? '已定义, isLoaded=' + window.supabase.isLoaded : '未定义'));
                if (window.supabase && window.supabase.isLoaded) {
                    console.log('[loadAboutInfo] ✓ supabase 已就绪');
                    break;
                }
            }
        }

        // 再次检查
        if (!window.supabase || typeof window.supabase.getAbout !== 'function') {
            console.warn('[loadAboutInfo] supabase 初始化失败, 跳过');
            return;
        }

        const { data: aboutData, error } = await window.supabase.getAbout();

        if (error) {
            console.warn('[loadAboutInfo] 获取关于我信息失败:', error.message);
            return;
        }

        console.log('[loadAboutInfo] 获取到原始数据:', aboutData);
        
        if (aboutData) {
            // 更新头像
            if (aboutData.avatar_url) {
                const avatarImg = document.getElementById('about-avatar');
                if (avatarImg) {
                    avatarImg.src = aboutData.avatar_url;
                    console.log('[loadAboutInfo] ✓ 已更新头像');
                } else {
                    console.error('[loadAboutInfo] ✗ 未找到头像元素 #about-avatar');
                }
            } else {
                console.log('[loadAboutInfo] avatar_url 为空');
            }
            
            // 更新姓名
            if (aboutData.name) {
                const nameEl = document.getElementById('about-name');
                if (nameEl) {
                    nameEl.textContent = aboutData.name;
                    console.log('[loadAboutInfo] ✓ 已更新姓名:', aboutData.name);
                }
            }
            
            // 更新头衔
            if (aboutData.title) {
                const titleEl = document.getElementById('about-title');
                if (titleEl) {
                    titleEl.textContent = aboutData.title;
                    console.log('[loadAboutInfo] ✓ 已更新头衔:', aboutData.title);
                }
            }
            
            // 更新简介
            if (aboutData.bio) {
                const bioEl = document.getElementById('about-bio');
                if (bioEl) {
                    const paragraphs = aboutData.bio.split('\n').filter(p => p.trim());
                    bioEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
                    console.log('[loadAboutInfo] ✓ 已更新简介');
                }
            }
            
            // 更新联系方式
            if (aboutData.contact) {
                const contactEl = document.getElementById('about-contact');
                if (contactEl) {
                    contactEl.style.display = 'block';
                    contactEl.innerHTML = `
                        <div style="margin: 20px 0; padding: 20px; background: var(--bg-secondary); border-radius: 8px;">
                            <h4 style="margin-bottom: 15px; color: var(--text-primary);">联系方式</h4>
                            <p style="white-space: pre-wrap; color: var(--text-secondary); line-height: 1.8;">${aboutData.contact}</p>
                        </div>
                    `;
                    console.log('[loadAboutInfo] ✓ 已更新联系方式');
                }
            }
            
            // 更新社交媒体二维码
            console.log('[loadAboutInfo] 检查二维码字段...');
            console.log('[loadAboutInfo] xiaohongshu_qrcode:', aboutData.xiaohongshu_qrcode ? '有数据 (' + aboutData.xiaohongshu_qrcode.length + ' 字符)' : '空');
            console.log('[loadAboutInfo] bilibili_qrcode:', aboutData.bilibili_qrcode ? '有数据 (' + aboutData.bilibili_qrcode.length + ' 字符)' : '空');
            
            const qrCodesContainer = document.getElementById('qr-codes');
            console.log('[loadAboutInfo] qr-codes 元素:', qrCodesContainer ? '找到' : '未找到');
            
            if (qrCodesContainer) {
                let hasQRCode = false;
                
                // 小红书二维码
                console.log('[loadAboutInfo] 检查小红书二维码...');
                const xhsQR = document.getElementById('qr-xiaohongshu');
                console.log('[loadAboutInfo] qr-xiaohongshu 元素:', xhsQR ? '找到' : '未找到');
                
                if (aboutData.xiaohongshu_qrcode && xhsQR) {
                    const xhsImg = xhsQR.querySelector('.qr-code-img');
                    console.log('[loadAboutInfo] 小红书图片元素:', xhsImg ? '找到' : '未找到');
                    
                    if (xhsImg) {
                        xhsImg.src = aboutData.xiaohongshu_qrcode;
                        xhsQR.style.display = 'flex';
                        hasQRCode = true;
                        console.log('[loadAboutInfo] ✓ 已更新小红书二维码');
                    }
                } else if (!aboutData.xiaohongshu_qrcode) {
                    console.log('[loadAboutInfo] 小红书二维码数据为空，不显示');
                }
                
                // B站二维码
                console.log('[loadAboutInfo] 检查B站二维码...');
                const biliQR = document.getElementById('qr-bilibili');
                console.log('[loadAboutInfo] qr-bilibili 元素:', biliQR ? '找到' : '未找到');
                
                if (aboutData.bilibili_qrcode && biliQR) {
                    const biliImg = biliQR.querySelector('.qr-code-img');
                    console.log('[loadAboutInfo] B站图片元素:', biliImg ? '找到' : '未找到');
                    
                    if (biliImg) {
                        biliImg.src = aboutData.bilibili_qrcode;
                        biliQR.style.display = 'flex';
                        hasQRCode = true;
                        console.log('[loadAboutInfo] ✓ 已更新B站二维码');
                    }
                } else if (!aboutData.bilibili_qrcode) {
                    console.log('[loadAboutInfo] B站二维码数据为空，不显示');
                }
                
                // 如果有二维码，显示容器
                if (hasQRCode) {
                    qrCodesContainer.style.display = 'flex';
                    console.log('[loadAboutInfo] ✓ 显示二维码容器');
                } else {
                    qrCodesContainer.style.display = 'none';
                    console.log('[loadAboutInfo] 隐藏二维码容器（没有二维码数据）');
                }
            }
        } else {
            console.log('[loadAboutInfo] aboutData 为空');
        }
        
        console.log('[loadAboutInfo] 加载完成');
        console.log('========================================');
    } catch (error) {
        console.error('[loadAboutInfo] 加载关于我信息时发生错误:', error);
        console.error('[loadAboutInfo] 错误堆栈:', error.stack);
    }
}

/**
 * 加载联系信息
 */
async function loadContactInfo() {
    console.log('[loadContactInfo] 开始加载联系信息...');
    try {
        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadContactInfo] 等待 supabase 初始化...');
            // 最多等待 5 秒
            for (let i = 0; i < 50; i++) {
                await new Promise(r => setTimeout(r, 100));
                console.log('[loadContactInfo] 检查 #' + (i+1) + ': window.supabase=' + 
                           (window.supabase ? '已定义, isLoaded=' + window.supabase.isLoaded : '未定义'));
                if (window.supabase && window.supabase.isLoaded) {
                    console.log('[loadContactInfo] ✓ supabase 已就绪');
                    break;
                }
            }
        }

        // 再次检查
        if (!window.supabase || typeof window.supabase.getAbout !== 'function') {
            console.warn('[loadContactInfo] supabase 初始化失败, 跳过');
            return;
        }

        const { data: aboutData, error } = await window.supabase.getAbout();

        if (error) {
            console.warn('[loadContactInfo] 获取联系信息失败:', error.message);
            return;
        }

        console.log('[loadContactInfo] 获取到联系数据:', aboutData);
        
        if (aboutData && aboutData.contact) {
            // 简单的联系方式解析
            const contactLines = aboutData.contact.split('\n');
            const contactMap = {};
            
            contactLines.forEach(line => {
                line = line.trim();
                if (line.includes('@') || line.includes('邮箱')) {
                    const email = line.match(/[\w.-]+@[\w.-]+\.\w+/);
                    if (email) {
                        const emailEl = document.getElementById('contact-email');
                        if (emailEl) emailEl.textContent = email[0];
                    }
                } else if (line.match(/(\+86)?\d{3,4}[\s-]?\d{7,8}/)) {
                    const phone = line.match(/(\+86)?[\s-]?1\d{10}|((\+86)?\d{3,4}[\s-]?\d{7,8})/);
                    if (phone) {
                        const phoneEl = document.getElementById('contact-phone');
                        if (phoneEl) phoneEl.textContent = phone[0];
                    }
                }
            });
        }
    } catch (error) {
        console.error('[loadContactInfo] 加载联系信息时发生错误:', error);
    }
}

