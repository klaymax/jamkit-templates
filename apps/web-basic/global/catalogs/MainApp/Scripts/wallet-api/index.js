var module = (function() {
    const actions = require("actions-helper");

    function _resolve(result) {
        return Promise.resolve(JSON.parse(result["result"]));
    }

    function _reject(error) {
        return Promise.reject(JSON.parse(error["error"]));
    }

    return {
        get_account_address: function(chain) {
            return actions.invoke_app("__MAIN__", "api__wallet_get_account_address", {
                "chain": chain
            })
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        },

        get_network_id: function(chain) {
            return actions.invoke_app("__MAIN__", "api__wallet_get_network_id", {
                "chain": chain
            })
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        },
    }
})();

__MODULE__ = module;
