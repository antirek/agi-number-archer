var Q = require('q');
var Handler = require('../lib/handler');

describe('Handler', function () {
    var handler;
    var context;
    var expectedRegionCode = 24;
    var expectedNumber = '83912223344';
    var config = {
        beep: false,
        agiParamName: 'agiParam',
        resultDialPlanVarName: 'resultVar'
    };

    var finder = {
        findCodeForNumber: function (number) {
            expect(number).toBe(expectedNumber);
            var defer = Q.defer();
            defer.resolve(expectedRegionCode);
            return defer.promise;
        }
    };

    var logger = {
        info: function (message, object){
            return;
        }
    };

    beforeEach(function () {
        context = {
            on: function (eventName, callback) {
                callback({agiParam: expectedNumber});
            },
            answer: function (callback) {
                callback();
            },
            streamFile: function (filename, digits, callback) {
                callback();
            },
            setVariable: function (variableName, value, callback) {
                callback();
            },
            end: function (callback) {
                callback();
            }
        };
        handler = new Handler(finder, logger, config);
    });
    it('should use context "variables" event', function (done) {
        context.on = function (eventName) {
            expect(eventName).toBe('variables');
            done();
        };
        handler.handle(context);
    });
    it('should use context answer method', function (done) {
        context.answer = function () {
            done();
        };
        handler.handle(context);
    });
    it('should call context streamFile if beep option is set', function (done) {
        config.beep = true;
        context.streamFile = function (filename, acceptDigits) {
            expect(filename).toBe('beep');
            expect(acceptDigits).toBe('#');
            done();
        };
        handler.handle(context);
    });
    it("shouldn't call context streamFile if beep option is not set", function (done) {
        config.beep = false;
        context.streamFile = function (filename, digits, callback) {
            callback();
            fail();
        };
        handler.handle(context).then(function () {
            done();
        });
    });
    it('should call context setVariable with expected region code', function (done) {
        var expectedAgiVarName = 'testAgiVar';
        config.resultDialPlanVarName = expectedAgiVarName;
        context.setVariable = function (varName, value) {
            expect(varName).toBe(expectedAgiVarName);
            expect(value).toBe(expectedRegionCode);
            done();
        };
        handler.handle(context);
    });
    it('should call context end', function (done) {
        context.end = function () {
            done();
        };
        handler.handle(context);
    });
    describe('on fails', function () {
        beforeEach(function () {
            context.answer = function (callback) {
                callback(new Error('test error'));
            }
        });
        it('should call context streamFile', function (done) {
            context.streamFile = function (filename, digits) {
                expect(filename).toBe('invalid');
                expect(digits).toBe('#');
                done();
            };
            handler.handle(context);
        });
        it('should call context end', function (done) {
            context.end = function () {
                done();
            };
            handler.handle(context);
        });
    });
})
;