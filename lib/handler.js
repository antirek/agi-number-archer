'use strict';

var Q = require('q');
var console = require('tracer').colorConsole();

function Handler(finder, config) {

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

        function log(message, object) {
            var module = 'handler';
            if (object) {
                console.log(module, callId, message, object);
            } else {
                console.log(module, callId, message);
            }
        };
        
        function extractAgiResultVarName(agiVariables) {
            
            number = agiVariables[config.agiParamName];
            log('number from dialplan', number);
            return Q.resolve();
        };

        function answer() {
            return context.answer()
                .then(function () {
                    if (config.beep) {
                        return context.streamFile('beep', '#');
                    }
                });
        };

        function findCode() {
            return finder.findCodeForNumber(number);
        };

        function setAgiResultVariable(codes) {
            log('codes', codes);
            return context
                .setVariable(config.resultDialPlanVarName1, codes[0])
                .then(function () {
                    context.setVariable(config.resultDialPlanVarName2, codes[1])
                });
        };

        function end() {
            log('end');
            return context.end();
        };

        function processFail(err) {
            log('fail', err);
            return context.streamFile('invalid', '#')
                .then(end);
        };        
        
        return context.onEvent('variables')
            .then(extractAgiResultVarName)
            .then(answer)
            .then(findCode)
            .then(setAgiResultVariable)
            .then(end)
            .fail(processFail);
    };
};

module.exports = Handler;