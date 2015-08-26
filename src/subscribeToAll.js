/**
 * Created by parallels on 8/24/15.
 */

var PGPubSub = require('pg-pubsub');

module.exports = function(_options, _logger){

    var logger = _logger;
    var options = _options;
    logger.info('subscribeToAll | constructor | subscribing to "events" in pg');
    var subscription = new PGPubsub(options.postgres.connectionString + options.postgres.database);
    subscription.addChannel('events');
    return subscription;
};