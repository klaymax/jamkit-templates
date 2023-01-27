window.klaytn = (function() {
    var _account = "", _network_id = 0;
    var _auto_refresh_on_network_change = true;

    function _kaikas_get_account_address() {
        return new Promise(function(resolve, reject) {
            webjs.call("kaikas_get_account_address")
                .then(function(result) {
                    resolve(result);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    function _kaikas_send_request(request) {
        return new Promise(function(resolve, reject) {
            webjs.call("kaikas_send_request", request)
                .then(function(response) {
                    resolve(Object.assign(response, {
                        "id": request["id"],
                        "jsonrpc": "2.0"
                    }));
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    return {
        initialize: function(network_id, account) {
            _network_id = network_id;
            _account = account;
        },

        enable: function() {
            return _kaikas_get_account_address()
                .then(function(address) {
                    return Promise.resolve([ _account = address ]);
                })
                .catch(function(error) {
                    return Promise.reject(error);
                });
        },

        send: function(request, callback) {
            _kaikas_send_request(request)
                .then(function(response) {
                    callback(null, response);
                })
                .catch(function(error) {
                    callback(error);
                });
        },

        sendAsync: function(request, callback) {
            _kaikas_send_request(request)
                .then(function(response) {
                    callback(null, response);
                })
                .catch(function(error) {
                    callback(error);
                });
        },

        on: function(eventName, callback) {
            console.log("on: " + eventName + ":" + callback);
        },
        
        removeListener: function(eventName, callback) {
            console.log("removeListener: " + eventName + ":" + callback);
        },
        
        _kaikas: {
            isEnabled: function() {
                return true;
            },
        
            isApproved: function() {
                return Promise.resolve(true);
            },
        
            isUnlocked: function() {
                return Promise.resolve(true);
            }
        },

        get selectedAddress() {
            return _account;
        },

        get networkVersion() {
            return _network_id;
        },
        
        get isKaikas() {
            return true;
        },
        
        set autoRefreshOnNetworkChange(value) {
            _auto_refresh_on_network_change = value;
        },

        get autoRefreshOnNetworkChange() {
            return _auto_refresh_on_network_change;
        },
    }
})();
