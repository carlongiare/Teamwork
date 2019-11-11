const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');
const server = require('../src/app');

describe('ADMIN FUNCTIONS', () => {
  beforeEach(async () => {
    await request(server).delete('/reset-table').end();
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
