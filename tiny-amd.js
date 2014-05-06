define(function() {
    "use strict";

    /**
     * A super tiny, super fast, and "non-compliant", half-arsed, real-fast promise implementation.
     */

    var exports = {};

    function identity(x) {return x;}

    function process(deferred, index, result) {
        deferred.then = index === 0 ?
            function(resolve) {(resolve || identity)(result);} :
            function(_, reject) {(reject || identity)(result);};

        deferred.resolve = deferred.reject = identity;

        var i = 0,
            queue = deferred.queue,
            item = queue[i];

        while (item) {
            item[index](result);

            item = queue[++i];
        }

        deferred.queue.length = 0;
    }

    function Deferred() {this.queue = [];}

    Deferred.prototype = {
        then: function(onFulfilled, onRejected) {this.queue.push([onFulfilled || identity, onRejected || identity]);},
        resolve: function(value) {process(this, 0, value );},
        reject: function(reason) {process(this, 1, reason);}
    };

    exports.defer = function() {return new Deferred();};

    return exports;
});
