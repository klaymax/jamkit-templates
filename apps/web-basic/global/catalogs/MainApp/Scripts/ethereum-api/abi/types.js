var module = (function() {
    const _padding_string = "0000000000000000000000000000000000000000000000000000000000000000";

    function _prepend_padding(value, digits) {
        return _padding_string.substring(0, digits - value.length) + value;
    }

    function _append_padding(value, digits) {
        return value + _padding_string.substring(0, digits - value.length);
    }

    return {
        "uint256": {
            encode: function(value) {
                var string = value.toString(16);
                
                return _prepend_padding(string, 64);
            },

            decode: function(value) {
                var hex = value.substring(0, 64).replace(/^0+/, "");

                return  [ new BigNumber(hex, 16), 64 ];
            },

            is_dynamic: function() {
                return false;
            }
        },

        "uint8": {
            encode: function(value) {
                var string = value.toString(16);
                
                return _prepend_padding(string, 64);
            },

            decode: function(value) {
                var hex = value.substring(0, 64).replace(/^0+/, "");
                
                return [ new BigNumber(hex, 16), 64 ];
            },

            is_dynamic: function() {
                return false;
            }
        },

        "address": {
            encode: function(value) {
                var string = value.replace("0x", "");

                return _prepend_padding(string, 64);
            },

            decode: function(value) {
                var address = "0x" + value.substring(24, 64);
                
                return [ address, 64 ];
            },

            is_dynamic: function() {
                return false;
            }
        },

        "bool": {
            encode: function(value) {
                var string = value ? "1" : "0";

                return _prepend_padding(string, 64);
            },

            decode: function(value) {
                var bool = parseInt(value.substring(63)) ? true : false;

                return [ bool, 64 ];
            },

            is_dynamic: function() {
                return false;
            }
        },

        "string": {
            encode: function(value) {

            },

            decode: function(value) {
                var length = parseInt(value.substring(0, 64).replace(/^0+/, ""), 16);
                var bytes = new Uint8Array(length);

                for (var i = 0; i < length; ++i) {
                    var hex = value.substring(64 + i * 2, 64 + (i + 1) * 2);

                    bytes[i] = parseInt(hex, 16);
                }

                return [ encode("string", bytes), 64 + Math.ceil(length / 32) * 64 ];
            },

            is_dynamic: function() {
                return true;
            }
        },

        "bytes32": {
            encode: function(value) {

            },

            decode: function(value) {

            },

            is_dynamic: function() {
                return true;
            }
        },
    }
})();

__MODULE__ = module;
