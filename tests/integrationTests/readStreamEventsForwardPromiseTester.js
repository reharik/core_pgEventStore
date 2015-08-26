/**
 * Created by rharik on 7/6/15.
 */

require('must');
var eventStore = require('../../src/index');
var uuid = require('uuid');
var eventModels = require('eventmodels');


describe('readStreamEventsForwardPromiseTester', function() {
    var mut;

    before(function () {
        mut = eventStore.readStreamEventsForwardPromise;
        var append = eventStore.appendToStreamPromise;
        var appendData = { expectedVersion: -2 };
        appendData.events = [new eventModels.EventData('testing1', {}, appendData)];
        append('readStream',appendData);
    });

    context('when calling readStreamEventsForwardPromise with no stream name', ()=> {
        it('should throw proper error', ()=> {
            (function () { mut() }).must.throw(Error, 'Invariant Violation: must pass a valid stream name');
        });
    });

    context('when calling readStreamEventsForwardPromise with no skiptake', ()=> {
        it('should throw proper error', ()=> {
            (function () { mut('readStream') }).must.throw(Error, 'Invariant Violation: must provide the skip take');
        });
    });

    context('when calling readStreamEventsForwardPromise with bad stream name', ()=> {
        it('should return error', async ()=> {
            var results = await mut('badstreamname', {start: 0, count: 10});
            results.Status.must.equal('NoStream');
        });
    });

    context('when calling readStreamEventsForwardPromise', ()=> {
        it('should return events', async ()=> {
            var results = await mut('readStream', {start: 0, count: 10});
            results.Status.must.equal('Success');
            results.Events.length.must.be.at.most(10);
        });
    });
});
