var module = (function() {
    const actions = require("actions-helper");

    function _resolve(result) {
        return Promise.resolve(JSON.parse(result["result"]));
    }

    function _reject(error) {
        return Promise.reject(JSON.parse(error["error"]));
    }

    return {
        call: function(from, to, data, value) {
            return actions.invoke_app("__MAIN__", "api__klaytn_broadcast_call", {
                "from": from,
                "to": to,
                "data": data,
                "value": value
            })
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        },

        send: function(transaction) {
            console.log("send: " + JSON.stringify(transaction));
            return actions.invoke_app("__MAIN__", "api__klaytn_broadcast_send", {
                "transaction": JSON.stringify(transaction)
            })
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        }
    }
})();

__MODULE__ = module;
