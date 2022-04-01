const kaikas   = require("kaikas-bridge"),
      klip     = require("klip-bridge"),
      klaytn   = require("klaytn-api"),
      accounts = require("accounts-api"),
      webjs    = require("webjs-helper"),
      settings = require("settings"),
      dialog   = require("dialog"),
      message  = require("message"),
      config   = include("./config.json");

var _klaytn_send_request = global["klaytn_send_request"];
var _settings_visible = false;
var _close_button_pressed = false;
var _wallet_connected = false;

function _klaytn_send_request_safely(params, request) {
    var { method, params: rpc_params } = request;

    klaytn.api.request(method, rpc_params)
        .then(function(response) {
            if (!response["result"]) {
                timeout(0.2, function() {
                    _klaytn_send_request_safely(params, request);
                });
            } else {
                webjs.callback(params["resolve"], response);
            }
        })
        .catch(function(error) {
            webjs.callback(params["reject"], error);
        });    
}

global["klaytn_send_request"] = function(params) {
    var request = JSON.parse(params["params"]);
    
    if ([ "klay_getTransactionReceipt" ].includes(request["method"])) {
        _klaytn_send_request_safely(params, request);
    } else {
        _klaytn_send_request(params);
    }
}

function on_loaded() {
    if (config["desktop-mode"]) {
        view.object("web").property({
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
        });
    }

    view.object("web").property({
        "url": config["url"]
    });

    _update_current_account();
}

function on_web_start(data) {
    if (data["is-for-main-frame"] === "yes") {
        if (config["wallet"] === "klip") {
            klip.initialize("web", "__$_bridge");
            klip.inject();
        } else {
            kaikas.initialize("web", "__$_bridge");
            kaikas.inject();
        }
    }
}

function on_web_loaded(data) {
    if (data["is-for-main-frame"] === "yes" && config["needs-auto-connect"]) {
        webjs.initialize("web", "__$_bridge");
        webjs.import("web.js");

        if (!storage.value("AUTO-CONNECT.PROMPTED")) {
            var message = controller.catalog().string("Do you want to connect the wallet automatically?");
            var ok_label = controller.catalog().string("Connect");
    
            dialog.confirm(message, ok_label)
                .then(function() {
                    settings.set_auto_connect(true);
                    controller.update("settings.changed");
                    
                    _connect_to_wallet();
                });
    
            storage.value("AUTO-CONNECT.PROMPTED", true);
        } else {
            if (settings.is_auto_connect()) {
                if (!_wallet_connected || config["reconnect-when-reload"]) {
                    _connect_to_wallet();
                }
            }
        }
    }
}

function on_web_failed(data) {
    if (data["is-for-main-frame"] === "yes") {
        if (controller.status("network") === "offline") {
            controller.action("subview", {
                "subview": "V_ERROR",
                "target": "self"
            });
        }
    }
}

function on_web_prevent(data) {
    if (data["url"].startsWith("intent://klipwallet")) {
        console.log("on_web_prevent: " + data["query"])
        var m =  data["query"].match(/request_key=([^?&=]+)/);

        if (m) {
            klip.connect(m[1]);
        }

        return;
    }
}

function change_account() {
    accounts.change_account()
        .then(function({ account }) {
            return JSON.parse(account);
        })
        .then(function({ name, accounts }) {
            _update_account_sbml(name, accounts[config["chain"]]["address"]);

            if (config["reconnect-when-reload"]) {
                view.object("web").action("reload");
            } else {
                _reconnect_to_wallet();
            }
        });
}

function toggle_settings() {
    if (_settings_visible) {
        _hide_settings();
    } else {
        _show_settings();
    }
}

function back() {
    if (_settings_visible) {
        _hide_settings();
    
        return;
    }

    controller.action("app-close");
}

function close() {
    if (!_close_button_pressed) {
        controller.action("toast", {
            "message": controller.catalog().string("Press one more time to exit.")
        });
        timeout(2, function() {
           _close_button_pressed = false; 
        });
        _close_button_pressed = true;
    } else {
        controller.action("app-close");
    }
}

function _update_current_account() {
    accounts.get_current_account()
        .then(function({ account }) {
            return JSON.parse(account);
        })
        .then(function({ name, accounts }) {
            _update_account_sbml(name, accounts[config["chain"]]["address"]);
        });
}

function _update_account_sbml(name, address) {
    view.object("sbml.account").action("load", {
        "filename": "home_account.sbml",
        "name": name,
        "address": _shorten_address(address)
    });
}

function _connect_to_wallet() {
    webjs.call("connectToWallet", [ config["wallet"] ])
        .then(function() {
            if (config["notify-wallet-connected"]) {
                controller.action("toast", {
                    "message": controller.catalog().string("Your wallet is connected.")
                });    
            }

            _wallet_connected = true;
        });
    
    _wallet_connected = false;
    
    //message.show("cell.message", "Please wait to connecting...")
}

function _reconnect_to_wallet() {
    webjs.call("reconnectToWallet", [ config["wallet"] ])
        .then(function() {
            if (config["notify-wallet-connected"]) {
                controller.action("toast", {
                    "message": controller.catalog().string("Your wallet is connected.")
                });    
            }

            _wallet_connected = true;
        });
    
    _wallet_connected = false;

    //message.show("cell.message", "Please wait to connecting...")
}

function _show_settings() {
    view.object("cell.settings").action("show");
        
    _settings_visible = true;
}

function _hide_settings() {
    view.object("cell.settings").action("hide");
        
    _settings_visible = false;
}

function _shorten_address(address) {
    return address.slice(0, 6) + "..." + address.slice(-6);
}
