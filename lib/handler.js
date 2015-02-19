'use strict';

var Q = require('q');

function AgiContextPromiseWrapper(context) {
    this.on = function (eventName) {
        var defer = Q.defer();
        context.on(eventName, function (result) {
            defer.resolve(result);
        });
        return defer.promise;
    };
    this.answer = function () {
        var defer = Q.defer();
        context.answer(function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.streamFile = function (filename, acceptDigits) {
        var defer = Q.defer();
        context.streamFile(filename, acceptDigits, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.setVariable = function (varName, value) {
        var defer = Q.defer();
        context.setVariable(varName, value, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.end = function () {
        var defer = Q.defer();
        context.end(function () {
            defer.resolve();
        });
        return defer.promise;
    }
}

function Handler(finder, config) {
    var number;
    this.handle = function (context) {
        var contextWrapper = new AgiContextPromiseWrapper(context);

        function extractAgiResultVarName(agiVariables) {
            number = agiVariables[config.agiParamName];
        }

        function answer() {
            return contextWrapper.answer()
                .then(function () {
                    if (config.beep) {
                        return contextWrapper.streamFile('beep', '#');
                    }
                }
            )
        }

        function findCode() {
            return finder.findCodeForNumber(number);
        }

        function setAgiResultVariable(regionCode) {
            return contextWrapper.setVariable(
                config.resultDialPlanVarName, regionCode
            );
        }

        function end() {
            return contextWrapper.end();
        }

        function processFail() {
            return contextWrapper.streamFile('invalid', '#')
                .then(end);
        }

        return contextWrapper.on('variables')
            .then(extractAgiResultVarName)
            .then(answer)
            .then(findCode)
            .then(setAgiResultVariable)
            .then(end)
            .fail(processFail);
    }

}
module.exports = Handler;