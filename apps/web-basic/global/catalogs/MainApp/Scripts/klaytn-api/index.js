var module = (function() {
    global["__KLAYTN__"] = global["__KLAYTN__"] || {};

    global["__KLAYTN__"].crypto    = include("./crypto/index.js");
    global["__KLAYTN__"].utils     = include("./utils/index.js");
    global["__KLAYTN__"].api       = include("./api/index.js");
    global["__KLAYTN__"].broadcast = include("./broadcast/index.js");
    global["__KLAYTN__"].abi       = include("./abi/index.js");
    global["__KLAYTN__"].kip7      = include("./kip7.js");

    return Object.assign({
        
    }, global["__KLAYTN__"]);
})();

__MODULE__ = module;
