# Steps

## Setting up the environment

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
CREATE USER 'sina' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON Sina.* TO 'sina';
```

3- Login with Sina admin.
4- Import the sql file from the sql-file folder and execute it.

## Usage

A- Before making any changes make sure you are in the secondary branch, to do so, follow these steps:

1- Open the directory where you clone this repo
2- Open git bash there.
3- add a new branch and name with the feature you are working on

```bash
git branch <your branch name>
```

```bash
git checkout <your branch name>
```

4- Now you can modify freely.

B- After finishing and testing your code, you can push it to the secondary branch with these steps:

1- Open the directory where you clone this repo
2- Open git bash there (make sure you are in the correct branch).
3- Add the changes to the staging area:

```bash
git add .
```

4- Commit the changes that are in the staging area:

```bash
git commit -m "title of the commit"
```

5- Push the changes to the secondary branch

```bash
git push origin <your branch name>
```

6- Done!
