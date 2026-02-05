#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
直接修改 admin.html 中的上传调用为压缩上传
"""

def fix_uploads():
    file_path = 'C:\\Users\\kenzh\\.minimax-agent-cn\\projects\\4\\kenspace_backup\\admin.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = 0
    
    # 1. Banner 上传
    if "await window.supabase.uploadBanner(file)" in content:
        content = content.replace(
            "await window.supabase.uploadBanner(file)",
            "await window.supabase.uploadAndCompress(file, 'banners', 'banner')"
        )
        count += 1
        print("✅ Banner 上传: 已修改为 uploadAndCompress")
    
    # 2. 作品图片上传
    if "await window.supabase.uploadPhoto(file)" in content:
        content = content.replace(
            "await window.supabase.uploadPhoto(file)",
            "await window.supabase.uploadAndCompress(file, 'photos', 'photo')"
        )
        count += 1
        print("✅ 作品图片上传: 已修改为 uploadAndCompress")
    
    # 3. 头像上传
    if "await window.supabase.uploadAvatar(file)" in content:
        content = content.replace(
            "await window.supabase.uploadAvatar(file)",
            "await window.supabase.uploadAndCompress(file, 'avatars', 'avatar')"
        )
        count += 1
        print("✅ 头像上传: 已修改为 uploadAndCompress")
    
    # 4. 小红书二维码
    if "await window.supabase.uploadQRCode(file, 'xiaohongshu')" in content:
        content = content.replace(
            "await window.supabase.uploadQRCode(file, 'xiaohongshu')",
            "await window.supabase.uploadAndCompress(file, 'qrcodes/xiaohongshu', 'qrcode')"
        )
        count += 1
        print("✅ 小红书二维码: 已修改为 uploadAndCompress")
    
    # 5. B站二维码
    if "await window.supabase.uploadQRCode(file, 'bilibili')" in content:
        content = content.replace(
            "await window.supabase.uploadQRCode(file, 'bilibili')",
            "await window.supabase.uploadAndCompress(file, 'qrcodes/bilibili', 'qrcode')"
        )
        count += 1
        print("✅ B站二维码: 已修改为 uploadAndCompress")
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print()
    print("=" * 60)
    print(f"✅ 成功修改 {count} 处上传调用！")
    print("=" * 60)

if __name__ == '__main__':
    fix_uploads()
