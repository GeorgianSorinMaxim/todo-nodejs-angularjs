## Simple todo application with a web frontend and API backend with a datastore.

## Specs:
- The back-end is a RESTful API based on Node.js + Express, using MongoDB for the database. The front-end is based on AngularJS and it uses the API to communicate with the backend, not using serverside rendering of templates.
- The UI is separate from the business logic and data layer.
- For unit test coverage, Mocha, the JavaScript test framework (https://mochajs.org/) + Supertest (https://www.npmjs.com/package/supertest) are used. There are a number of unit tests are placed in the app/tests/unit.js file. See the steps below on how to run the tests. Not all possible tests were written for the Todo model.
- For end-to-end test coverage, Protractor, the JavaScript test framework (http://angular.github.io/protractor/#/) + Selenium (http://www.seleniumhq.org/projects/webdriver/) are used. There are a number of e2e tests are placed in the app/tests/e2e.js file. See the steps below on how to run the tests. Not all possible tests were written the app.

## Demo:
- https://todonodeangular.herokuapp.com/

## Installation instructions:

  - Download  (if you have Node.js installed ignore this step) and install Node.js from here: https://nodejs.org/en/download/

  - Install the project and its dependecies, by opening the terminal and navigating to the project folder:
``` $ cd FOLDER_PATH```
``` $ npm install --save```
  - In the case your environment lacks some modules, you might be requied to install them.

  - Run locally when being in the project folder:
```$ node server.js```
  - Open the browser and go to the following URL: http://localhost:3000/

  - Run the server using Nodemon (automatically restarts the server when there are changes to the files).
```$ nodemon server```


## Run the unit tests:
 - Open a terminal window (iTerm) and go to the path of the cloned folder using the command: 
```$ cd YOUR_FOLDER_PATH```
 - Go to the tests folder using the command: 
```$ cd app```
```$ cd tests```
 - Run the tests using:
```$ mocha unittests```


## Run the end-to-end tests:
- Install Protractor and WebDriver Selenium:
```$ sudo npm install -g protractor```
```$ sudo webdriver-manager update```
- While the Node.js server is running, start the webdriver-manager:
```$ webdriver-manager start```
- Open a new tab in the terminal and go to the folder path:
```$ cd FOLDER_PATH```
- Then run:
```$ protractor protractor.conf.js```


## See below the steps on how to test the API using Postman: 	
	1. Open Postman

	2. For viewing all Todos, use the GET request on the following url after starting the application: http://localhost:3000/todos

	3. For creating a todo, use the POST request on the following url: http://localhost:3000/todos
 	 	In the POST request body choose: x-www-form-urlencoded
 	 	Add the following Key in the Body of the request: "text". For the defined Key add data that represents the text of the todo.
 	 	Run the request, a new todo will be created with the inputted data.

	5. For updating a todo, use the PUT request on the following url: http://localhost:3000/todos
		In the PUT request body choose: x-www-form-urlencoded
 	 	Add the following Key in the Body of the request: "text". For the defined Key add data that represents the text of the todo.
 	 	Add an id key that contains an existing ID of a previously created todo (run GET to view all existent todos).
 	 	Run the request, the selected todo is now updated with the inputted data.

 	6. For deleting a todo, use the DEL request on the following url: http://localhost:3000/todos
 		In the DEL request body choose: x-www-form-urlencoded
 	 	Add an id key that contains an existing ID of a previously created todo.
 	 	Run the request, the selected todo is now deleted.
