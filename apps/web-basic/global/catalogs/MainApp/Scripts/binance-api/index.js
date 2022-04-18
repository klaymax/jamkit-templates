var module = (function() {
    global["__BINANCE__"] = global["__BINANCE__"] || {};

    global["__BINANCE__"].crypto    = require("crypto");
    global["__BINANCE__"].utils     = include("./utils/index.js");
    global["__BINANCE__"].api       = include("./api/index.js");
    global["__BINANCE__"].broadcast = include("./broadcast/index.js");
    global["__BINANCE__"].abi       = include("./abi/index.js");
    global["__BINANCE__"].bep20     = include("./bep20.js");
    global["__BINANCE__"].token     = global["__BINANCE__"].bep20;

    return Object.assign({
        
    }, global["__BINANCE__"]);
})();

__MODULE__ = module;
