var module = (function() {
    const wallet   = require("wallet-api"),
          ethereum = require("ethereum-api"),
          polygon  = require("polygon-api"),
          binance  = require("binance-api"),
          klaytn  = require("klaytn-api"),
          webjs    = require("webjs-helper");

    var _chain = "";
    var _web3 = {};

    global["metamask_send_request"] = function(params) {
        var request = JSON.parse(params["params"]);

        if (request["method"] === "eth_accounts" || request["method"] === "eth_requestAccounts") {
            _get_account_address(params);

            return;
        }

        if (request["method"] === "eth_sendTransaction") {
            _send_transaction(params, request);

            return;
        }

        if (request["method"] === "personal_sign") {
            _sign_message(params, request);

            return;
        }

        if (request["method"] === "wallet_watchAsset") {
            _watch_asset(params, request);

            return;
        }
        
        if ([ "eth_getTransactionReceipt" ].includes(request["method"])) {
            _send_request_safely(params, request);

            return;
        }

        _send_request(params, request);
    }

    global["metamask_get_account_address"] = function(params) {
        _get_account_address(params);
    }
    
    function _send_request(params, request) {
        var { method, params: rpc_params } = request;

        _web3.api.request(method, rpc_params)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }
    
    function _send_request_safely(params, request) {
        var { method, params: rpc_params } = request;
    
        _web3.api.request(method, rpc_params)
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

        _web3.broadcast.send(transaction)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    function _sign_message(params, request) {
        var [ message, account, password ] = request["params"];

        _web3.broadcast.sign(_decode_hex_message(message), account, password)
            .then(function(signature) {
                webjs.callback(params["resolve"], { "result": signature });
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    function _decode_hex_message(message) {
        return _web3.crypto.string_from_bits(_web3.crypto.hex_to_bits(message));
    }

    function _watch_asset(params, request) {
        var { options } = request["params"];
        var { address, symbol, decimals } = options;

        _web3.token.name(address)
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
        wallet.get_account_address(_chain)
            .then(function(address) {
                webjs.callback(params["resolve"], { "result": [ address ] });
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    function _web3_for_chain(chain) {
        if (chain === "ethereum") {
            return ethereum;
        }
        
        if (chain === "polygon") {
            return polygon;
        }

        if (chain === "binance") {
            return binance;
        }

        if (chain === "klaytn") {
            return klaytn;
        }
    }
    
    return {
        initialize: function(id, bridge, chain) {
            webjs.initialize(id, bridge);

            _chain = chain;
            _web3 = _web3_for_chain(chain);

            return this;
        },

        inject: function(network_id, account) {
            var dir_path = this.__ENV__["dir-path"];

            webjs.import(dir_path + "/metamask.js");
            webjs.call("ethereum.initialize", [ network_id, account ]);
        },
    }
})();

__MODULE__ = module;
