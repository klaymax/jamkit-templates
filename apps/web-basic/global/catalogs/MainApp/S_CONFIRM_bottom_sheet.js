function ok() {
    host.action("script", {
        "script": $data["resolve"]
    });
    
    controller.action("bottom-sheet-close");
}

function cancel() {
    host.action("script", {
        "script": $data["reject"]
    });
    
    controller.action("bottom-sheet-close");
}

function on_cancel() {
    host.action("script", {
        "script": $data["reject"]
    });
}
