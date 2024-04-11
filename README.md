# <div align="center"> Django-React template/start project with JWT authentication</div>
<br>

> The goal of this repository is to provide a basic template or a starting point for a Django web application, using React as the frontend. If you find it useful, you can download the zip file and start your own project. 
---

### Features
:clipboard: ` Custom User Model ` :raising_hand: ` Sign up ` :unlock: ` Sign in ` :key: ` JWT authentication ` :arrows_clockwise: ` Change password ` :white_check_mark: ` Reset password ` :x: ` Delete User `

### Stack
` Django ` ` Django REST framework ` ` ReactJS ` ` PostgreSQL ` ` Bootstrap ` ` CSS `

### Prerequisites
[`Python 3.11.5`](https://www.python.org/downloads/) [`Pipenv`](https://pypi.org/project/pipenv/) [`Django`](https://www.djangoproject.com/) [`PostgreSQL`](https://www.postgresql.org/download/) [`Node`](https://nodejs.org/en/download) [`nvm`](https://github.com/nvm-sh/nvm)

### Variables
```
# .env

SECRET_KEY=<django_secret_key>
DEBUG=True
DATABASE_URL=postgres://postgres:<db_password>@localhost:5432/<db_name>
SSL_REQUIRE=False
EMAIL_USER=<email_address>
EMAIL_PASSWORD=<email_password>
REACT_APP_BASE_URL=http://localhost:8000
```

## Getting Started
#### :point_right: Download the zip file
#### :point_right: Install the required python libraries and packages:
```
pipenv install -r requirements.txt
```
#### :point_right: Create postgres database on your local system
#### :point_right: Download & install postgres
#### :point_right: Create database:
```
psql -U postgres
```
```
CREATE DATABASE <db_name> WITH OWNER postgres;
```
#### :point_right: Activate the virtual environment and migrate the models to database:
> #### :memo: _Set the project directory in the CLI_ 
```
pipenv shell
```
```
python manage.py migrate
```
#### :point_right: Install node modules and build:
```
npm install
```
```
npm run build
```
#### :point_right: Run on localhost:
```
python manage.py runserver
```
#### :triumph: Finally, initialize your own git repo and commit/push to github :clap: