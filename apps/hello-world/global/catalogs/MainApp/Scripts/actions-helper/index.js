var module = (function() {
    return {
        invoke: function(subview, script, params) {
            return new Promise(function(resolve, reject) {
                const request_id = (Math.random() * 10000).toFixed(0);

                global["actions__on_request_" + request_id] = function(result) { 
                    if (result["callback"] === "resolve") {
                        resolve(result);
                    } else {
                        reject(result);
                    }

                    delete global["actions__on_request_" + request_id];
                }

                controller.action("script", Object.assign({
                    "script": script,
                    "subview": subview,
                    "return-script": "actions__on_request_" + request_id,
                    "return-subview": $data["SUBVIEW"],
                    "return-context": $env["CONTEXT"]
                }, params || {}));
            });
        },

        invoke_app: function(app, script, params) {
            return new Promise(function(resolve, reject) {
                const request_id = (Math.random() * 10000).toFixed(0);

                global.exports = global.hasOwnProperty("exports") ? global.exports : {}
                global.exports["actions__on_request_" + request_id] = function(result) { 
                    if (result["callback"] === "resolve") {
                        resolve(result);
                    } else {
                        reject(result);
                    }

                    delete global.exports["actions__on_request_" + request_id];
                }

                controller.action("script", Object.assign({
                    "script": script,
                    "app": app,
                    "routes-to-app": "yes",
                    "return-script": "actions__on_request_" + request_id,
                    "return-subview": $data["SUBVIEW"],
                    "return-context": $env["CONTEXT"]
                }, params || {}));
            });
        },

        resolve: function(params, data) {
            controller.action("script", Object.assign({
                "script": params["return-script"],
                "subview": params["return-subview"],
                "context": params["return-context"],
                "app": params["source-app"] || "",
                "routes-to-app": params["source-app"] ? "yes" : "no",
                "prevents-open-app": "yes",
                "callback": "resolve"
            }, data || {}));
        },

        reject: function(params, error) {
            controller.action("script", Object.assign({
                "script": params["return-script"],
                "subview": params["return-subview"],
                "context": params["return-context"],
                "app": params["source-app"] || "",
                "routes-to-app": params["source-app"] ? "yes" : "no",
                "prevents-open-app": "yes",
                "callback": "reject"
            }, error || {}));
        },
    }
})();

__MODULE__ = module;
