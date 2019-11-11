const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const admin = require('../controllers/adminQueries');

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

module.exports = app;
