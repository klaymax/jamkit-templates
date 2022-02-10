const accounts = require("accounts-api");

function on_loaded() {
    accounts.get_current_account()
        .then((account) => {
            _update_account(account);
        });
}

function change_account() {
    accounts.change_account()
        .then((account) => {
            _update_account(account);
        });
}

function _update_account(account) {
    view.object("label.account").property({
        "text": account["address"]
    });
}
