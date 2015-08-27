/**
 * Created by rharik on 6/12/15.
 */

var invariant = require('invariant');
var pgbluebird = require('pg-bluebird');
var JSON = require('JSON');

module.exports = function appendToStream(_options, _logger) {
    var logger = _logger;
    var options = _options;
    var pgb = new pgbluebird();
    var results = [];
    return async function (streamName, data) {
        invariant(
            streamName,
            'must pass a valid stream name'
        );
        invariant(
            data.events && data.events.length > 0,
            'must pass data with at least one event'
        );
        logger.trace('appending To Stream');
        var cnn = await pgb.connect(options.postgres.connectionString + options.postgres.database);
        data.events.forEach(async x=>{
            var statement = 'INSERT INTO "events" ("streamName", "eventName", "metadata", "document") ' +
                'VALUES (\'' + streamName + '\',\'' + x.eventName + '\' ,\'' + JSON.stringify(x.metadata) + '\',\'' + JSON.stringify(x.data) + '\')';
            logger.info(statement);
            results.push(await cnn.client.query(statement));
        });

        cnn.done();
        return results;
    };
};
