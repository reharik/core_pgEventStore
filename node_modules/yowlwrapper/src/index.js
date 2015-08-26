/**
 * Created by parallels on 8/4/15.
 */

var _yowl = require('./yowl');
var moment = require('moment');

module.exports = function(_options) {
    var options = _options || {};
    var yowl = new _yowl({
        system: {
            applicationName: options.applicationName || 'root',
            environment: options.env || 'dev'
        }
    });
    yowl.addConsoleSink({
        level: options.consoleSink && options.consoleSink.level || options.level || 'silly',
        colorize: true,
        formatter: options.formatter
        || function (x) {
            return '[' + x.meta.level + '] module: '+options.moduleName+' msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
        }
    }).info("added Console Sink")
        .addDailyRotateFileSink({
            level: options.fileSink && options.fileSink.level || options.level || 'info',
            filename: "/" + options.applicationName + ".log"
        })
        .info("added Daily RotateFile Sink");
    return yowl;
};
