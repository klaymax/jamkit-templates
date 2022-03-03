var module = (function() {
    return {
        show: function(id, message) {
            controller.catalog().submit("showcase", "others", "S_MESSAGE", {
                "message": message
            });
            view.object(id).action("load", { "display-unit": "S_MESSAGE" });
            view.object(id).action("show");
        },

        hide: function(id) {
            view.object(id).action("hide");
        },
    }
})();

__MODULE__ = module;
