var module = (function() {
    const actions = require("actions-helper");

    function _resolve(result) {
        return Promise.resolve(JSON.parse(result["result"]));
    }

    function _reject(error) {
        return Promise.reject(JSON.parse(error["error"]));
    }

    return {
        get_current_account: function() {
            return actions.invoke_app("__MAIN__", "api__accounts_get_current_account")
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });            
        },

        change_account: function() {
            return actions.invoke_app("__MAIN__", "api__accounts_change_account")
                .then(function(result) {
                    return _resolve(result);
                })
                .catch(function(error) {
                    return _reject(error);
                });
        },

        add_token: function(address, name, symbol, decimals) {
            return actions.invoke_app("__MAIN__", "api__accounts_add_token", {
                "token": JSON.stringify({
                    "address": address,
                    "name": name,
                    "symbol": symbol,
                    "decimals": decimals
                })
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
