var module = (function() {
    const actions = require("actions-helper");

    function _resolve(result) {
        return Promise.resolve(JSON.parse(result["result"]));
    }

    function _reject(error) {
        return Promise.reject(JSON.parse(error["error"]));
    }

    return {
        get_transaction_receipt: function(tx_hash) {
            return actions.invoke_app("__MAIN__", "api__web3_klaytn_api_get_transaction_receipt", {
                "tx_hash": tx_hash
            })
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        },

        call: function(to, data, block="latest") {
            return actions.invoke_app("__MAIN__", "api__web3_klaytn_api_call", {
                "to": to,
                "data": data,
                "block": block
            })
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        },

        request: function(method, params) {
            return actions.invoke_app("__MAIN__", "api__web3_klaytn_api_request", {
                "method": method,
                "params": JSON.stringify(params)
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
