@echo off
rem Double-click to view the portfolio locally.
cd /d "%~dp0"
start "" http://localhost:8123/
node serve.mjs 8123
