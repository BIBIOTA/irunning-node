/* https://www.npmjs.com/package/chai */
import chai from 'chai';
import { district } from '../lib/district.js';

var assert = chai.assert;
var expect = chai.expect;

describe('#district', () => {
  it('should return api structrue', () => {

    /* success */

    const result = district(121.503599, 25.1353734);

    expect(result).to.have.all.keys('C_Name', 'T_Name');
    assert.isString(result.C_Name, 'C_Name are not string');
    assert.isString(result.T_Name, 'T_Name are not string');

    /* fail */

    // case 1
    const case1 = district(0, 0);
    
    expect(case1).to.equal(false);

    // case 2
    const case2 = district(null);
    
    expect(case2).to.equal(false);

    // case 3
    const case3 = district('test', 'test');
    
    expect(case3).to.equal(false);

  })
})
