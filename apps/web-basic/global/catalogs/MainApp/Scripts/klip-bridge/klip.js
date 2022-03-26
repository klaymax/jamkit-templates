(function() {
    var fetch = window.fetch;
    window.fetch = function() {
        if (arguments[0].match(/a2a-api\.klipwallet\.com/)) {
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

(function() {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (url.match(/a2a-api\.klipwallet\.com/)) {
            var send = this.send, self = this;
            var responseText = "";

            webjs.call("klip_fetch_request", {
                "url": url,
                "options": {}
            })
                .then(function(result) {
                    responseText = JSON.stringify(result);
                });

            this.send = function() {
                var onreadystatechange = self.onreadystatechange;
                self.onreadystatechange = function() {
                    if (self.readyState == XMLHttpRequest.DONE) {
                        Object.defineProperty(this, 'status',       { writable: true });
                        Object.defineProperty(this, 'response',     { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        
                        self.status       = 200;
                        self.response     = responseText;
                        self.responseText = responseText;
                    }
                
                    if (onreadystatechange) {
                        onreadystatechange.apply(self, [].slice.call(arguments));
                    }
                }

                return send.apply(this, [].slice.call(arguments));
            }
        }

        return open.apply(this, [].slice.call(arguments));
    }
})();
