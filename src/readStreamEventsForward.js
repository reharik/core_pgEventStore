var invariant = require('invariant');
var pgbluebird = require('pg-bluebird');

module.exports = function(_options, _logger) {
    var logger = _logger;
    var options = _options;
    var pgb = new pgbluebird();

    return async function (streamName, skipTake) {
        invariant(
            streamName,
            'must pass a valid stream name'
        );
        invariant(
            skipTake,
            'must provide the skip take'
        );

        logger.trace('wrapping readStreamEventsForward in Promise');
        var cnn = await pgb.connect(options.postgres.connectionString + options.postgres.database);
        var statement = 'SELECT * from "events" WHERE "streamName" = "'+streamName+'" ORDER BY "Index" OFFSET ' + skipTake.start + ' LIMIT ' + skipTake.count + ';';
        logger.info(statement);
        var results = await cnn.client.query(statement);
        cnn.done();
        if(!result.rows || result.rows.length <= 0){
            return [];
        }

        return results.rows.map(x=>{return  {
            EventId: x.id,
            Type: x.eventName,
            Data: x.data,
            Metadata: x.metadata
        }});
    };
};