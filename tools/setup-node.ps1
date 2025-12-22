# 使用法: .\tools\setup-node.ps1

# ターミナルの文字化けを防ぐためにUTF-8を設定
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$NodeDir = Join-Path $PSScriptRoot "node"

if (-not (Test-Path "$NodeDir\node.exe")) {
    Write-Host "エラー: $NodeDir\node.exe が見つかりません。" -ForegroundColor Red
    Write-Host "Node.js (Windows ZIP版) をダウンロードして $NodeDir に展開してください。"
    return
}

Write-Host "Node.js のパスを現在セッションの PATH に追加します: $NodeDir" -ForegroundColor Cyan

# PATHの先頭に追加して優先度を上げる
$env:PATH = "$NodeDir;" + $env:PATH

# 確認
$nodeVersion = node -v
Write-Host "現在の Node.js バージョン: $nodeVersion" -ForegroundColor Green
Write-Host "セットアップ完了。このターミナルで npm install や npm run dev が可能です。"
