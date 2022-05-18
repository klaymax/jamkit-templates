var module = (function() {
    const crypto = __BINANCE__.crypto;

    const _PADDING_STRING = "0000000000000000000000000000000000000000000000000000000000000000";

    function _number_to_hex(value) {
        if (typeof(value) === "string") {
            if (value.startsWith("0x")) {
                return value.replace("0x", "");
            }

            return new BigNumber(value, 10).toString(16);
        }

        return value.toString(16);
    }

    function _array_to_hex(array) {
        return Array.from(array, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    function _string_to_array(string) {
        return crypto.bytes_from_bits(crypto.string_to_bits(string));
    }

    function _encode_length(length) {
        var hex = _number_to_hex(length);
                
        return _prepend_padding(hex, 64);
    }

    function _prepend_padding(value, digits) {
        return _PADDING_STRING.substring(0, digits - value.length) + value;
    }

    function _append_padding(value, digits) {
        return value + _PADDING_STRING.substring(0, digits - value.length);
    }

    return {
        "uint256": {
            encode: function(value) {
                var hex = _number_to_hex(value);
                
                return _prepend_padding(hex, 64);
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
                var hex = _number_to_hex(value);
                
                return _prepend_padding(hex, 64);
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
                var hex = _number_to_hex(value);
                
                return _prepend_padding(hex, 64);
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
                var hex = value ? "1" : "0";

                return _prepend_padding(hex, 64);
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
                var bytes = _string_to_array(value);
                var head = _encode_length(bytes.length);
                var hex = _array_to_hex(bytes);
                var digits = parseInt((hex.length + 63) / 64) * 64;

                return head + _append_padding(hex, digits);
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

        "bytes": {
            encode: function(value) {
                var head = _encode_length(value.length);
                var hex = _array_to_hex(value);
                var digits = parseInt((hex.length + 63) / 64) * 64;

                return head + _append_padding(hex, digits);
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
