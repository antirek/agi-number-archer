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

function Handler(finder, logger, config) {

    var counter = 1;

    var getCallId = function () {
        var length = 7;
        //magic from https://gist.github.com/aemkei/1180489#file-index-js
        var q = function (a, b) { 
            return([1e15]+a).slice(-b) 
        };
        return q(counter++, length);
    }

    this.handle = function (context) {

        var number;
        var callId = getCallId();
        var contextWrapper = new AgiContextPromiseWrapper(context);

        function extractAgiResultVarName(agiVariables) {
            number = agiVariables[config.agiParamName];
            log('number from dialplan', number);            
        };

        function log(message, object) {
            var module = 'handler';
            if (object) {
                logger.info(module, callId, message, object);
            } else {
                logger.info(module, callId, message);
            }
        };

        function answer() {
            return contextWrapper.answer()
                .then(function () {
                    if (config.beep) {
                        return contextWrapper.streamFile('beep', '#');
                    }
                });
        };

        function findCode() {
            return finder.findCodeForNumber(number);
        };

        function setAgiResultVariable(codes) {
            log('codes', codes);
            return contextWrapper
                .setVariable(config.resultDialPlanVarName1, codes[0])
                .then(function () {
                    contextWrapper.setVariable(config.resultDialPlanVarName2, codes[1])
                });
        };

        function end() {
            log('end');
            return contextWrapper.end();
        };

        function processFail(err) {
            log('fail', err);
            return contextWrapper.streamFile('invalid', '#')
                .then(end);
        };        
        
        contextWrapper.on('variables')
            .then(extractAgiResultVarName)
            .then(answer)
            .then(findCode)
            .then(setAgiResultVariable)
            .then(end)
            .fail(processFail);
    };
};

module.exports = Handler;