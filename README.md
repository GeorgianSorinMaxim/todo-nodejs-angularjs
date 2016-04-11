https://github.com/e0ipso/message-center

## Simple todo application with a web frontend and API backend with a datastore.

## Specs:
- The service is written in Node.js and has a REST interface. The back-end is a RESTful API based on Node.js + Express, using MongoDB for the database. The front-end is based on AngularJS and it uses the API to communicate with the backend, not using serverside rendering of templates.
- The UI is separate from the business logic and data layer.

For unit test coverage, Mocha, the JavaScript test framework (https://mochajs.org/) + Supertest (https://www.npmjs.com/package/supertest) are used. There are a number of unit tests are placed in the app/tests/unit.js file. See the steps below on how to run the tests. Not all possible tests were written for the Todo model.


## Installation instructions:
	1. Open a terminal window (iTerm) and go to the path of the cloned folder using the command: $ cd YOUR_FOLDER_PATH
	2. Install the application using the command in the same terminal window: $ npm install -d
	3. Run the app: $ node app

	In the case your environment lacks some modules, you might be requied to install:
	1. Install MongoDB using the command in the same terminal window: $ npm install --save mongo
	2. Install mongoose using the command in the same terminal window: $ npm install --save mongoose
	3. Install mocha using the command in the same terminal window: $ sudo npm install -g mocha
	4. Install assert using the command in the same terminal window: $ sudo npm install --save assert
	5. Install should using the command in the same terminal window: $ sudo npm install --save should
	6. Install supertest using the command in the same terminal window: $ sudo npm install --save supertest
	7. Install body-parser using the command in the same terminal window: $ sudo npm install --save body-parser
	8. Install cookie-parser using the command in the same terminal window: $ sudo npm install --save cookie-parser
	9. Install debug using the command in the same terminal window: $ sudo npm install --save debug
	10. Install express using the command in the same terminal window: $ sudo npm install --save express
	11. Install jade using the command in the same terminal window: $ sudo npm install --save jade
	12. Install morgan using the command in the same terminal window: $ sudo npm install --save morgan


## Installation instructions:

  - Install (if you have Node.js installed)
Download and install Node.js from here: https://nodejs.org/en/download/

  - Install the project and its dependecies, by opening the terminal and navigating to the project folder:
cd FOLDER_PATH
npm install --save

  - Run locally when being in the project folder:
node server.js
  - Open the browser and go to the following URL: http://localhost:3000/

  - Run the server using Nodemon (automatically restarts the server when there are changes to the files).
nodemon server


## Run the unit tests
	1. Open a terminal window (iTerm) and go to the path of the cloned folder using the command: $ cd YOUR_FOLDER_PATH
	2. Go to the tests folder using the command: $ cd app and $ cd tests
	3. Run the tests using: $ mocha unittests


## Run the end-to-end tests:
- Install Protractor:
	sudo npm install -g protractor
		AND
	sudo webdriver-manager update
- While the http-server is running, start the webdriver-manager:
	webdriver-manager start
- Open a new tab in the terminal and go to the folder path:
	cd FOLDER_PATH
- Then run:
	protractor protractor.conf.js


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
