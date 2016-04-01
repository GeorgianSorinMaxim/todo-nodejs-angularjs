How to deploy the Node.js framework:

  - Deploy locally
node app.js
npm start

  - Deploy on Heroku (https://secure-badlands-18077.herokuapp.com/)
git add . 
git rm -r --cached node_modules
git commit -m "Another commit"
git push heroku master
heroku open