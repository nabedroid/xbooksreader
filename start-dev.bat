@echo off
rem ポータブル nodejs へのパスを通した cmd を起動するスクリプト

set DIR="%~dp0"
set DIR="%DIR:~0,-1%"
set NODE_DIR="%DIR%\tools\node"

set CMD_STR=chcp 65001 ^& cd /d \"%DIR%\" ^& set \"PATH=%NODE_DIR%;%%PATH%%\"

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -Verb RunAs -ArgumentList '/k %CMD_STR%'"