How to deploy the Node.js framework:

  - Install (if you have Node.js installed)
- 
npm install

  - Deploy locally
node app.js
npm start

  - Deploy on Heroku (https://secure-badlands-18077.herokuapp.com/)
git add . 
git rm -r --cached node_modules
git commit -m "Another commit"
git push heroku master
heroku open
heroku logs --tail
heroku logs -n 50