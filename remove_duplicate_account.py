#!/usr/bin/env python3

# 删除重复的账户设置页面

file_path = r'C:\Users\kenzh\.minimax-agent-cn\projects\4\kenspace_backup\admin.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并删除第二个（重复的）账户设置页面
# 从 "<!-- Account Settings Page -->" 开始到 "</section>" 后面跟着 "</main>"

old = '''            <!-- Account Settings Page -->
            <section id="page-account" class="admin-page">
                <div class="page-header">
                    <h2>账户设置</h2>
                    <p>管理您的账户信息</p>
                </div>

                <div class="card">
                    <h3>当前账户信息</h3>
                    <div class="current-info">
                        <div class="label">用户名</div>
                        <div class="value" id="current-username">加载中...</div>
                    </div>
                    <div class="current-info">
                        <div class="label">账户角色</div>
                        <div class="value">管理员</div>
                    </div>
                </div>

                <div class="card">
                    <div class="account-tabs">
                        <button class="account-tab active" data-tab="username">修改用户名</button>
                        <button class="account-tab" data-tab="password">修改密码</button>
                    </div>

                    <!-- Username Tab -->
                    <div id="tab-username" class="tab-content active">
                        <form id="username-form">
                            <div class="form-group">
                                <label for="current-username-input">当前用户名</label>
                                <input type="text" id="current-username-input" readonly>
                            </div>
                            <div class="form-group">
                                <label for="new-username">新用户名 *</label>
                                <input type="text" id="new-username" required minlength="3" maxlength="20" placeholder="输入新用户名（3-20个字符）">
                            </div>
                            <div class="form-group">
                                <label for="confirm-username">确认新用户名 *</label>
                                <input type="text" id="confirm-username" required placeholder="再次输入新用户名">
                            </div>
                            <button type="submit" class="btn btn-primary">更新用户名</button>
                        </form>
                    </div>

                    <!-- Password Tab -->
                    <div id="tab-password" class="tab-content">
                        <form id="password-form">
                            <div class="form-group">
                                <label for="current-password">当前密码 *</label>
                                <input type="password" id="current-password" required placeholder="输入当前密码">
                            </div>
                            <div class="form-group">
                                <label for="new-password">新密码 *</label>
                                <input type="password" id="new-password" required minlength="6" placeholder="输入新密码（至少6个字符）">
                                <div class="password-strength">
                                    <div class="password-strength-bar" id="password-strength-bar"></div>
                                </div>
                                <p class="password-hint">密码强度指示器</p>
                            </div>
                            <div class="form-group">
                                <label for="confirm-new-password">确认新密码 *</label>
                                <input type="password" id="confirm-new-password" required placeholder="再次输入新密码">
                            </div>
                            <button type="submit" class="btn btn-primary">更新密码</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Category Modal -->'''

if old in content:
    content = content.replace(old, '    <!-- Category Modal -->')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ 已删除重复的账户设置页面")
else:
    print("❌ 未找到重复的账户设置页面")

print("\\n✅ 完成！")
