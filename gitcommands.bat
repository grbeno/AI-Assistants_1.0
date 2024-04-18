@echo off
set /p commitMessage=""
git status
git add .
git commit -m "%commitMessage%"
git push -u origin main