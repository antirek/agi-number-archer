var Q = require('q');
var Handler = require('../lib/handler');

describe('Handler', function () {
    var handler;
    var context;
    var expectedRegionCode = 24;
    var expectedCountyCode = 5;
    var expectedNumber = '83912223344';
    var config = {
        beep: false,
        agiParamName: 'agiParam',
        resultDialPlanVarName1: 'resultVar1',
        resultDialPlanVarName2: 'resultVar2'
    };

    var finder = {
        findCodeForNumber: function (number) {
            expect(number).toBe(expectedNumber);
            var defer = Q.defer();
            defer.resolve([expectedRegionCode, expectedCountyCode]);
            return defer.promise;
        }
    };

    var logger = {
        info: function (message, object){
            return;
        }
    };

    var Context = function() {

        var onEvent = function (event) {
            expect(event).toBe('variables');
            return Q.resolve();
        };

        var answer = function () {            
            return Q.resolve();
        };

        var setVariable = function (variable, value) {
            expect([24, 5]).toEqual(jasmine.arrayContaining([value]));
            return Q.resolve();
        };

        var streamFile = function (filename, digits) {            
            return Q.resolve();
        };

        return {
            answer: answer,
            onEvent: onEvent,
            setVariable: setVariable,
            streamFile: streamFile
        };
    };

    it('standard flow', function (done) {
        
        context = new Context();
        handler = new Handler(finder, logger, config);

        handler.handle(context)
        .finally(done);
    });
      
});