<#
 .SYNOPSIS
    将项目推送到GitHub

 .DESCRIPTION
    初始化Git仓库并推送到GitHub

 .PARAMETER RepositoryUrl
    GitHub仓库地址

 .PARAMETER CommitMessage
    提交信息

 .EXAMPLE
    .\push-to-github.ps1 -RepositoryUrl "https://github.com/username/repo.git" -CommitMessage "Initial commit"
#>

param(
    [string]$RepositoryUrl = "",
    [string]$CommitMessage = ""
)

Write-Host "🚀 PHOTOGRAPHER - GitHub 推送脚本" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 检查Git是否安装
try {
    $gitVersion = git --version
    Write-Host "✓ Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git 未安装，请先安装 Git for Windows" -ForegroundColor Red
    Write-Host "  下载地址: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# 检查是否是Git仓库
$isGitRepo = Test-Path .git
if (-not $isGitRepo) {
    Write-Host "📦 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git branch -M main
} else {
    Write-Host "✓ 已经是 Git 仓库" -ForegroundColor Green
}

# 添加所有文件
Write-Host "📝 添加文件到暂存区..." -ForegroundColor Yellow
git add .

# 检查是否有文件需要提交
$status = git status --porcelain
if ($null -eq $status -or $status -eq "") {
    Write-Host "✓ 没有需要提交的文件" -ForegroundColor Green
} else {
    # 如果没有提供提交信息，提示用户输入
    if ([string]::IsNullOrEmpty($CommitMessage)) {
        Write-Host "📝 请输入提交信息:" -ForegroundColor Yellow
        $CommitMessage = Read-Host "Commit message"
        if ([string]::IsNullOrEmpty($CommitMessage)) {
            $CommitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
    }

    Write-Host "💾 提交更改: $CommitMessage" -ForegroundColor Yellow
    git commit -m $CommitMessage
}

# 设置远程仓库
if (-not [string]::IsNullOrEmpty($RepositoryUrl)) {
    Write-Host "🔗 设置远程仓库..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin $RepositoryUrl
}

# 推送到GitHub
Write-Host "📤 推送到 GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✓ 推送成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 项目已成功推送到 GitHub！" -ForegroundColor Cyan
} catch {
    Write-Host "✗ 推送失败: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查:" -ForegroundColor Yellow
    Write-Host "1. GitHub 仓库是否存在"
    Write-Host "2. 是否有推送权限"
    Write-Host "3. 网络连接是否正常"
}

Write-Host ""
Write-Host "📌 后续开发流程:" -ForegroundColor Cyan
Write-Host "  1. 编辑文件"
Write-Host "  2. git add ."
Write-Host "  3. git commit -m '描述'"
Write-Host "  4. git push origin main"
Write-Host ""
