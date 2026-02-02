# PHOTOGRAPHER - GitHub 推送脚本（简化版）
# 作者: Matrix Agent
# 日期: 2026-02-02

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub 推送脚本 - 摄影网站项目" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查 Git 是否安装
Write-Host "[1/6] 检查 Git 安装..." -ForegroundColor Yellow
$gitInstalled = $false
try {
    $version = git --version
    Write-Host "  OK - Git 已安装: $version" -ForegroundColor Green
    $gitInstalled = $true
} catch {
    Write-Host "  ERROR - Git 未安装!" -ForegroundColor Red
    Write-Host "  请先安装 Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  安装后必须:" -ForegroundColor Yellow
    Write-Host "  1. 勾选 'Add Git to PATH'" -ForegroundColor Yellow
    Write-Host "  2. 重启 PowerShell" -ForegroundColor Yellow
    exit 1
}

# 2. 配置用户信息
Write-Host ""
Write-Host "[2/6] 配置用户信息..." -ForegroundColor Yellow
git config --global user.name "ken"
git config --global user.email "happyyuge1518@126.com"
Write-Host "  OK - 用户信息已配置" -ForegroundColor Green

# 3. 初始化仓库
Write-Host ""
Write-Host "[3/6] 初始化 Git 仓库..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "  OK - 已经是 Git 仓库" -ForegroundColor Green
} else {
    git init
    git branch -M main
    Write-Host "  OK - 仓库已初始化" -ForegroundColor Green
}

# 4. 添加文件
Write-Host ""
Write-Host "[4/6] 添加文件到暂存区..." -ForegroundColor Yellow
git add .
Write-Host "  OK - 文件已添加" -ForegroundColor Green

# 5. 提交
Write-Host ""
Write-Host "[5/6] 提交更改..." -ForegroundColor Yellow
$commitMsg = "Initial commit: 摄影网站基础项目 - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit-m $commitMsg
Write-Host "  OK - 已提交" -ForegroundColor Green

# 6. 推送到 GitHub
Write-Host ""
Write-Host "[6/6] 推送到 GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "请先在 GitHub 创建仓库:" -ForegroundColor Yellow
Write-Host "  1. 访问 https://github.com" -ForegroundColor Yellow
Write-Host "  2. 点击右上角 + → New repository" -ForegroundColor Yellow
Write-Host "  3. 仓库名: photographer-portfolio" -ForegroundColor Yellow
Write-Host "  4. 不要勾选 'Add a README file'" -ForegroundColor Yellow
Write-Host "  5. 点击 Create repository" -ForegroundColor Yellow
Write-Host ""

$repoUrl = Read-Host "请粘贴 GitHub 仓库地址 (例如: https://github.com/ken/photographer-portfolio.git)"
Write-Host ""

if ($repoUrl.Trim() -ne "") {
    Write-Host "  设置远程仓库..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin $repoUrl
    
    Write-Host "  推送到 GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  成功! 项目已推送到 GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  ERROR - 推送失败" -ForegroundColor Red
        Write-Host "  请检查:" -ForegroundColor Yellow
        Write-Host "  1. 仓库地址是否正确" -ForegroundColor Yellow
        Write-Host "  2. 是否有 GitHub 账户" -ForegroundColor Yellow
        Write-Host "  3. 网络连接是否正常" -ForegroundColor Yellow
    }
} else {
    Write-Host "  已跳过推送" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  稍后可以手动推送:" -ForegroundColor Yellow
    Write-Host "  git remote add origin 您的仓库地址" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "完成!" -ForegroundColor Cyan
