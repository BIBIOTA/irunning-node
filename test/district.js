/* https://www.npmjs.com/package/chai */
import chai from 'chai';
import supertest from 'supertest';
const api = supertest('http://localhost:8050/api'); // API

var assert = chai.assert;
var expect = chai.expect;

describe('#district', () => {
  it('should return api structrue', (done) => {

    /* success */

    api.get('/district')
      .query({
        lng: 121.503599,
        lat: 25.1353734,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end(function(err, res) {
        if (err) return done(err);
        const responseData = JSON.parse(res.text);
        const { status, message, data } = responseData;
        expect(status).to.equal(true);
        expect(message).to.equal('資料取得成功');
        expect(data).to.have.all.keys('C_Name', 'T_Name');

        assert.isString(data.C_Name, 'C_Name are not string');
        assert.isString(data.T_Name, 'T_Name are not string');
      });

      /* fail */

      api.get('/district')
      .query({
        lng: 0,
        lat: 0,
      })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end(function(err, res) {
        if (err) return done(err);

        const responseData = JSON.parse(res.text);
        const { status, message, data } = responseData;

        expect(status).to.equal(false);
        expect(message).to.equal('無法取得鄉鎮區資料');
        expect(data).to.equal(null);
      });

      done();
  })
})
