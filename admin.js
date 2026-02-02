/**
 * 后台管理 JavaScript
 * PHOTOGRAPHER Admin Panel
 */

// 全局变量
let currentPage = 'dashboard';
let deleteTargetId = null;

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    initNavigation();
    await loadDashboard();
    await loadPhotos();
    await loadCategoryDropdown();
    await loadAttributeFields();
    initUploadForm();
    initImagePreview();
    initSettings();
    initModals();
});

/**
 * 初始化导航
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 切换活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 切换页面
            const page = this.dataset.page;
            showPage(page);
        });
    });
}

/**
 * 显示指定页面
 */
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.admin-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // 刷新页面数据
        switch(pageName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'photos':
                loadPhotos();
                break;
        }
    }
}

/**
 * 加载仪表盘数据
 */
async function loadDashboard() {
    // 加载统计数据
    const { data: photos } = await window.supabase.select('photos', {
        filter: { is_active: true }
    });
    
    if (photos) {
        document.getElementById('total-photos').textContent = photos.length;
        
        // 按分类统计
        const categories = photos.reduce((acc, photo) => {
            acc[photo.category] = (acc[photo.category] || 0) + 1;
            return acc;
        }, {});
        
        document.getElementById('total-landscape').textContent = categories.landscape || 0;
        document.getElementById('total-architecture').textContent = categories.architecture || 0;
        document.getElementById('total-portrait').textContent = categories.portrait || 0;
        
        // 最近添加的作品
        const recentList = document.getElementById('recent-photos');
        const recentPhotos = photos.slice(-4).reverse();
        
        recentList.innerHTML = recentPhotos.map(photo => `
            <div class="recent-item">
                <img src="${photo.thumbnail_url}" alt="${photo.title}">
                <div class="item-overlay">${photo.title}</div>
            </div>
        `).join('');
        
        if (photos.length === 0) {
            recentList.innerHTML = '<div class="empty-state"><p>暂无作品</p></div>';
        }
    }
}

/**
 * 加载作品列表
 */
