/**
 * Created by rharik on 6/19/15.
 */

var EventEmitter = require('events').EventEmitter;


module.exports = class SubscriptionMock extends EventEmitter {
    constructor() {
        super();
    }
};
