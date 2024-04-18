@echo off
start powershell -Command "npm run build; pipenv run python manage.py runserver"
explorer "http://localhost:8000/"