async function loadPhotos() {
    const searchTerm = document.getElementById('search-photos')?.value?.toLowerCase() || '';
    const filterCategory = document.getElementById('filter-category')?.value || '';
    
    const { data: photos } = await window.supabase.select('photos', {
        order: { field: 'sort_order', ascending: true }
    });
    
    const tbody = document.getElementById('photos-list');
    
    if (!photos || photos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <div class="empty-state-icon">📷</div>
                        <h3>暂无作品</h3>
                        <p>点击"上传作品"添加您的第一张作品</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // 筛选和搜索
    let filteredPhotos = photos;
    
    if (filterCategory) {
        filteredPhotos = filteredPhotos.filter(p => p.category === filterCategory);
    }
    
    if (searchTerm) {
        filteredPhotos = filteredPhotos.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm)
        );
    }
    
    // 渲染表格
    tbody.innerHTML = filteredPhotos.map(photo => `
        <tr>
            <td><img src="${photo.thumbnail_url}" alt="${photo.title}"></td>
            <td><strong>${photo.title}</strong><br><small style="color: var(--text-muted)">${photo.description || ''}</small></td>
            <td><span class="category-badge">${getCategoryName(photo.category)}</span></td>
            <td>${photo.year || '-'}</td>
            <td>${photo.sort_order || 0}</td>
            <td><span class="status-badge ${photo.is_active ? 'active' : 'inactive'}">${photo.is_active ? '已发布' : '草稿'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="openEditModal('${photo.id}')">编辑</button>
                    <button class="action-btn delete" onclick="openDeleteModal('${photo.id}')">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 获取分类名称
 */
function getCategoryName(categoryId) {
    const names = {
        digital: '数码',
        film: '胶片',
        wetplate: '湿版',
        carbon: '碳素',
        cyanotype: '蓝晒',
        vandyke: '范戴克'
    };
    return names[categoryId] || categoryId;
}

/**
 * 加载分类下拉框
 */
async function loadCategoryDropdown() {
    const select = document.getElementById('photo-category');
    const filterSelect = document.getElementById('filter-category');
    
    try {
        const { data: categories } = await window.supabase.getCategories();
        
        const options = categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
        
        if (select) {
            select.innerHTML = `<option value="">选择分类</option>${options}`;
        }
        
        if (filterSelect) {
            filterSelect.innerHTML = `<option value="">全部分类</option>${options}`;
        }
    } catch (error) {
        console.error('加载分类失败:', error);
    }
}

/**
 * 加载属性字段
 */
async function loadAttributeFields() {
    const container = document.getElementById('attributes-fields');
    if (!container) return;
    
    try {
        const { data: attributes } = await window.supabase.getAttributes();
        
        if (!attributes || attributes.length === 0) {
            container.innerHTML = '<p style="color: #999; font-size: 0.9rem;">暂无属性配置</p>';
            return;
        }
        
        container.innerHTML = attributes.map(attr => `
            <div class="form-group" style="margin-bottom: 16px;">
                <label for="attr-${attr.id}">${attr.name}${attr.unit ? ` (${attr.unit})` : ''}</label>
                <input type="text" 
                       id="attr-${attr.id}" 
                       name="attr_${attr.id}" 
                       placeholder="输入${attr.name}${attr.unit ? ` (${attr.unit})` : ''}">
                ${attr.description ? `<small style="color: #999;">${attr.description}</small>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('加载属性失败:', error);
        container.innerHTML = '<p style="color: #999;">加载属性失败</p>';
    }
}

/**
 * 初始化上传表单
 */
function initUploadForm() {
    const form = document.getElementById('upload-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const progress = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        // 禁用按钮
        submitBtn.disabled = true;
        submitBtn.textContent = '上传中...';
        progress.style.display = 'block';
        
        try {
            // 收集表单数据
            const formData = {
                title: document.getElementById('photo-title').value,
                category: document.getElementById('photo-category').value,
                year: parseInt(document.getElementById('photo-year').value) || new Date().getFullYear(),
                sort_order: parseInt(document.getElementById('photo-sort').value) || 0,
                description: document.getElementById('photo-description').value
            };
            
            // 获取图片
            const thumbnailInput = document.getElementById('photo-thumbnail');
            const imageInput = document.getElementById('photo-full');
            
            // 模拟上传进度
            let progressValue = 0;
            const progressInterval = setInterval(() => {
                progressValue += 10;
                if (progressValue <= 90) {
                    progressFill.style.width = `${progressValue}%`;
                    progressText.textContent = `正在上传... ${progressValue}%`;
                }
            }, 200);
            
            // 上传图片
            if (thumbnailInput.files[0]) {
                const thumbResult = await window.supabase.upload('photos', `thumb_${Date.now()}.jpg`, thumbnailInput.files[0]);
                formData.thumbnail_url = thumbResult.data.path;
            }
            
            if (imageInput.files[0]) {
                const imgResult = await window.supabase.upload('photos', `full_${Date.now()}.jpg`, imageInput.files[0]);
                formData.image_url = imgResult.data.path;
            }
            
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            progressText.textContent = '保存数据...';
            
            // 保存到数据库
            const { error } = await window.supabase.insert('photos', formData);
            
            if (error) throw error;
            
            // 完成
            progressFill.style.width = '100%';
            progressText.textContent = '上传成功！';
            
            showToast('作品上传成功！', 'success');
            
            // 重置表单
            form.reset();
            document.getElementById('thumbnail-preview').innerHTML = '<span>点击或拖拽上传图片</span>';
            document.getElementById('thumbnail-preview').classList.remove('has-image');
            document.getElementById('full-preview').innerHTML = '<span>点击或拖拽上传图片</span>';
            document.getElementById('full-preview').classList.remove('has-image');
            
            // 延迟隐藏进度条
            setTimeout(() => {
                progress.style.display = 'none';
                progressFill.style.width = '0%';
                submitBtn.disabled = false;
                submitBtn.textContent = '上传作品';
                
                // 跳转到作品列表
                showPage('photos');
            }, 1000);
            
        } catch (error) {
            console.error('上传失败:', error);
            showToast('上传失败: ' + error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = '上传作品';
            progress.style.display = 'none';
        }
    });
}

/**
 * 初始化图片预览
 */
function initImagePreview() {
    const thumbnailInput = document.getElementById('photo-thumbnail');
    const fullInput = document.getElementById('photo-full');
    
    if (thumbnailInput) {
        thumbnailInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('thumbnail-preview');
                    preview.innerHTML = `<img src="${e.target.result}" alt="缩略图预览">`;
                    preview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (fullInput) {
        fullInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('full-preview');
                    preview.innerHTML = `<img src="${e.target.result}" alt="原图预览">`;
                    preview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 搜索和筛选
    const searchInput = document.getElementById('search-photos');
    const filterSelect = document.getElementById('filter-category');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadPhotos, 300));
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', loadPhotos);
    }
}

/**
 * 初始化设置页面
 */
function initSettings() {
    // 导出数据
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            const { data: photos } = await window.supabase.select('photos');
            const blob = new Blob([JSON.stringify(photos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `photos-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('数据已导出', 'success');
        });
    }
    
    // 导入数据
    const importBtn = document.getElementById('import-data');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async function(e) {
                        try {
                            const photos = JSON.parse(e.target.result);
                            for (const photo of photos) {
                                delete photo.id;
                                photo.is_active = true;
                                await window.supabase.insert('photos', photo);
                            }
                            showToast(`成功导入 ${photos.length} 条数据`, 'success');
                            loadDashboard();
                        } catch (error) {
                            showToast('导入失败: ' + error.message, 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });
    }
    
    // 清空数据
    const clearBtn = document.getElementById('clear-data');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('确定要清空所有数据吗？此操作不可撤销！')) {
                localStorage.removeItem('photos');
                showToast('数据已清空', 'success');
                loadDashboard();
                loadPhotos();
            }
        });
    }
}

