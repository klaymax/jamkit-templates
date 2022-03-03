var module = (function() {
    const wallet = require("wallet-api"),
          accounts = require("accounts-api"),
          klaytn = require("klaytn-api"),
          webjs = require("webjs-helper");

    global["klaytn_get_account_address"] = function(params) {
        wallet.get_account_address("klaytn")
            .then(function(result) {
                webjs.callback(params["resolve"], result);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }
    
    global["klaytn_get_network_id"] = function(params) {
        wallet.get_network_id("klaytn")
            .then(function(result) {
                webjs.callback(params["resolve"], result);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    global["klaytn_send_request"] = function(params) {
        var request = JSON.parse(params["params"]);

        if (request["method"] === "klay_sendTransaction") {
            var [ transaction ] = request["params"];

            klaytn.broadcast.send(transaction)
                .then(function(response) {
                    webjs.callback(params["resolve"], response);
                })
                .catch(function(error) {
                    webjs.callback(params["reject"], error);
                });

            return;
        }

        if (request["method"] === "wallet_watchAsset") {
            var { options } = request["params"];
            var { address, symbol, decimals } = options;

            klaytn.kip7.name(address)
                .then(function(name) {
                    return accounts.add_token(address, name, symbol, decimals);
                })
                .then(function(response) {
                    webjs.callback(params["resolve"], response);
                })
                .catch(function(error) {
                    webjs.callback(params["reject"], error);
                });

            return;
        }

        var { method, params: rpc_params } = request;

        klaytn.api.request(method, rpc_params)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    return {
        initialize: function(id, bridge) {
            webjs.initialize(id, bridge);

            return this;
        },

        inject: function() {
            var dir_path = this.__ENV__["dir-path"];

            webjs.import(dir_path + "/kaikas.js");
            webjs.import(dir_path + "/caver.js");
        },
    }
})();

__MODULE__ = module;
