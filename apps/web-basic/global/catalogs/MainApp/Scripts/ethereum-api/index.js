var module = (function() {
    global["__ETHEREUM__"] = global["__ETHEREUM__"] || {};

    global["__ETHEREUM__"].crypto    = require("crypto");
    global["__ETHEREUM__"].utils     = include("./utils/index.js");
    global["__ETHEREUM__"].api       = include("./api/index.js");
    global["__ETHEREUM__"].broadcast = include("./broadcast/index.js");
    global["__ETHEREUM__"].abi       = include("./abi/index.js");
    global["__ETHEREUM__"].erc20     = include("./erc20.js");
    global["__ETHEREUM__"].token     = global["__ETHEREUM__"].erc20;

    return Object.assign({
        
    }, global["__ETHEREUM__"]);
})();

__MODULE__ = module;
