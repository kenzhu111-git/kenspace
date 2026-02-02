<#
 .SYNOPSIS
    启动本地开发服务器

 .DESCRIPTION
    使用 Node.js 或 Python 启动静态文件服务器

 .EXAMPLE
    .\start-dev-server.ps1
#>

Write-Host "🚀 PHOTOGRAPHER - 启动本地开发服务器" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 检查可用工具
$hasNode = $false
$hasPython = $false

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 可用: $nodeVersion" -ForegroundColor Green
    $hasNode = $true
} catch {
    Write-Host "✗ Node.js 未安装" -ForegroundColor Yellow
}

# 检查 Python
try {
    $pythonVersion = python --version
    Write-Host "✓ Python 可用: $pythonVersion" -ForegroundColor Green
    $hasPython = $true
} catch {
    try {
        $pythonVersion = python3 --version
        Write-Host "✓ Python3 可用: $pythonVersion" -ForegroundColor Green
        $hasPython = $true
    } catch {
        Write-Host "✗ Python 未安装" -ForegroundColor Yellow
    }
}

Write-Host ""

# 选择启动方式
$choice = 0
if ($hasNode -and $hasPython) {
    Write-Host "请选择启动方式:" -ForegroundColor Yellow
    Write-Host "  [1] 使用 Node.js (推荐，需要安装 http-server)"
    Write-Host "  [2] 使用 Python (内置)"
    Write-Host "  [3] 使用浏览器直接打开 HTML 文件"
    $choice = Read-Host "请输入选择 (1-3)"
} elseif ($hasNode) {
    Write-Host "将使用 Node.js 启动" -ForegroundColor Yellow
    $choice = 1
} elseif ($hasPython) {
    Write-Host "将使用 Python 启动" -ForegroundColor Yellow
    $choice = 2
} else {
    Write-Host "将使用浏览器直接打开" -ForegroundColor Yellow
    $choice = 3
}

Write-Host ""

switch ($choice) {
    1 {
        # 使用 Node.js
        Write-Host "📦 启动方式: Node.js + http-server" -ForegroundColor Cyan
        try {
            # 检查是否有 http-server
            $hasHttpServer = $false
            try {
                http-server --version
                $hasHttpServer = $true
            } catch {
                Write-Host "⚠️ http-server 未安装，正在安装..." -ForegroundColor Yellow
                npm install -g http-server
                if ($LASTEXITCODE -eq 0) {
                    $hasHttpServer = $true
                }
            }

            if ($hasHttpServer) {
                Write-Host "🌐 启动服务器: http://localhost:8080" -ForegroundColor Green
                Write-Host ""
                Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
                Write-Host ""
                http-server . -p 8080 -c-1
            }
        } catch {
            Write-Host "✗ Node.js 启动失败: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "尝试使用备用方式..." -ForegroundColor Yellow
            Start-Process "index.html"
        }
    }

    2 {
        # 使用 Python
        Write-Host "📦 启动方式: Python SimpleHTTPServer" -ForegroundColor Cyan
        try {
            $port = 8000
            Write-Host "🌐 启动服务器: http://localhost:$port" -ForegroundColor Green
            Write-Host ""
            Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
            Write-Host ""

            if ($hasPython) {
                python -m http.server $port
            } else {
                python3 -m http.server $port
            }
        } catch {
            Write-Host "✗ Python 启动失败: $_" -ForegroundColor Red
        }
    }

    3 {
        # 直接用浏览器打开
        Write-Host "🌐 将在浏览器中打开项目" -ForegroundColor Cyan
        Write-Host ""
        $htmlFiles = Get-ChildItem *.html

        if ($htmlFiles.Count -gt 0) {
            Write-Host "找到以下页面:" -ForegroundColor Yellow
            for ($i = 0; $i -lt $htmlFiles.Count; $i++) {
                Write-Host "  [$($i+1)] $($htmlFiles[$i].Name)"
            }

            $selection = Read-Host "请选择要打开的页面 (1-$($htmlFiles.Count))"
            if ($selection -match '^\d+$' -and $selection -gt 0 -and $selection -le $htmlFiles.Count) {
                $filePath = $htmlFiles[$selection - 1].FullName
                Write-Host "打开: $filePath" -ForegroundColor Green
                Start-Process "file://$filePath"
            } else {
                Write-Host "无效选择" -ForegroundColor Red
            }
        } else {
            Write-Host "未找到 HTML 文件" -ForegroundColor Red
        }
    }

    default {
        Write-Host "无效选择" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ 开发服务器已启动" -ForegroundColor Green
