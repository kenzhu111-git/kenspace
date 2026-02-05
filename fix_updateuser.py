#!/usr/bin/env python3

# 修复updateUser方法中缺少更新this.users的问题

file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并修复updateUser方法
old = '''            // 如果要修改密码
            if (updates.new_password && updates.new_password.length >= 6) {
                userData.password_hash = this.hashPassword(updates.new_password);
            } else if (updates.new_password) {
                return { error: { message: '新密码长度至少6个字符' } };
            }

            // 保存用户数据
            const saveResult = await this.saveUsers([userData]);
            if (saveResult.error) {
                return { error: saveResult.error };
            }

            console.log('[Supabase] 用户信息更新成功');
            return { success: true, data: userData };'''

new = '''            // 如果要修改密码
            if (updates.new_password && updates.new_password.length >= 6) {
                userData.password_hash = this.hashPassword(updates.new_password);
            } else if (updates.new_password) {
                return { error: { message: '新密码长度至少6个字符' } };
            }

            // 更新this.users数组
            this.users = [userData];

            // 保存用户数据
            const saveResult = await this.saveUsers();
            if (saveResult.error) {
                return { error: saveResult.error };
            }

            console.log('[Supabase] 用户信息更新成功');
            return { success: true, data: userData };'''

if old in content:
    content = content.replace(old, new)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已修复updateUser方法：添加了this.users更新")
else:
    print("❌ 未找到需要修复的内容")
