const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Teamwork',
  password: 'bin@67AC',
  port: 5432,
});

const createUser = (request, response) => {
  const {
    firstName, lastName, email, password, gender, jobRole, department, address,
  } = request.body;

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    } else if (results.rows.length !== 0) {
      response.json({ message: 'user already exists' });
    } else {
      // hash the password and insert details into users table.
      bcrypt.hash(password, 10).then((hash) => {
        pool.query('INSERT INTO users ("firstName", "lastName", email, password, gender, "jobRole", department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [firstName, lastName, email, hash, gender, jobRole, department, address], (error, results) => {
          if (error) {
            throw error;
          }
          pool.query('SELECT "userId" FROM users WHERE email = $1', [email], (error, results) => {
            if (error) {
              response.json({
                status: 'error',
                error: 'error',
              });
            }
            response.json({ status: 'success', data: { message: 'User account successfully created', userId: results.rows[0].userId } });
          });
        });
      });
    }
  });
};

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY "userId" ASC', (error, results) => {
    if (error) {
      response.status(500).json({
        status: 'error',
        error,
      });
    }
    const result = results.rows;
    response.status(200).json({
      status: 'successful',
      data: result,
    });
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM users WHERE "userId" = $1', [id], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error,
      });
    }
    response.status(200).json({
      status: 'successful',
      data: results.rows[0],
    });
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const {
    firstName, lastName, email, password, gender, jobRole, department, address,
  } = request.body;
  bcrypt.hash(password, 10).then((hash) => {
    pool.query(
      'UPDATE users SET "firstName" = $1, "lastName" = $2, email = $3, password = $4, gender = $5, "jobRole" = $6, department = $7, address = $8 WHERE "userId" = $9',
      [firstName, lastName, email, hash, gender, jobRole, department, address, id],
      (error, results) => {
        if (error) {
          response.json({
            status: 'error',
            error,
          });
        }
        response.status(200).json({ status: 'success', data: { message: 'User account successfully updated', userId: id } });
      },
    );
  });
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('DELETE FROM users WHERE "userId" = $1', [id], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error,
      });
    }
    response.status(200).json({ status: 'success', data: { message: 'User account successfully deleted', userId: id } });
  });
};


// deleteAllRows is used to reset the users table before each spec in mocha
const deleteAllRows = (request, response) => {
  pool.query('DELETE FROM users', (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error: 'could not query the databse',
      });
    }
    response.status(200).json({ status: 'success', data: 'all rows deleted' });
  });
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllRows,
};
