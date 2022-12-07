# Steps

## Setting up the environment

**This application uses [twilio](https://www.twilio.com/) to send sms and [sendGrid](https://sendgrid.com/) to send emails, In order to use it you a have to create an account in both twilio and sendGrid.**

### Cloning and pulling

Clone this repo using this command:

```bash
git clone https://github.com/youcefislam/Sina-Server.git
```

### Installing packages

Open terminal and install packages (only when you clone/pull):

```bash
npm install
```

### Database Configuration

1- Open MySQL Workbench and login with the root user.
2- Create the sina admin user for our database

```mysql
CREATE USER '<your database sina-main username>' IDENTIFIED WITH mysql_native_password BY '<your database sina-main password>';
CREATE USER '<your database sina-auth username>' IDENTIFIED WITH mysql_native_password BY '<your database sina-auth password>';
GRANT ALL PRIVILEGES ON sina.* TO '<your database sina-main username>';
GRANT ALL PRIVILEGES ON sina.* TO '<your database sina-auth username>';
GRANT ALL PRIVILEGES ON sinav1.* TO '<your database sina-main username>';
```

### Server Configuration

- Create a `.env` file and add this information to it:
  > MAIN_PORT = `< sina main server port (3000) >`
  > AUTH_PORT = `< sina auth server port (4000) >`
  > SALT_ROUNDS = `< Password hashing salt rounds (10) >`
  > MY_SECRET_KEY = `< access token secret key (random string) >`
  > REFRESH_SECRET_KEY = `< refresh token secret key (random string) >`
  > VALIDATION_SECRET_KEY = `< validation token secret key (random string) >`
  > RESET_SECRET_KEY = `< reset token secret key (random string) >`
  > COOKIE_SECRET = `< string used for signing cookies (random string) >`
  > SEND_GRID_KEY = `< Your send grid api key >`
  > TWILIO_ACCOUNT_SID = `< Your twilio account sid >`
  > TWILIO_AUTH_TOKEN = `< Your twilio auth token >`
  > DATABASE = sina
  > DATABASE_V1 = sinav1
  > DATABASE_USER = `< your database sina-main username >`
  > DATABASE_PASSWORD = `< your database sina-main password >`
  > DATABASE_AUTH_USER = `< your database sina-auth username >`
  > DATABASE_AUTH_PASSWORD = `< your database sina-auth password >`
  > TWILIO_PHONE_NUMBER = `< your twilio account phone number >`

### Start servers

- Open first terminal and move to sina-auth folder
  > cd sina-auth
- Start sina-auth server
  > npm start
- Open a new terminal and move to sina-main folder
  > cd sina-main
- start sina-main server
  > npm start

## Done 🙌
