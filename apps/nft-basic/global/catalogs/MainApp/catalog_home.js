const ethereum = require("ethereum-api"),
      config   = include("./config.json");

function on_loaded() {
    var { contract } = config;
    
    ethereum.api.send("eth_getLogs", {

    })
        .then(function(result) {
            console.log(JSON.stringify(result));
        });
}
