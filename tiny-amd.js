define(function() {
    "use strict";

    /**
     * A super tiny, super fast, and "non-compliant", half-arsed, real-fast promise implementation.
     */

    function noop() {}

    function process(deferred, index, result) {
        deferred.then = index === 0 ? 
            function(resolve) {resolve && resolve(result);}:
            function(_, reject) {reject && reject(result);};

        deferred.resolve = deferred.reject = noop;

        var i = 0,
            queue = deferred.queue,
            item = queue[i];

        while (item) {
            item[index](result);
        
            item = queue[++i];
        }

        queue.length = 0;
    }

    function Deferred() {this.queue = [];}

    Deferred.prototype = {
        then: function(onFulfilled, onRejected) {this.queue.push([onFulfilled, onRejected]);},
        resolve: function(value) {process(this, 0, value);},
        reject: function(reason) {process(this, 1, reason);}
    };

    return {
        defer: function() {return new Deferred();}
    };
});
