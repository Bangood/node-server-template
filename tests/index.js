/**
 * Created by pure on 2017/8/31.
 */
const request = require('supertest');
const httpStatus = require('http-status');
const expect = require('chai').expect;
const app = require('../server-start');

describe('## Index APIs', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
