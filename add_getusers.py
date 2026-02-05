#!/usr/bin/env python3

# 添加 getUsers() 方法到 supabase.js

file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\supabase.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找 saveUsers 方法结束后的位置
old = '''        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    initializeDefaults() {'''

new = '''        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 获取用户列表
    async getUsers() {
        if (!this.isLoaded) await this.loadAll();
        return { users: this.users, error: null };
    }

    initializeDefaults() {'''

if old in content:
    content = content.replace(old, new)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已添加 getUsers() 方法")
else:
    print("❌ 未找到插入位置")
