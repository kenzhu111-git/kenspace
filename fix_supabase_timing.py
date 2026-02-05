#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 script.js 中的 supabase 初始化时序问题
确保数据完全加载后再执行后续操作
"""

def fix_supabase_timing():
    # 读取文件
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\script.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 修复 loadAboutInfo 函数
    old_about = '''async function loadAboutInfo() {
    console.log('========================================');
    console.log('[loadAboutInfo] 开始加载关于我信息...');

    try {
        // 检查 supabase 是否可用
        if (!window.supabase || typeof window.supabase.getAbout !== 'function') {
            console.warn('[loadAboutInfo] supabase not ready, skipping');
            return;
        }

        const { data: aboutData, error } = await window.supabase.getAbout();'''

    new_about = '''async function loadAboutInfo() {
    console.log('========================================');
    console.log('[loadAboutInfo] 开始加载关于我信息...');

    try {
        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadAboutInfo] 等待 supabase 初始化...');
            // 最多等待 3 秒
            for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 100));
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

        const { data: aboutData, error } = await window.supabase.getAbout();'''

    # 修复 loadContactInfo 函数
    old_contact = '''async function loadContactInfo() {
    console.log('[loadContactInfo] 开始加载联系信息...');
    try {
        // 检查 supabase 是否可用
        if (!window.supabase || typeof window.supabase.getAbout !== 'function') {
            console.warn('[loadContactInfo] supabase not ready, skipping');
            return;
        }

        const { data: aboutData, error } = await window.supabase.getAbout();'''

    new_contact = '''async function loadContactInfo() {
    console.log('[loadContactInfo] 开始加载联系信息...');
    try {
        // 等待 supabase 初始化完成
        if (!window.supabase || !window.supabase.isLoaded) {
            console.log('[loadContactInfo] 等待 supabase 初始化...');
            // 最多等待 3 秒
            for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 100));
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

        const { data: aboutData, error } = await window.supabase.getAbout();'''

    fixes = []
    
    # 执行修复
    if old_about in content:
        content = content.replace(old_about, new_about)
        fixes.append("✅ loadAboutInfo: 添加 supabase 初始化等待机制")
    else:
        fixes.append("ℹ️ loadAboutInfo: 已修复或格式不同")
    
    if old_contact in content:
        content = content.replace(old_contact, new_contact)
        fixes.append("✅ loadContactInfo: 添加 supabase 初始化等待机制")
    else:
        fixes.append("ℹ️ loadContactInfo: 已修复或格式不同")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("🚀 script.js 初始化时序优化完成！")
    print("=" * 60)
    print()
    
    for fix in fixes:
        print(fix)
    
    print()
    print("📊 修复说明：")
    print("  之前的问题：")
    print("  - loadAboutInfo/loadContactInfo 在 supabase 还没初始化好时就执行")
    print("  - 导致 'supabase not ready' 警告")
    print()
    print("  解决方案：")
    print("  - 在检查 supabase 是否存在后，增加等待机制")
    print("  - 最多等待 3 秒（每 100ms 检查一次）")
    print("  - 期间显示 '等待 supabase 初始化...' 提示")
    print("  - 确保数据完全加载后再执行后续操作")
    print()
    print("💡 预期效果：")
    print("  - 不再出现 'supabase not ready' 警告")
    print("  - 关于我和联系信息能够正确加载")
    print("  - 加载过程有清晰的日志提示")

if __name__ == '__main__':
    fix_supabase_timing()
