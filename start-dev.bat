@echo off
rem ポータブル nodejs へのパスを通した Windows Terminal を複数起動するスクリプト

set DIR=%~dp0
rem 末尾の \ を削除（残しておくと後続処理で " がエスケープされてエラーになる）
set DIR=%DIR:~0,-1%
set NODE_PATH=%DIR%\tools\node

rem PowerShell側のコマンド（;はエスケープする）
set SHELL_CMD=powershell -NoExit -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\; $env:PATH='%NODE_PATH%\;'+$env:PATH"

REM Windows Terminal を起動。
wt           -d "%DIR%" %SHELL_CMD%^
; split-pane -d "%DIR%" %SHELL_CMD%^
; split-pane -d "%DIR%" %SHELL_CMD%