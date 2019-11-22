const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');
const server = require('../src/app');

describe('ADMIN FUNCTIONS', () => {
  beforeEach(async () => {
    await request(server).delete('/reset-table');
  });
  describe('POST auth/create-user', () => {
    it('returns an object data with property userId', async () => {
      const response = await request(server).post('/auth/create-user').send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Female',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      expect(response.body.data).to.have.property('userId');
    });
  });

  describe('GET /users /*get all*/', () => {
    it('returns a response body with property data', async () => {
      await request(server).post('/auth/create-user').send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Female',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      const response = await request(server).get('/users');
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an.instanceof(Array);
    });
  });

  describe('GET /users/:id /*get by id*/', () => {
    it('returns a response body with property data', async () => {
      await request(server).post('/auth/create-user').send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Female',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      const responseone = await request(server).get('/users/');
      const response = await request(server).get(`/users/${responseone.body.data[0].userId}`);
      expect(response.body).to.have.property('data');
    });
  });

  describe('PUT /users/:id /*update by id*/', () => {
    it('returns a response body with property data', async () => {
      await request(server).post('/auth/create-user').send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Female',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      const responseone = await request(server).get('/users/');
      const response = await request(server).put(`/users/${responseone.body.data[0].userId}`).send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Male',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      expect(response.body).to.have.property('data');
    });
  });
  describe('DELETE /users/:id /*delete by id*/', () => {
    it('returns a response body with property data', async () => {
      await request(server).post('/auth/create-user').send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Female',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      const responseone = await request(server).get('/users/');
      const response = await request(server).delete(`/users/${responseone.body.data[0].userId}`);
      expect(response.body).to.have.property('data');
    });
  });
});

describe('USER FUNCTIONS', () => {
  describe('POST /auth/signin /*signs in user*/', () => {
    it('returns a response body with property data', async () => {
      await request(server).post('/auth/create-user').send({
        firstName: 'Maria',
        lastName: 'Oslo',
        email: 'test@maria.com',
        password: 'password',
        gender: 'Female',
        jobRole: 'employee',
        department: 'IT',
        address: '103, Longroad',
      });
      const response = await request(server).post('/auth/signin').send({
        email: 'test@maria.com',
        password: 'password',
      });
      expect(response.body).to.have.property('data');
    });
  });
  describe('POST /articles/ /*specific user creates article*/', () => {
    it('returns a response body with property data with property articleId', async () => {
      const responseone = await request(server).get('/users/');
      const response = await request(server).post(`/users/${responseone.body.data[0].userId}/articles`).send({
        articleTitle: 'New Title',
        article: 'New Article',
      });
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('articleId');
    });
  });

  describe('GET /articles/ /*specific user gets own articles*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const response = await request(server).get(`/users/${responseone.body.data[0].userId}/articles`);
      expect(response.body).to.have.property('data');
    });
  });

  describe('GET /articles/:articleId /*specific user gets specific own article by id*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const responsetwo = await request(server).get(`/users/${responseone.body.data[0].userId}/articles`);
      const response = await request(server).get(`/users/${responseone.body.data[0].userId}/articles/${responsetwo.body.data[0].articleId}`);
      expect(response.body).to.have.property('data');
    });
  });

  describe('PATCH /articles/:articleId /*specific user edits specific own article*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const responsetwo = await request(server).get(`/users/${responseone.body.data[0].userId}/articles`);
      const response = await request(server).patch(`/users/${responseone.body.data[0].userId}/articles/${responsetwo.body.data[0].articleId}`).send({
        articleTitle: 'Edited Title',
        article: 'Edited Article',
      });
      expect(response.body).to.have.property('data');
    });
  });

  describe('DELETE /articles/:articleId /*specific user deletes specific own article*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const responsetwo = await request(server).get(`/users/${responseone.body.data[0].userId}/articles`);
      const response = await request(server).delete(`/users/${responseone.body.data[0].userId}/articles/${responsetwo.body.data[0].articleId}`);
      expect(response.body).to.have.property('data');
    });
  });

  describe('POST /gifs/ /*specific user creates gif*/', () => {
    it('returns a response body with property data with property gifId', async () => {
      const responseone = await request(server).get('/users/');
      const response = await request(server).post(`/users/${responseone.body.data[0].userId}/gifs`).field({
        title: 'New Gif Title',
      }).attach('image', 'test/image.png');
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('gifId');
    });
  });

  describe('GET /gifs/ /*specific user gets own gifs*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const response = await request(server).get(`/users/${responseone.body.data[0].userId}/gifs`);
      expect(response.body).to.have.property('data');
    });
  });

  describe('GET /gifs/:gifId /*specific user gets specific own gif by id*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const responsetwo = await request(server).get(`/users/${responseone.body.data[0].userId}/gifs`);
      const response = await request(server).get(`/users/${responseone.body.data[0].userId}/gifs/${responsetwo.body.data[0].gifId}`);
      expect(response.body).to.have.property('data');
    });
  });

  describe('DELETE /gifs/:gifId /*specific user deletes specific own gif*/', () => {
    it('returns a response body with property data', async () => {
      const responseone = await request(server).get('/users/');
      const responsetwo = await request(server).get(`/users/${responseone.body.data[0].userId}/gifs`);
      const response = await request(server).delete(`/users/${responseone.body.data[0].userId}/gifs/${responsetwo.body.data[0].gifId}`);
      expect(response.body).to.have.property('data');
    });
  });
});