/**
 * 初始化模态框
 */
function initModals() {
    // 编辑表单
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const id = document.getElementById('edit-id').value;
            const updates = {
                title: document.getElementById('edit-title').value,
                category: document.getElementById('edit-category').value,
                year: parseInt(document.getElementById('edit-year').value) || null,
                sort_order: parseInt(document.getElementById('edit-sort').value) || 0,
                description: document.getElementById('edit-description').value
            };
            
            const { error } = await window.supabase.update('photos', id, updates);
            
            if (error) {
                showToast('更新失败: ' + error.message, 'error');
            } else {
                showToast('作品已更新', 'success');
                closeEditModal();
                loadPhotos();
                loadDashboard();
            }
        });
    }
    
    // 删除确认
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            if (deleteTargetId) {
                const { error } = await window.supabase.delete('photos', deleteTargetId);
                
                if (error) {
                    showToast('删除失败: ' + error.message, 'error');
                } else {
                    showToast('作品已删除', 'success');
                    closeDeleteModal();
                    loadPhotos();
                    loadDashboard();
                }
            }
        });
    }
    
    // 点击背景关闭模态框
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

/**
 * 打开编辑模态框
 */
async function openEditModal(id) {
const { data: photo } = await window.supabase.getOne('photos', id);
    
    if (photo) {
        document.getElementById('edit-id').value = photo.id;
        document.getElementById('edit-title').value = photo.title || '';
        document.getElementById('edit-category').value = photo.category || '';
        document.getElementById('edit-year').value = photo.year || '';
        document.getElementById('edit-sort').value = photo.sort_order || 0;
        document.getElementById('edit-description').value = photo.description || '';
        
        document.getElementById('edit-modal').classList.add('active');
    }
}

/**
 * 关闭编辑模态框
 */
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

/**
 * 打开删除确认模态框
 */
function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('delete-modal').classList.add('active');
}

/**
 * 关闭删除确认模态框
 */
function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.remove('active');
}

/**
 * 显示 Toast 通知
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 全局函数（供 HTML onclick 调用）
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
