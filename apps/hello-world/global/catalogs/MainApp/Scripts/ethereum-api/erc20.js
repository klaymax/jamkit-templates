var module = (function() {
    const actions = require("actions-helper");

    function _resolve(result) {
        return Promise.resolve(JSON.parse(result["result"]));
    }
    
    return {
        name: function(token) {
            return actions.invoke_app("__MAIN__", "api__web3_ethereum_erc20_name", {
                "token": token
            })
                .then(function(result) {
                    return _resolve(result);
                });
        },

        symbol: function(token) {
            return actions.invoke_app("__MAIN__", "api__web3_ethereum_erc20_symbol", {
                "token": token
            })
                .then(function(result) {
                    return _resolve(result);
                });
        },

        decimals: function(token) {
            return actions.invoke_app("__MAIN__", "api__web3_ethereum_erc20_decimals", {
                "token": token
            })
                .then(function(result) {
                    return _resolve(result);
                });
        },

        total_supply: function(token) {
            return new Promise(function(resolve, reject) {
                
            });
        },

        balance_of: function(token, account) {
            return new Promise(function(resolve, reject) {
                
            });
        },

        transfer: function(token, from, to, amount) {
            return new Promise(function(resolve, reject) {
                
            });
        },

        approve: function(token, account, spender, amount) {
            return new Promise(function(resolve, reject) {
                
            });
        },

        allowance: function(token, owner, spender) {
            return new Promise(function(resolve, reject) {
                
            });
        },
    }
})();

__MODULE__ = module;
