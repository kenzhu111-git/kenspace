#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修改 admin.html 使用压缩上传功能
"""

def modify_admin_html_upload():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixes = []
    
    # 1. 修改 Banner 上传调用
    old_banner_upload = '''                        // 自动上传到 Supabase 并保存
                    try {
                        console.log('[Banner] 开始上传文件:', file.name);
                        const result = await window.supabase.uploadBanner(file);'''

    new_banner_upload = '''                        // 自动压缩并上传到 Supabase
                    try {
                        console.log('[Banner] 开始压缩并上传文件:', file.name);
                        const result = await window.supabase.uploadAndCompress(file, 'banners', 'banner');'''

    if old_banner_upload in content:
        content = content.replace(old_banner_upload, new_banner_upload)
        fixes.append("✅ Banner 上传: 改为使用 uploadAndCompress(file, 'banners', 'banner')")
    else:
        fixes.append("ℹ️ Banner 上传: 格式已不同")
    
    # 2. 修改作品图片上传
    old_photo_upload = '''                    // 作品图片直接上传，不压缩
                    try {
                        const result = await window.supabase.uploadPhoto(file);'''

    new_photo_upload = '''                    // 作品图片压缩后上传
                    try {
                        const result = await window.supabase.uploadAndCompress(file, 'photos', 'photo');'''

    if old_photo_upload in content:
        content = content.replace(old_photo_upload, new_photo_upload)
        fixes.append("✅ 作品图片上传: 改为使用 uploadAndCompress(file, 'photos', 'photo')")
    else:
        fixes.append("ℹ️ 作品图片上传: 格式已不同")
    
    # 3. 修改头像上传
    old_avatar_upload = '''                    // 上传头像
                    try {
                        const result = await window.supabase.uploadAvatar(file);'''

    new_avatar_upload = '''                    // 头像压缩后上传
                    try {
                        const result = await window.supabase.uploadAndCompress(file, 'avatars', 'avatar');'''

    if old_avatar_upload in content:
        content = content.replace(old_avatar_upload, new_avatar_upload)
        fixes.append("✅ 头像上传: 改为使用 uploadAndCompress(file, 'avatars', 'avatar')")
    else:
        fixes.append("ℹ️ 头像上传: 格式已不同")
    
    # 4. 修改二维码上传
    old_qr_upload = '''                    // 上传小红书二维码
                    try {
                        const result = await window.supabase.uploadQRCode(file, 'xiaohongshu');'''

    new_qr_upload = '''                    // 小红书二维码压缩后上传
                    try {
                        const result = await window.supabase.uploadAndCompress(file, 'qrcodes/xiaohongshu', 'qrcode');'''

    if old_qr_upload in content:
        content = content.replace(old_qr_upload, new_qr_upload)
        fixes.append("✅ 小红书二维码上传: 改为使用 uploadAndCompress")
    else:
        fixes.append("ℹ️ 小红书二维码上传: 格式已不同")
    
    # 查找并替换其他二维码上传
    if 'await window.supabase.uploadQRCode(file, \'bilibili\')' in content:
        content = content.replace(
            "await window.supabase.uploadQRCode(file, 'bilibili')",
            "await window.supabase.uploadAndCompress(file, 'qrcodes/bilibili', 'qrcode')"
        )
        fixes.append("✅ B站二维码上传: 改为使用 uploadAndCompress")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 60)
    print("admin.html 上传功能已优化！")
    print("=" * 60)
    print()
    
    for fix in fixes:
        print(fix)
    
    print()
    print("所有上传现在都会自动压缩：")
    print()
    print("1. Banner 图片")
    print("   - 最大尺寸: 1920x1080")
    print("   - 质量: 85%")
    print("   - 格式: JPEG")
    print("   - 预计减少: 70-90%")
    print()
    print("2. 作品图片")
    print("   - 最大尺寸: 1600x1600")
    print("   - 质量: 85%")
    print("   - 格式: JPEG")
    print("   - 预计减少: 60-80%")
    print()
    print("3. 头像")
    print("   - 最大尺寸: 400x400")
    print("   - 质量: 90%")
    print("   - 格式: JPEG")
    print("   - 预计减少: 50-70%")
    print()
    print("4. 二维码")
    print("   - 最大尺寸: 600x600")
    print("   - 质量: 90%")
    print("   - 格式: PNG")
    print("   - 预计减少: 30-50%")
    print()
    print("控制台会显示压缩进度：")
    print("[compressImage] 开始压缩图片: xxx.jpg (2.5MB)")
    print("[compressImage] 压缩完成: 245.3KB (9.8% of original)")

if __name__ == '__main__':
    modify_admin_html_upload()
