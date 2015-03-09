'use strict';

var Q = require('q');

function Finder(dbModel) {
    this.findCodeForNumber = function (number) {
        var defer = Q.defer();
        dbModel.findOne(_createQuery(), function (err, doc) {
            if (err) {
                defer.reject(err);
            } else {                
                var result = ['NULL', 'NULL'];               
                if (doc) {
                    result = [doc.region.code, doc.region.county];
                }                
                defer.resolve(result);
            }
        });
        
        function _createQuery() {
            var codeChunk = number.slice(1, 4);
            var numberChunk = number.slice(4);
            return {
                code: codeChunk,
                begin: {
                    $lte: numberChunk
                },
                end: {
                    $gte: numberChunk
                }
            }
        }

        return defer.promise;
    }
}
module.exports = Finder;