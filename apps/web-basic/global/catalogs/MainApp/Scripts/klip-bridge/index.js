var module = (function() {
    const wallet = require("wallet-api"),
          klaytn = require("klaytn-api"),
          webjs = require("webjs-helper");

    var _requests = {};

    function _handle_klip_command(command, params) {
        return new Promise(function(resolve, reject) {
            if (command === "prepare") {
                var request_key = _uuid();
                var expiration_time = Date.now() + (5 * 60 * 1000) // 5 mins
                var request = Object.assign(params, {
                    "result": {
                        "request_key": request_key,
                        "expiration_time": expiration_time,
                        "status": "prepared"
                    }
                });

                _requests[request_key] = request;

                resolve(request["result"]);
    
                return;
            }

            if (command === "connect") {
                var request_key = params["request_key"];
                var request = _requests[request_key];
                
                if (request && request["type"] === "auth") {
                    wallet.get_account_address("klaytn")
                        .then(function(address) {
                            Object.assign(request["result"], {
                                "status": "completed",
                                "result": {
                                    "klaytn_address": address
                                }
                            });

                            resolve(request["result"]);
                        })
                        .catch(function(error) {
                            reject(error);
                        });

                    return;
                }

                if (request && request["type"] === "execute_contract") {
                    var { from, to, value, abi, params: abi_params } = request["transaction"];
                    var data = _encode_abi(JSON.parse(abi), JSON.parse(abi_params));

                    klaytn.broadcast.call(from, to, data, value)
                        .then(function({ result }) {
                            Object.assign(request["result"], {
                                "status": "requested",
                                "result": {
                                    "status": "pending",
                                    "tx_hash": result
                                }
                            });

                            resolve(request["result"]);
                        })
                        .catch(function(error) {
                            Object.assign(request["result"], {
                                "status": "canceled"
                            });

                            resolve(request["result"]);
                        });

                    return;
                }

                return;
            }
    
            if (command === "result") {
                var request_key = params["request_key"];
                var request = _requests[request_key];

                if (request) {
                    if (request["result"]["status"] === "completed") {
                        delete _requests[request_key];
                    }

                    if (request["result"]["status"] === "requested") {
                        klaytn.api.get_transaction_receipt(request["result"]["result"]["tx_hash"])
                            .then(function(receipt) {
                                var success = parseInt(receipt["status"].replace("0x", ""));
                                
                                Object.assign(request["result"], {
                                    "status": "completed",
                                    "result": Object.assign(request["result"]["result"], {
                                        "status": success ? "success" : "fail"
                                    })
                                });

                                resolve(request["result"]);
                            })
                            .catch(function(error) {
                                resolve(request["result"]);
                            });
                    } else {
                        resolve(request["result"]);
                    }
                } else {
                    reject({ status: 400 });
                }
            }
        });
    }

    function _parse_klip_command(url, options) {
        var { path, query } = parse("url", url);
        var command = path.split('/').reverse()[0];
        var params = JSON.parse(options["body"] || "{}");

        if (query) {
            params = _parse_query_string(query);
        }

        return [ command, params ];
    }

    function _parse_query_string(string) {
        var query = {};
        
        string.split('&').forEach(function(pair) {
            var [ key, value ] = pair.split('=');

            if (key && value) {
                query[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });

        return query;
    }

    function _encode_abi(abi, params) {
        var definition = abi["name"] + "(" + abi["inputs"].map(function(input) {
            return input["type"];
        }).join(",") + ")";

        return klaytn.abi.encode(definition, params);
    }

    function _uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    global["klip_fetch_request"] = function(params) {
        var { url, options } = JSON.parse(params["params"]);
        var [ command, cmd_params ] = _parse_klip_command(url, options);

        _handle_klip_command(command, cmd_params)
            .then(function(result) {
                webjs.callback(params["resolve"], result);
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

            webjs.import(dir_path + "/klaytn.js");
            webjs.import(dir_path + "/klip.js");
        },

        connect: function(request_key) {
            return _handle_klip_command("connect", {
                "request_key": request_key
            });
        },
    }
})();

__MODULE__ = module;
