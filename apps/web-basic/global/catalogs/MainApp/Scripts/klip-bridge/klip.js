(function() {
    var fetch = window.fetch;
    window.fetch = function() {
        if (arguments[0].match(/klipwallet\.com/)) {
            return webjs.call("klip_fetch_request", {
                "url": arguments[0],
                "options": arguments[1]
            })
                .then(function(result) {
                    var body = JSON.stringify(result);

                    return Promise.resolve(new Response(body, {
                        "status": 200
                    }));
                });
        } else {
            return fetch.apply(this, [].slice.call(arguments));
        }
    }
})();
