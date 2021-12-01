var module = (function () {
    const crypto = __KLAYTN__.crypto,
          types = include("./types.js");

    function _encode_signature(definition) {
        var bits = crypto.string_to_bits(definition);
        var hash = crypto.keccak256.digest(bits);

        return crypto.hex_from_bits(crypto.bits_slice(hash, 0, 32));
    }

    function _encode_tuple(tuple, values) {
        var head = "", tail = "";

        tuple.forEach(function(type, i) {
            if (type.endsWith("[]")) {
                head += types["uint256"].encode(32 * tuple.length + tail.length / 2);
                tail += _encode_array(type.replace(/\[\]$/, ""), values[i]);
            } else {
                head += types[type].encode(values[i]);
            }
        });

        return head + tail;
    }

    function _encode_array(type, value) {
        var string = types["uint256"].encode(value.length);

        if (type.endsWith("[]") || types[type].is_dynamic()) {
            for (var i = 0; i < value.length; ++i) {
                // TODO
            }    
        } else {
            for (var i = 0; i < value.length; ++i) {
                string += types[type].encode(value[i]);
            }
        }

        return string;
    }

    function _decode_tuple(tuple, string) {
        var values = [], offset = 0, end_offset = 0;

        tuple.forEach(function(type) {
            if (type.endsWith("[]")) {
                var tail_offset = types["uint256"].decode(string.substring(offset, offset + 64))[0] * 2;
                var [ value, next_offset ] = _decode_array(type.replace(/\[\]$/, ""), string.substring(tail_offset));
                
                values.push(value);

                end_offset = offset + next_offset;
            } else {
                if (types[type].is_dynamic()) {
                    var tail_offset = types["uint256"].decode(string.substring(offset, offset + 64))[0] * 2;
                    var [ value, next_offset ] = types[type].decode(string.substring(tail_offset));

                    values.push(value);

                    end_offset = tail_offset + next_offset;
                } else {
                    values.push(types[type].decode(string.substring(offset, offset + 64))[0]);
                }
            }

            offset += 64;
        });

        if (end_offset === 0) {
            end_offset = offset;
        }

        return [ values, end_offset ];
    }

    function _decode_array(type, string) {
        var [ count, offset ] = types["uint256"].decode(string.substring(0, 64));
        var values = [], end_offset = 0;

        if (type.endsWith("[]")) {
            for (var i = 0; i < count; ++i) {
                var tail_offset = 64 + types["uint256"].decode(string.substring(offset, offset + 64))[0] * 2;
                var [ value, next_offset ] = _decode_array(type.replace(/\[\]$/, ""), string.substring(tail_offset));

                values.push(value);

                end_offset = tail_offset + next_offset;
                offset += 64;
            }
        } else {
            if (types[type].is_dynamic()) {
                for (var i = 0; i < count; ++i) {
                    var tail_offset = 64 + types["uint256"].decode(string.substring(offset, offset + 64))[0] * 2;
                    var [ value, next_offset ] = types[type].decode(string.substring(tail_offset));
    
                    values.push(value);
    
                    end_offset = tail_offset + next_offset;
                    offset += 64;
                }
            } else {
                for (var i = 0; i < count; ++i) {
                    values.push(types[type].decode(string.substring(offset, offset + 64))[0]);
    
                    offset += 64;
                }
            }
        }

        if (end_offset === 0) {
            end_offset = offset;
        }

        return [ values, end_offset ];
    }

    return {
        encode: function(definition, values) {
            var m = definition.match(/(.*)\((.*)\)/);

            if (m) {
                return "0x" + [
                    m[1] ? _encode_signature(definition) : "",
                    m[2] ? _encode_tuple(m[2].split(","), values) : []
                ].join("");
            }
        },

        decode: function(definition, string) {
            var m = definition.match(/(.*)\((.*)\)/);

            if (m && m[2]) {
                return _decode_tuple(m[2].split(","), string.replace(/^0x/, ""))[0];
            }
        },
    }
})();

__MODULE__ = module;
