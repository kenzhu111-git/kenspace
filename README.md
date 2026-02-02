# PHOTOGRAPHER - 个人摄影作品网站

## 📝 项目简介

一个专注于极简主义摄影的个人作品集网站，展示风景、建筑、人像、城市、极简、街拍等摄影作品。

## 🚀 快速开始

### 1. 安装必要工具

#### 安装 Git
- 下载地址：https://git-scm.com/download/win
- 安装时勾选 "Add Git to PATH"
- 安装完成后重启终端

#### 验证安装
```powershell
git --version
```

### 2. 配置 Git

```powershell
# 设置用户名
git config --global user.name "您的名字"

# 设置邮箱（建议使用GitHub邮箱）
git config --global user.email "your@email.com"

# 配置换行符（Windows）
git config --global core.autocrlf true

# 设置默认编辑器
git config --global core.editor "code --wait"
```

### 3. 创建 GitHub 仓库

1. 打开 https://github.com
2. 登录您的账户
3. 点击右上角 "+" → "New repository"
4. 填写仓库信息：
   - Repository name: `photographer-portfolio`
   - Description: 个人摄影作品网站
   - 选择 Public 或 Private
   - **不要**勾选 "Add a README file"
5. 点击 "Create repository"

### 4. 初始化本地仓库

在项目目录下执行：

```powershell
# 进入项目目录
cd C:\Users\kenzh\.minimax-agent-cn\projects\4

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: 摄影网站基础项目"

# 关联GitHub仓库（替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/photographer-portfolio.git

# 推送到GitHub
git push -u origin main
```

### 5. 后续开发流程

```powershell
# 每天开始工作时
git pull origin main

# 编辑文件后，查看更改
git status

# 添加更改的文件
git add 文件名

# 提交更改
git commit -m "描述您的更改"

# 推送到GitHub
git push origin main
```

## 📁 项目结构

```
photographer-portfolio/
├── index.html          # 前端展示页面
├── admin.html          # 后台管理页面
├── styles.css          # 样式文件
├── script.js           # 前端交互逻辑
├── admin.js            # 后台管理逻辑
├── supabase.js         # Supabase集成
├── data.js             # 本地数据配置
├── assets/             # 资源文件夹
│   ├── images/         # 图片资源
│   └── uploads/        # 上传文件
├── .env.example        # 环境变量模板
├── .gitignore          # Git忽略配置
└── README.md           # 项目说明
```

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (数据库 + 存储)
- **托管**: 阿里云服务器

## ⚙️ 配置说明

### Supabase 配置

1. 登录 https://supabase.com
2. 进入您的项目 → Settings → API
3. 复制 Project URL 和 anon public key
4. 创建 `.env.local` 文件：
   ```env
   VITE_SUPABASE_URL=您的项目URL
   VITE_SUPABASE_ANON_KEY=您的anon密钥
   ```

### 数据库表结构

项目需要以下Supabase表：

1. **photos** - 摄影作品
   - id, title, description, category, year
   - thumbnail_url, image_url, is_active
   - sort_order, attributes, created_at

2. **categories** - 作品分类
   - id, name, description, sort_order

3. **attributes** - 自定义属性
   - id, name, description, unit

4. **about** - 关于信息
   - id, name, title, bio, avatar_url
   - email, phone, location

## 🎨 功能特性

### 前端页面
- ✅ 响应式导航栏
- ✅ Hero轮播展示
- ✅ 作品集瀑布流展示
- ✅ 图片灯箱预览
- ✅ 关于页面
- ✅ 联系表单
- ✅ 滚动动画效果
- ✅ SEO优化

### 后台管理
- ✅ 数据仪表盘
- ✅ 作品管理（增删改查）
- ✅ 分类管理
- ✅ 属性管理
- ✅ 关于我编辑
- ✅ 系统设置

## 📱 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 📄 许可证

MIT License - 可以自由使用和修改

## 🤝 贡献

欢迎提交Issue和Pull Request！
