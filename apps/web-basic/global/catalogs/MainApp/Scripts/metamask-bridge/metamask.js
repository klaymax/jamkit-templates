window.ethereum = (function() {
    var _account = "", _network_id = 0;

    function _metamask_get_account_address() {
        return new Promise(function(resolve, reject) {
            webjs.call("metamask_get_account_address")
                .then(function(result) {
                    resolve(result);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    function _metamask_send_request(request) {
        return new Promise(function(resolve, reject) {
            webjs.call("metamask_send_request", request)
                .then(function(response) {
                    resolve(Object.assign(response, {
                        "id": request["id"]
                    }));
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    return {
        initialize: function(network_id) {
            _network_id = network_id;
        },

        enable: function() {
            return _metamask_get_account_address()
                .then(function({ result: [ address ] }) {
                    return Promise.resolve([ _account = address ]);
                })
                .catch(function(error) {
                    return Promise.reject(error);
                });
        },

        send: function(request, callback) {
            _metamask_send_request(request)
                .then(function(response) {
                    callback(null, response);
                })
                .catch(function(error) {
                    callback(error);
                });
        },

        request: function(request) {
            return _metamask_send_request(request)
                .then(function({ result }) {
                    return Promise.resolve(result);
                })
                .catch(function({ error }) {
                    return Promise.reject(error);
                })
        },

        on: function(eventName, callback) {
            console.log("on: " + eventName + ":" + callback);
        },
        
        removeListener: function(eventName, callback) {
            console.log("removeListener: " + eventName + ":" + callback);
        },
        
        wallet_watchAsset: function() {
            console.log("wallet_watchAsset");
        },
        
        get selectedAddress() {
            return _account;
        },

        get networkVersion() {
            return "0x" + _network_id.toString(16);
        },
        
        get isMetamask() {
            return true;
        },
        
        get isConnected() {
            return true;
        },
    }
})();
