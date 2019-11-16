const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const admin = require('../controllers/adminQueries');
const user = require('../controllers/userQueries');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
// admin functions
app.post('/auth/create-user', admin.createUser);
app.get('/users', admin.getUsers);
app.get('/users/:id', admin.getUserById);
app.put('/users/:id', admin.updateUser);
app.delete('/users/:id', admin.deleteUser);
app.delete('/reset-table', admin.deleteAllRows); // this route is only used in mocha for the test database
// user functions
app.post('/auth/signin', user.signIn);
app.post('/users/:id/articles', user.createArticle);
app.get('/users/:id/articles', user.getArticles);
app.get('/users/:id/articles/:articleId', user.getArticleById);


module.exports = app;
