/* https://www.npmjs.com/package/chai */
import chai from 'chai';
import { getEventsDataFromOrg, processEventsBody } from '../lib/event/events.js';

var assert = chai.assert;
var expect = chai.expect;

describe('#event', () => {
  it('should return the event data of array', async() => {

    const body = await getEventsDataFromOrg;

    const data = processEventsBody(body);

    /* 確認json parse後是否為陣列 */
    assert(Array.isArray(data), 'json.parse data are not arrays');

    data.forEach((item) => {
      expect(item).to.have.own.property('link');
      expect(item).to.have.own.property('event_status');
      expect(item).to.have.own.property('event_name');
      expect(item).to.have.own.property('info');
      expect(item).to.have.own.property('event_certificate');
      expect(item).to.have.own.property('event_date');
      expect(item).to.have.own.property('event_certificate');
      expect(item).to.have.own.property('event_date');
      expect(item).to.have.own.property('event_time');
      expect(item).to.have.own.property('location');
      expect(item).to.have.own.property('distances');
      item.distances.forEach((distance) => {
        expect(distance).to.have.own.property('event_distance');
        expect(distance).to.have.own.property('distance');
        expect(distance).to.have.own.property('event_price');
        expect(distance).to.have.own.property('event_limit');
      });
      expect(item).to.have.own.property('agent');
      expect(item).to.have.own.property('participate');
      expect(item).to.have.own.property('entry_is_end');
      expect(item).to.have.own.property('entry_start');
      expect(item).to.have.own.property('entry_end');
    });
  })
})
