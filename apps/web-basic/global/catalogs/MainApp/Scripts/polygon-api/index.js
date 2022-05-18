var module = (function() {
    global["__POLYGON__"] = global["__POLYGON__"] || {};

    global["__POLYGON__"].crypto    = require("crypto");
    global["__POLYGON__"].utils     = include("./utils/index.js");
    global["__POLYGON__"].api       = include("./api/index.js");
    global["__POLYGON__"].broadcast = include("./broadcast/index.js");
    global["__POLYGON__"].abi       = include("./abi/index.js");
    global["__POLYGON__"].erc20     = include("./erc20.js");
    global["__POLYGON__"].token     = global["__POLYGON__"].erc20;

    return Object.assign({
        
    }, global["__POLYGON__"]);
})();

__MODULE__ = module;
