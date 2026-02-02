# Git 安装指南 - Windows

## 方法 1: 使用安装包（推荐）

### 步骤 1: 下载 Git
1. 打开浏览器访问：https://git-scm.com/download/win
2. 页面会自动检测Windows版本
3. 点击 "Click here to download" 下载安装包

### 步骤 2: 安装 Git
1. **双击下载的 `Git-*.exe` 文件**
2. **许可证** → 点击 "Next"
3. **选择安装位置** → 建议保持默认 `C:\Program Files\Git` → Next
4. **选择组件** → 确保勾选：
   - ✅ "Additional icons" (桌面图标)
   - ✅ "Windows Explorer integration" (资源管理器集成)
   - ✅ "Git LFS (Large File Support)" (大文件支持)
   - ✅ "Add Git to PATH" **非常重要！**
   - ✅ "Use a TrueType font" 
5. **选择编辑器** → 选择您喜欢的编辑器（或保持默认）→ Next
6. **初始化分支名** → 选择 "Let Git decide" (或 "main") → Next
7. **PATH 环境变量** → 选择 "Git from the command line and also from 3rd-party software" → Next
8. **SSH 可执行文件** → 选择 "Use bundled OpenSSH" → Next
9. **传输后端** → 选择 "Use the OpenSSL library" → Next
10. **行尾符** → 选择 "Checkout Windows-style, commit Unix-style line endings" → Next
11. **终端模拟器** → 选择 "Use MinTTY" → Next
12. **git pull 行为** → 选择 "Default (fast-forward or merge)" → Next
13. **凭据助手** → 选择 "Git Credential Manager" → Next
14. **实验性选项** → 不勾选任何选项 → Install

### 步骤 3: 完成安装
1. 等待安装完成（通常1-2分钟）
2. 勾选 "View Release Notes" → Finish

### 步骤 4: 验证安装
1. **关闭所有PowerShell窗口**
2. **重新打开PowerShell**（必须重启才能加载新的PATH）
3. 运行：
   ```powershell
   git --version
   ```
4. 如果显示类似 `git version 2.44.0.windows.1` 则安装成功

---

## 方法 2: 使用 Chocolatey（如果已安装）

```powershell
chocolatey install git
```

---

## 方法 3: 使用 Scoop（如果已安装）

```powershell
scoop install git
```

---

## 常见问题解决

### 问题 1: 安装后 git 命令找不到

**原因**: PowerShell 没有重启，PATH 环境变量未更新

**解决**:
```powershell
# 关闭当前PowerShell窗口
# 重新打开一个新的PowerShell窗口
# 然后再运行
git --version
```

### 问题 2: PATH 环境变量问题

**手动检查**:
1. 右键 "此电脑" → "属性"
2. 点击 "高级系统设置"
3. 点击 "环境变量"
4. 在 "系统变量" 中找到 "Path"
5. 确保包含以下路径（如果没有，手动添加）：
   ```
   C:\Program Files\Git\cmd
   C:\Program Files\Git\bin
   C:\Program Files\Git\usr\bin
   ```

### 问题 3: 权限问题

如果遇到权限错误：
1. 以管理员身份运行 PowerShell
2. 右键 PowerShell 图标 → "以管理员身份运行"

---

## 安装后配置

安装完成后，运行以下命令配置用户信息：

```powershell
# 配置用户名
git config --global user.name "ken"

# 配置邮箱（建议使用GitHub邮箱）
git config --global user.email "happyyuge1518@126.com"

# 配置默认分支名
git config --global init.default main

# 配置换行符（Windows）
git config --global core.autocrlf true

# 配置颜色显示
git config --global color.ui auto

# 查看所有配置
git config --list --show-origin
```

---

## 下一步

Git 安装成功后，继续执行：

1. **创建 GitHub 仓库**
   - 访问 https://github.com
   - 点击 "+" → "New repository"
   - 仓库名: `photographer-portfolio`
   - 不要勾选 "Add a README file"
   - 点击 "Create repository"

2. **推送项目**
   ```powershell
   cd C:\Users\kenzh\.minimax-agent-cn\projects\4
   .\push-to-github.ps1
   ```

3. **按照 PROJECT_SETUP_GUIDE.md 完成剩余步骤**

---

## Git 安装检查清单

- [ ] 下载 Git 安装包
- [ ] 运行安装程序
- [ ] 勾选 "Add Git to PATH"
- [ ] 完成安装
- [ ] 重启 PowerShell
- [ ] 运行 `git --version` 验证
- [ ] 配置用户信息
- [ ] 测试推送项目

完成以上步骤后，您就可以使用Git管理项目代码了！🎉
