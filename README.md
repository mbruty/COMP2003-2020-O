# Comp 2003 Group O Project
**Main branch** ![enter image description here](https://travis-ci.com/mbruty/COMP2003-2020-O.svg?token=pzMm3R21aNWorpoM4kpx&branch=main) **Release Branch** ![enter image description here](https://travis-ci.com/mbruty/COMP2003-2020-O.svg?token=pzMm3R21aNWorpoM4kpx&branch=Release) **Development Branch** ![enter image description here](https://travis-ci.com/mbruty/COMP2003-2020-O.svg?token=pzMm3R21aNWorpoM4kpx&branch=Development)

## What are we using?
### Website
*Note: this is a checklist for you to use, change the* `- [ ]` *to a* `- [X]` *to mark is as done*
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
 - [ ]  **For typescript files** Please use and run tslint and fix any warnings [for vscode](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) / [instructions for phpstorm](https://www.jetbrains.com/help/phpstorm/using-tslint-code-quality-tool.html#ws_tslint_activate_and_configure)
 ### Mobile app
 The mobile app will be built using React and React-Native (if you don't know the difference between them, don't worry)
 To get started follow these steps:
 - [ ] Install node.js [from here](https://nodejs.org/en/) the project has been tested using v12.19.0 (Add to PATH)
 - [ ] Clone the repository
 - [ ] CD in to ./website
 - [ ] Run `npm install` in the console of your choice
 - [ ] Run `npm start` to start the development server
 - This will start the expo client. You can either chose to use your phone to view the app, or use an emulator.
#### Steps for the emulator:
 - [ ] Download and andriod studio [from here](https://developer.android.com/studio)
 - [ ] Go to tools > AVD Manager 
 - [ ] Create Virtual Device. This app has been  tested on Pixel 2 running the playstore, but you can chose which ever you want.
 - [ ] Click the green arrow under Actions to start
 - [ ] Once the emulator has started, expo should be able to connect to the device by clicking 'Run on Android device / emulator'
 - [ ] Alternatively run `npm run android`
#### Steps for running on your own device:
- [ ] Download the Expo app from [Google Play store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) / [AppStore](https://apps.apple.com/gb/app/expo-client/id982107779)
- [ ] Run `npm start` to launch the expo interface
- [ ] Open the Expo app on your phone and scan the qr code
#### Avalible scripts and code formatting
 - [ ] Run `npm test` to run the tests before submitting your pull request
 - [ ] Please use Prettier to format your code before submitting [for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) / [for phpstorm](https://plugins.jetbrains.com/plugin/10456-prettier)
 - [ ] **For javascript files** Please use and run eslint and fix any warnings before submitting [for vscode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) / [instructions for phpstorm](https://www.jetbrains.com/help/phpstorm/eslint.html)
 - [ ]  **For typescript files** Please use and run tslint and fix any warnings [for vscode](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) / [instructions for phpstorm](https://www.jetbrains.com/help/phpstorm/using-tslint-code-quality-tool.html#ws_tslint_activate_and_configure)
### API:
*Oscar to fill this out at a later date* 

### Viewing the API:
At the end of each sprint, the table documenting the API's endpoints will be updated. For a more in-depth view, download and install [Postman](https://www.postman.com/downloads/) and [join the team](https://app.getpostman.com/join-team?invite_code=c268b68553ba83262de027359fd55d31). This will allow you to see and run all the possible requests with the required parameters and headers along with the response you will get.
 ### Notes:
 #### You do not need to install eslint / tslint to the project, just the plugin
   For this project we will **not** be using class-based components, instead opting for functional components using react hooks. This might seem a tiny bit foreign at first, but functional react offers some nicer features and makes the code cleaner and more understandable.
   
  Whilst I will not force you to use typescript, it does offer many advantages for the little amount of time it takes to change code from JS to TS like better auto completion, intellisense and type safety. If you wish to learn about typescript, do not hesitate to talk to me.

Don't over-use memoisation, the only good reason to use it is if a component is using a really computationally heavy function inside the state.
### ToDo: 
The react scripts will be updated at a later date to have different environment variables depending on the mode so that you can change from a local api to the one running on the server. This applies to both  the website and mobile app. 
## API
*updated as of dd/mm/yyyy*
|Request name| Request URL | Parameters | Description |
|--|--|--|--|
| Get from random user API | https://randomuser.me/api/ | None | Get a random user |

## How the branches work?

 1. You submit a pull request with your changes on a new 'feature' branch.
 2. Travis-CI will automatically run tests on the changes you've made
 3. If the test's pass, go to 4, if any fail, go to 1 and make the appropriate changes
 4. Either Mike or Oscar will have a look at the code to ensure quality and test's have been made 
 5. The changes in the development branch will be automatically uploaded to the development server available at /* We need to get a name first */
 6. At the end of the sprint we will review if the project is at the next *release* stage. The changes in the development branch will then be merged in to the release branch.
 7. Once we've made sure everything in the release branch is good to go, the release branch will be merged in to the main branch.
 8. On the merge in to the main branch, the project will be built and put on the release server avalible at /* We need to get a name first */
