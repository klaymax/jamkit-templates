const settings = require("settings"),
      config   = include("./config.json");

function on_loaded() {
    _update_controls();
}

function on_data_changed(id, data) {
    if (id === "settings.changed") {
        _update_controls();

        return;
    }
}

function toggle_auto_connect() {
    settings.set_auto_connect(settings.is_auto_connect() ? false : true);
    view.object("btn.auto-connect").property({
        "selected": settings.is_auto_connect() ? "yes" : "no"
    });
}

function close() {
    owner.action("script", {
        "script": "toggle_settings"
    });
}

function _update_controls() {
    if (config["needs-auto-connect"]) {
        view.object("btn.auto-connect").property({
            "selected": settings.is_auto_connect() ? "yes" : "no"
        });    
    } else {
        view.object("btn.auto-connect").property({
            "enabled": "no"
        });
    }
}
