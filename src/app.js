const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const admin = require('../controllers/adminQueries');
const user = require('../controllers/userQueries');
const upload = require('../handlers/multer');
require('../handlers/cloudinary');

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
// user functions: articles
app.post('/auth/signin', user.signIn);
app.post('/users/:id/articles', user.createArticle);
app.get('/users/:id/articles', user.getArticles);
app.get('/users/:id/articles/:articleId', user.getArticleById);
app.patch('/users/:id/articles/:articleId', user.updateArticle);
app.delete('/users/:id/articles/:articleId', user.deleteArticle);
// user functions: gifs
app.post('/users/:id/gifs', upload.single('image'), user.createGif);
app.get('/users/:id/gifs', user.getGifs);
app.get('/users/:id/gifs/:gifId', user.getGifById);
app.delete('/users/:id/gifs/:gifId', user.deleteGif);


module.exports = app;
