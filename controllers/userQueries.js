const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

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

const updateArticle = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const articleId = parseInt(request.params.articleId, 10);
  const {
    articleTitle, article,
  } = request.body;
  pool.query(
    'UPDATE articles SET "articleTitle" = $1, article = $2  WHERE "userId" = $3 AND "articleId" = $4',
    [articleTitle, article, id, articleId],
    (error, results) => {
      if (error) {
        response.json({
          status: 'error',
          error,
        });
      } else {
        response.status(200).json({ status: 'success', data: { message: 'Article successfully updated', articleId } });
      }
    },
  );
};

const deleteArticle = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const articleId = parseInt(request.params.articleId, 10);
  pool.query('DELETE FROM articles WHERE "userId" = $1 AND "articleId" = $2', [id, articleId], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error: error.detail,
      });
    }
    response.status(200).json({ status: 'success', data: { message: 'Article successfully deleted', articleId } });
  });
};

const createGif = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { title } = request.body;

  if (request.file) {
    cloudinary.uploader.upload(request.file.path, (error, result) => {
      if (error) {
        response.json({ status: 'error', message: 'could not upload' });
      }
      const image = result.url;
      pool.query('INSERT INTO gifs ("userId", "gifTitle", "gifUrl") VALUES ($1, $2, $3)', [id, title, image], (error, results) => {
        if (error) {
          response.json({
            status: 'error',
            error: error.detail,
          });
        } else {
          pool.query('SELECT * FROM gifs WHERE "gifTitle" = $1', [title], (error, results) => {
            if (error) {
              response.json({
                status: 'error',
                error,
              });
            }
            response.status(200).json({
              status: 'success',
              data: {
                message: 'Gif successfully posted',
                gifId: results.rows[0].gifId,
                createdOn: results.rows[0].date,
                title: results.rows[0].gifTitle,
                imageUrl: results.rows[0].gifUrl,
              },
            });
          });
        }
      });
    });
  }
};

const getGifs = (request, response) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM gifs WHERE "userId" = $1 ORDER BY "gifId" ASC', [id], (error, results) => {
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

const getGifById = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const gifId = parseInt(request.params.gifId, 10);
  pool.query('SELECT * FROM gifs WHERE "userId" = $1 AND "gifId" = $2', [id, gifId], (error, results) => {
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

const deleteGif = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const gifId = parseInt(request.params.gifId, 10);
  pool.query('DELETE FROM gifs WHERE "userId" = $1 AND "gifId" = $2', [id, gifId], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error: error.detail,
      });
    }
    response.status(200).json({ status: 'success', data: { message: 'Gif successfully deleted', gifId } });
  });
};

const createArticleComment = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const articleId = parseInt(request.params.articleId, 10);
  const { articleComment } = request.body;
  pool.query('INSERT INTO "articleComments" ("userId", "articleId", "articleComment") VALUES ($1, $2, $3)', [id, articleId, articleComment], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error: error.detail,
      });
    } else {
      pool.query('SELECT * FROM "articleComments" WHERE "articleComment" = $1 AND "userId" = $2', [articleComment, id], (error, results) => {
        if (error) {
          response.json({
            status: 'error',
            error: error.detail,
          });
        }
        response.status(200).json({
          status: 'success',
          data: {
            message: 'Comment successfully created',
            createdOn: results.rows[0].date,
            comment: results.rows[0].articleComment,
          },
        });
      });
    }
  });
};

const createGifComment = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const gifId = parseInt(request.params.gifId, 10);
  const { gifComment } = request.body;
  pool.query('INSERT INTO "gifComments" ("userId", "gifId", "gifComment") VALUES ($1, $2, $3)', [id, gifId, gifComment], (error, results) => {
    if (error) {
      response.json({
        status: 'error',
        error: error.detail,
      });
    } else {
      pool.query('SELECT * FROM "gifComments" WHERE "gifComment" = $1 AND "userId" = $2', [gifComment, id], (error, results) => {
        if (error) {
          response.json({
            status: 'error',
            error: error.detail,
          });
        }
        response.status(200).json({
          status: 'success',
          data: {
            message: 'Comment successfully created',
            createdOn: results.rows[0].date,
            comment: results.rows[0].gifComment,
          },
        });
      });
    }
  });
};

module.exports = {
  signIn,
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  createGif,
  getGifs,
  getGifById,
  deleteGif,
  createArticleComment,
  createGifComment,
};
