/**
 * Created by parallels on 8/26/15.
 */


module.exports = function(_options, _logger) {
    var result = [];
    var readStreamEventForwardShouldReturnResult = function (data) {
        result = data;
    };
    return function () {

        return result;
    };
};