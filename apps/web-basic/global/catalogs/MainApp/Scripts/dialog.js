var module = (function() {
    function _promise_callbacks(resolve, reject) {
        var unique = (Math.random() * 10000).toFixed(0)
        
        global["dialog__resolve_" + unique] = function(params) { 
            resolve(params);
    
            delete global["dialog__resolve_" + unique];
            delete global["dialog__reject_"  + unique];
        }
    
        global["dialog__reject_" + unique] = function(error) { 
            reject(error);
    
            delete global["dialog__resolve_" + unique];
            delete global["dialog__reject_"  + unique];
        }
    
        return [ "dialog__resolve_" + unique, "dialog__reject_" + unique ]
    }

    return {
        confirm: function(message, ok_label) {
            return new Promise(function(resolve, reject) {
                var [ resolve_name, reject_name ] = _promise_callbacks(resolve, reject);

                controller.catalog().submit("showcase", "others", "S_CONFIRM", {
                    "message": message,
                    "ok-label": ok_label || "",
                    "resolve": resolve_name,
                    "reject": reject_name
                });
                controller.action("bottom-sheet", { "display-unit": "S_CONFIRM" });
            });
        },
    }
})();

__MODULE__ = module;
