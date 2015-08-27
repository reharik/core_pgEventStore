/**
 * Created by parallels on 8/25/15.
 */

var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var pgbluebird = require('pg-bluebird');
var PGPubSub = require('pg-pubsub');

module.exports = function(_options, _logger){

    var logger = _logger;
    var options = _options;

    var catchUpSubscription = function catchUpSubscription(startFrom) {
        logger.info('catchUpSubscription | constructor | starting catchUpSubscription');
        EventEmitter.call(this);
        var subscription = this.getCurrentEventsSubscription();
        logger.info('catchUpSubscription | constructor | pushing new events into array');
        var events = rx.Observable.fromEvent(subscription, 'event').map(x=> x);
        this.getPastEvents({count:500, start:startFrom})
        .then(function(){
            rx.Observable.fromArray(events).forEach(x=> emit('event', x));
        });
    };

    util.inherits(catchUpSubscription, EventEmitter);

    catchUpSubscription.prototype.getPastEvents = async function(skipTake) {
        var cnn = await pgbluebird.connect(options.postgres.connectionString + options.postgres.database);
        var val = true;
        var _emit = emit;
        logger.info('catchUpSubscription | getPastEvents | bulding promise');
        var p = new Promise( async function(resolve, reject){
            logger.info('catchUpSubscription | getPastEvents | starting while loop');
            while (val == true) {
                var statement = 'SELECT * from "events" ORDER BY "Index" OFFSET ' + skipTake.start + ' LIMIT ' + skipTake.count + ';';
                logger.info(statement);
                var results = await cnn.client.query(statement);
                logger.info('catchUpSubscription | getPastEvents | recieved results');
                var rows = result.rows;
                if (rows && rows.length >0) {
                    logger.info('catchUpSubscription | getPastEvents | results contained '+rows.length+' rows');
                    skipTake.start += rows.length;
                    logger.info('catchUpSubscription | getPastEvents | mapping and emmiting events');
                    results.rows.map(x => this.mapEvent(x)).forEach(x=>_emit('event',x));
                }else{
                    logger.info('catchUpSubscription | getPastEvents | results contained no rows');
                    val = false;
                }
            }
            cnn.done();
            resolve(true);
        });
        logger.info('catchUpSubscription | getPastEvents | resolving promise');
    };

    catchUpSubscription.prototype.getCurrentEventsSubscription = function(){
        _logger.info('catchUpSubscription | getCurrentEventsSubscription | starting pg-pubsub');
        var subscription = new PGPubsub(options.postgres.connectionString + options.postgres.database);
        subscription.addChannel('events');
        return subscription;
    };

    catchUpSubscription.prototype.mapEvent = function(event){
        return {
            EventId: event.id,
            Type: event.eventName,
            Data: event.data,
            Metadata: event.metadata
        }
    };
};