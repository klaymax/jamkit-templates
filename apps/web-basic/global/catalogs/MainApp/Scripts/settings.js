var module = (function() {
    return {
        set_auto_connect: function(value) {
            storage.value("SETTINGS.AUTO-CONNECT", value);
        },

        is_auto_connect: function() {
            return storage.value("SETTINGS.AUTO-CONNECT");
        },
    }
})();

__MODULE__ = module;
