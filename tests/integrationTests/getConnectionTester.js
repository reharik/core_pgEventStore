/**
 * Created by rharik on 6/10/15.
 */

require('must');
var gesConnection = require('../../src/gesConnection');
var gesClient = require('ges-client');
var logger = require('yowlWrapper')();

describe('gesConnection', function() {
    var mut;
    var options = {
        "eventstore": {
            "host": "eventstore",
            "systemUsers": {"admin": "admin"},
            "adminPassword": "changeit"
        }
    };
    before(function(){
        mut = gesConnection(gesClient, logger, options);
    });

    beforeEach(function(){
    });

    context('passing proper args', ()=> {
        it('should should return a connection', function () {
            mut.must.not.be.null();
            mut._handler._connectingPhase.must.equal('Connected');
        })
    });

    //context('when calling subscription', ()=> {
    //    it('should stay open', function async (done) {
    //        mut = bootstrap.getInstanceOf('gesConnection')();
    //        var rx = bootstrap.getInstanceOf('rx');
    //        var subscription = mut.subscribeToAllFrom();
    //
    //        rx.Observable.fromEvent(subscription, 'event').take(10).forEach(x=> {console.log(x);}, err=>{throw err}, ()=>done());
    //
    //        mut._handler._connectingPhase.must.equal('Connected');
    //    })
    //});
});

