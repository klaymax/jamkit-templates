var module = (function() {
    const wallet = require("wallet-api"),
          accounts = require("accounts-api"),
          klaytn = require("klaytn-api"),
          webjs = require("webjs-helper");

    global["kaikas_send_request"] = function(params) {
        var request = JSON.parse(params["params"]);

        if (request["method"] === "klay_sendTransaction") {
            _send_transaction(params, request);

            return;
        }

        if (request["method"] === "wallet_watchAsset") {
            _watch_asset(params, request);

            return;
        }
        
        if ([ "klay_getTransactionReceipt" ].includes(request["method"])) {
            _send_request_safely(params, request);

            return;
        }

        _send_request(params, request);
    }

    global["kaikas_get_account_address"] = function(params) {
        _get_account_address(params);
    }
    
    function _send_request(params, request) {
        var { method, params: rpc_params } = request;

        klaytn.api.request(method, rpc_params)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }
    
    function _send_request_safely(params, request) {
        var { method, params: rpc_params } = request;
    
        klaytn.api.request(method, rpc_params)
            .then(function(response) {
                if (!response["result"]) {
                    timeout(0.2, function() {
                        _send_request_safely(params, request);
                    });
                } else {
                    webjs.callback(params["resolve"], response);
                }
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });    
    }
    
    function _send_transaction(params, request) {
        var [ transaction ] = request["params"];

        klaytn.broadcast.send(transaction)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    function _watch_asset(params, request) {
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
    }

    function _get_account_address(params) {
        wallet.get_account_address("klaytn")
            .then(function(address) {
                webjs.callback(params["resolve"], { "result": [ address ] });
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

        inject: function(network_id) {
            var dir_path = this.__ENV__["dir-path"];

            webjs.import(dir_path + "/kaikas.js");
            webjs.import(dir_path + "/caver.js");
            webjs.call("klaytn.initialize", [ network_id ]);
        },
    }
})();

__MODULE__ = module;
