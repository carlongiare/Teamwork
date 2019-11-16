const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Teamwork',
  password: 'bin@67AC',
  port: 5432,
});

const signIn = (request, response) => {
  const { email, password } = request.body;

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      response.json({ status: 'error', error: error.detail });
    } else if (results.rows.length !== 1) {
      response.json({ status: 'error', error: 'invalid login' })
    } else {
      pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
          response.json({ status: 'error', error: error.detail });
        }
        const dbpassword = results.rows[0].password;
        bcrypt.compare(password, dbpassword).then((res) => {
          if (!res) {
            response.json({ status: 'error', error: 'invalid login' });
          }
          const id = results.rows[0].userId;
          response.json({ status: 'success', data: { userId: id } });
        });
      });
    }
  });
};

const createArticle = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { articleTitle, article } = request.body;
  pool.query('INSERT INTO articles ("userId", "articleTitle", article) VALUES ($1, $2, $3)', [id, articleTitle, article], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error: error.detail,
      });
    } else {
      pool.query('SELECT * FROM articles WHERE article = $1', [article], (error, results) => {
        if (error) {
          response.json({
            status: 'error',
            error,
          });
        }
        response.status(200).json({
          status: 'success',
          data: {
            message: 'Article successfully posted',
            articleId: results.rows[0].articleId,
            createdOn: results.rows[0].date,
            title: results.rows[0].articleTitle,
          },
        });
      });

    }
  });
};

const getArticles = (request, response) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM articles WHERE "userId" = $1 ORDER BY "userId" ASC', [id], (error, results) => {
    if (error) {
      response.status(500).json({
        status: 'error',
        error: error.detail,
      });
    }
    response.status(200).json({
      status: 'successful',
      data: results.rows,
    });
  });
};

const getArticleById = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const articleId = parseInt(request.params.articleId, 10);
  pool.query('SELECT * FROM articles WHERE "userId" = $1 AND "articleId" = $2', [id, articleId], (error, results) => {
    if (error) {
      response.status(500).json({
        status: 'error',
        error: error.detail,
      });
    }
    response.status(200).json({
      status: 'successful',
      data: results.rows[0],
    });
  });
};

module.exports = {
  signIn,
  createArticle,
  getArticles,
  getArticleById,
};
