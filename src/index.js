/**
 * Created by reharik on 8/13/15.
 */


var extend = require('extend');
var _appendToStream = require('./appendToStream');
var _readStreamEventsForward = require('./readStreamEventsForward');
var _subscribeToAll = require('./subscribeToAll');
var _catchUpSubscription = require('./catchUpSubscription');
var yowlWrapper = require('yowlwrapper');

module.exports = function index(_options) {

    if(_options.unitTest){
        return require('./tests/mockEventStore');
    }
    var options = {
        "postgres": {
            "connectionString": "postgres://postgres:password@postgres/",
            "postgres": "postgres",
            "database": "database"
        },
        logger: {
            moduleName: "pgEventStore"
        }
    };
    extend(options, _options || {});

    //lame?
    var logger = yowlWrapper(options.logger);
    var appendToStream = _appendToStream(options,logger);
    var readStreamEventsForward = _readStreamEventsForward(options, logger);
    var catchupSubscription = _catchUpSubscription(options, logger);
    var subscribeToAll = _subscribeToAll(options, logger);
    return {
        appendToStream:appendToStream,
        readStreamEventsForward:readStreamEventsForward,
        subscribeToAll:subscribeToAll,
        catchUpSubscription:catchupSubscription
    }
};