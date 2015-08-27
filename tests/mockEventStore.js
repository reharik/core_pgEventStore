/**
 * Created by parallels on 8/26/15.
 */

var appendToStream =require('./mocks/appendToStreamMock');
var readStreamEventsForward = require('./mocks/readStreamEventsForwardMock');
var subscriptionMock = require('./mocks/SubscriptionMock');

module.exports = {
    appendToStream:appendToStream,
    readStreamEventsForward:readStreamEventsForward,
    subscribeToAll:subscriptionMock,
    catchUpSubscription:subscriptionMock
};