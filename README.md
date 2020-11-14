# COMP2003 - Group O Project

## Track and Taste

### Members

- [Michael Bruty](https://github.com/mbruty)
- [Oscar Davies](https://github.com/Jaminima)
- [Reef Lakin](https://github.com/ReefLakin)
- [Alex Denman](https://github.com/AlexDenman47674)
- [Luke Mann](https://github.com/lukemann04)
- [Jack Machar](https://github.com/JWKMachar)

### Project Vision

To produce a mobile application to recommend local restaurants to groups or individuals based on their previous likes and dislikes for restaurants.

### Branches

**Main branch** ![ ](https://travis-ci.com/mbruty/COMP2003-2020-O.svg?token=pzMm3R21aNWorpoM4kpx&branch=main) **Release Branch** ![ ](https://travis-ci.com/mbruty/COMP2003-2020-O.svg?token=pzMm3R21aNWorpoM4kpx&branch=Release) **Development Branch** ![ ](https://travis-ci.com/mbruty/COMP2003-2020-O.svg?token=pzMm3R21aNWorpoM4kpx&branch=Development) [![file structure: destiny](https://img.shields.io/badge/file%20structure-destiny-7a49ff?style=flat)](https://github.com/benawad/destiny)

#### Branch Flowchart

![Branch flowchart](https://i.imgur.com/YAY0LCQ.png)

_Note: below is a checklist for you to use, change the_ `- [ ]` _to a_ `- [X]` _to mark is as done_.

## Code Style Guide

### TypeScript

- [ ] Run the tslint extension
- [ ] Run Prettier (Shift + alt + f)
- [ ] Run the file formatter `npx destiny -w "src/**/*.*"`
- [ ] Set your IDE to use 2 spaces for tabs
- [ ] For interfaces, please name them like I{Name}
- [ ] Use PascalCase for React.FC Names
- [ ] Variables and other functions use camelCaps
- [ ] For constant's please use UPPER_CASE_SNAKE_CASE

### C#

- Comment Chunks of code to explain function

- Keep functions under 30 lines

## What We Are Using

### Website

The website will be built using React and React-DOM. (if you don't know the difference between them, don't worry)
To get started follow these steps:

- [ ] Install node.js [from here](https://nodejs.org/en/) the project has been tested using v12.19.0 (Add to PATH)
- [ ] Clone the repository
- [ ] CD in to ./website
- [ ] Run `npm install` in the console of your choice
- [ ] Run `npm start` to start the development server
- [ ] Run `npm test` to run the tests before submitting your pull request
- [ ] Please use Prettier to format your code before submitting [for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) / [for phpstorm](https://plugins.jetbrains.com/plugin/10456-prettier)
- [ ] **For javascript files** Please use and run eslint and fix any warnings before submitting [for vscode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) / [instructions for phpstorm](https://www.jetbrains.com/help/phpstorm/eslint.html)
- [ ] **For typescript files** Please use and run tslint and fix any warnings [for vscode](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) / [instructions for phpstorm](https://www.jetbrains.com/help/phpstorm/using-tslint-code-quality-tool.html#ws_tslint_activate_and_configure)

---

### Mobile App

The mobile app will be built using React and React-Native (if you don't know the difference between them, don't worry)
To get started follow these steps:

- [ ] Install node.js [from here](https://nodejs.org/en/) the project has been tested using v12.19.0 (Add to PATH)

- [ ] Clone the repository

- [ ] CD in to ./mobile-app

- [ ] Run `npm install` in the console of your choice

- [ ] Run `npm start` to start the development server

- This will start the expo client. You can either chose to use your phone to view the app, or use an emulator.

#### Steps for Setting Up Emulator

- [ ] Download and andriod studio [from here](https://developer.android.com/studio)
- [ ] Go to tools > AVD Manager
- [ ] Create Virtual Device. This app has been tested on Pixel 2 running the playstore, but you can chose which ever you want.
- [ ] Click the green arrow under Actions to start
- [ ] Once the emulator has started, expo shouvld be able to connect to the device by clicking 'Run on Android device / emulator'
- [ ] Alternatively run `npm run android`

#### Steps for Running on Personal Device

- [ ] Download the Expo app from [Google Play store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) / [AppStore](https://apps.apple.com/gb/app/expo-client/id982107779)
- [ ] Run `npm start` to launch the expo interface
- [ ] Open the Expo app on your phone and scan the qr code

#### Avalible Scripts and Code Formatting

- [ ] Run `npm test` to run the tests before submitting your pull request
- [ ] Please use Prettier to format your code before submitting [for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) / [for phpstorm](https://plugins.jetbrains.com/plugin/10456-prettier)
- [ ] Please use and run tslint and fix any warnings [for vscode](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) / [instructions for phpstorm](https://www.jetbrains.com/help/phpstorm/using-tslint-code-quality-tool.html#ws_tslint_activate_and_configure)

---

### API:

The API will be built using vanilla C# with a testing framework that has yet to be decided on. The IDE of choice is VisualStudio, which you should be familiar with. [download](https://visualstudio.microsoft.com/downloads/)

### First Launch:

In order to allow the API app to run properly, please ensure you have downloaded the required packages. To do this:

1. Right Click api in the Solution Explorer

2. Click Manage NuGet Packages

3. Click Restore at the top of the page

### Packages

- [MySQL.Data](https://dev.mysql.com/doc/connector-net/en/connector-net-tutorials-sql-command.html) -- Interact with the MySQL database

- [Newtonsoft.JSON](https://www.newtonsoft.com/json/help/html/SerializingJSON.htm) -- (De)Serialize Objects

- [Scrypt.NET](https://github.com/viniciuschiele/Scrypt) -- Hashing

### Viewing the API:

At the end of each sprint, the table documenting the API's endpoints will be updated. For a more in-depth view, download and install [Postman](https://www.postman.com/downloads/) and [join the team](https://app.getpostman.com/join-team?invite_code=c268b68553ba83262de027359fd55d31). This will allow you to see and run all the possible requests with the required parameters and headers along with the response you will get.

---

### Notes:

#### You do not need to install tslint to the project, just the plugin

For this project we will **not** be using class-based components, instead opting for functional components using react hooks. This might seem a tiny bit foreign at first, but functional react offers some nicer features and makes the code cleaner and more understandable.

After the sprint 0 meeting, we have decided to use TypeScript for the whole of the front end. The only typing's that will be enforced will be an interface for the following:

- Component state
- Component props

Please do try to use typing for most functions and use generics over the any type. I (Mike) might make changes to your branch before merging just to fix these up as it's all alot to learn.

Please use [gitmoji](https://gitmoji.carloscuesta.me/) in commit messages, it make's everything look happier and it's easier to see what you've done at a glance

Don't over-use memoisation, the only good reason to use it is if a component is using a really computationally heavy function inside the state.

---

### To Do:

The react scripts will be updated at a later date to have different environment variables depending on the mode so that you can change from a local api to the one running on the server. This applies to both the website and mobile app.

## API

### updated as of dd/mm/yyy

| Request name             | Request URL                  | Parameters | Description       |
| ------------------------ | ---------------------------- | ---------- | ----------------- |
| Get from random user API | `https://randomuser.me/api/` | None       | Get a random user |

## The Server

It is currently running on one box, using nginx for reverse proxies so that multiple subdomains can listen on their default port.

You should get any server credentials by the end of sprint 0

### Subdomains

| Subdomain | What it points to                                        |
| --------- | -------------------------------------------------------- |
| prodsql   | The production mySql server                              |
| devsql    | The dev mySql server                                     |
| expo      | The published expo link                                  |
| api       | The production api - linked to branch `main`             |
| devapi    | The development api - linked to branch `development`     |
| admin     | The production website - linked to branch `main`         |
| devsite   | The development website - linked to branch `development` |

### Docker

You're able to run the project locally without docker, but on the server we will be using docker to make it easy to update changes. If this app were to go in to production, everything can be put in to a kubernetes cluster to ensure the application is performant with any amount of users [download here](https://hub.docker.com/editions/community/docker-ce-desktop-windows/). Please do not edit any dockerfiles unless you've spoken to mike as it could fuck up the server.
| Docker Image Name | What it's running |
|--|--|
| prodmySql | The production database |
| devmySql | The development database |
| devsite | The development website |

#### Docker Commands

1. Creating the SQL Servers
   `sudo docker run --name prodmySql -p 3306:3306 -e MYSQL_ROOT_PASSWORD={sql_pass} mysql`
   `sudo docker run --name devmySql -p 3307:3306 -e MYSQL_ROOT_PASSWORD={sql_pass} mysql`
2. Starting the SQL Servers
   `sudo docker container start prodmySql`
   `sudo docker container start devmySql`
3. Creating the node container for the web app
   `sudo docker build -t devsite --build-arg git_user="github_username" --build-arg git_pw="github_pw" -f dev.dockerfile .`
   `sudo docker build -t website --build-arg git_user="github_username" --build-arg git_pw="github_pw" -f web.dockerfile .`
4. Starting the node container
   `sudo docker run --name devsite -p 5000:5000 devsite`
   `sudo docker run --name website -p 5001:5001 website`
5. Building the websites
   `sudo docker container run devsite npm build`
   `sudo docker container run website npm build`
6. Running the node container
   `sudo docker container run devsite pkill -9 node && node server.js`
   `sudo docker container run website pkill -9 node && node server.js`
7. Creating the API container
   `sudo docker build -t devapi --build-arg git_user="github_username" --build-arg git_pw="github_pw" -f devapi.dockerfile .`
8. Starting the API container
   `sudo docker run --name devapi -p 445:445 devapi`
9. Running the API
   `sudo docker container run devapi dotnet build`
   `sudo docker container run devapi --configuration Release`

---

## How the Branches Work

1. You submit a pull request with your changes on a new 'feature' branch.
2. Travis-CI will automatically run tests on the changes you've made
3. If the test's pass, go to 4, if any fail, go to 1 and make the appropriate changes
4. Either Mike or Oscar will have a look at the code to ensure quality and test's have been made
5. The changes in the development branch will be automatically uploaded to the development server available at _We need to get a name first_
6. At the end of the sprint we will review if the project is at the next _release_ stage. The changes in the development branch will then be merged in to the release branch.
7. Once we've made sure everything in the release branch is good to go, the release branch will be merged in to the main branch.
8. On the merge in to the main branch, the project will be built and put on the release server avalible at _We need to get a name first_

---

### Colour Scheme
Don't forget to use this graphic for colour scheming:

<p>
  <img alt="Colour scheme graphic for project." width="300" height="450" src="https://i.imgur.com/S4dBZak.png">
</p>