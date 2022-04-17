include("./bignumber.js");

var module = (function() {
    const crypto = __KLAYTN__.crypto;

    const _KLAY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Cypress and Baobab
    const _UNIT_MAP = {
        'peb':   '1',
        'kpeb':  '1000',
        'Mpeb':  '1000000',
        'Gpeb':  '1000000000',
        'Ston':  '1000000000',
        'uKLAY': '1000000000000',
        'mKLAY': '1000000000000000',
        'KLAY':  '1000000000000000000',
        'kKLAY': '1000000000000000000000',
        'MKLAY': '1000000000000000000000000',
        'GKLAY': '1000000000000000000000000000',
        'TKLAY': '1000000000000000000000000000000',
    };

    function _value_to_bignum(value) {
        if (typeof value === 'string' && value.startsWith('0x')) {
            return new BigNumber(value.replace(/^0x/, ''), 16);
        }

        if (value instanceof BigNumber) {
            return new BigNumber(value);
        }

        return new BigNumber(value, 10);
    }

    function _get_value_of_unit(unit) {
        return new BigNumber(_UNIT_MAP[unit], 10);
    }

    function _get_value_of_decimals(decimals) {
        return new BigNumber(10, 10).pow(18 - decimals);
    }

    function _encode_checksum_address(address, chain_id) {
        var stripAddress = _strip_address_prefix(address).toLowerCase();
        var prefix = chain_id ? chain_id.toString() + "0x" : "";
        var hash = crypto.keccak256.digest(crypto.string_to_bits(prefix + stripAddress));
        var hexHash = crypto.hex_from_bits(hash);
        var checksumAddress = "0x";

        for (var i = 0; i < stripAddress.length; ++i) {
            checksumAddress += parseInt(hexHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() 
                                                             : stripAddress[i];
        }

        return checksumAddress;
    }

    function _strip_address_prefix(address) {
        return address.slice(0, 2) === "0x" ? address.slice(2) : address;
    }

    return {
        value_to_atom: function(value) {
            return this.value_to_peb(value, "KLAY");
        },

        atom_to_number: function(atom, decimals) {
            return this.peb_to_number(atom, "KLAY", decimals);
        },

        value_to_peb: function(value, unit) {
            var number = _value_to_bignum(value);
            var value_of_unit = _get_value_of_unit(unit);
        
            return number.times(value_of_unit);
        },

        peb_to_number: function(peb, unit, decimals) {
            var value_of_unit = _get_value_of_unit(unit);

            if (decimals && decimals < 18) {
                peb = peb.times(_get_value_of_decimals(decimals));
            }

            return peb.div(value_of_unit).toNumber();
        },

        value_to_bignum: function(value) {
            return _value_to_bignum(value);
        },

        value_to_hex: function(value) {
            return "0x" + _value_to_bignum(value).toString(16);
        },

        fold_decimals: function(peb, decimals) {
            if (decimals < 18) {
                return peb.idiv(_get_value_of_decimals(decimals));
            }

            return peb;
        },

        unfold_decimals: function(peb, decimals) {
            if (decimals < 18) {
                return peb.times(_get_value_of_decimals(decimals));
            }

            return peb;
        },
                
        encode_checksum_address: function(address, chain_id) {
            return _encode_checksum_address(address, chain_id);
        },

        verify_checksum_address: function(address, chain_id) {
            var checksumAddress = _encode_checksum_address(address, chain_id);

            return address === checksumAddress;
        },

        get_native_address: function() {
            return _KLAY_ADDRESS;
        },

        is_native_address: function(address) {
            return address === _KLAY_ADDRESS;
        },

        is_same_address: function(address1, address2) {
            return address1.toLowerCase() === address2.toLowerCase();
        }, 
        
        is_valid_address: function(address) {
            if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
                return true;
            }
        
            return false;
        }
    }
})();

__MODULE__ = module;
