include("./bignumber.js");

var module = (function() {
    const _ETH_ADDRESS = '0x0000000000000000000000000000000000000000'; // Mainnet and Testnet
    const _UNIT_MAP = {
        'noether':    '0',
        'wei':        '1',
        'kwei':       '1000',
        'Kwei':       '1000',
        'babbage':    '1000',
        'femtoether': '1000',
        'mwei':       '1000000',
        'Mwei':       '1000000',
        'lovelace':   '1000000',
        'picoether':  '1000000',
        'gwei':       '1000000000',
        'Gwei':       '1000000000',
        'shannon':    '1000000000',
        'nanoether':  '1000000000',
        'nano':       '1000000000',
        'szabo':      '1000000000000',
        'microether': '1000000000000',
        'micro':      '1000000000000',
        'finney':     '1000000000000000',
        'milliether': '1000000000000000',
        'milli':      '1000000000000000',
        'ether':      '1000000000000000000',
        'kether':     '1000000000000000000000',
        'grand':      '1000000000000000000000',
        'mether':     '1000000000000000000000000',
        'gether':     '1000000000000000000000000000',
        'tether':     '1000000000000000000000000000000',
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

    return {
        value_to_atom: function(value) {
            return this.value_to_wei(value, "ether");
        },

        atom_to_number: function(atom, decimals) {
            return this.wei_to_number(atom, "ether", decimals);
        },

        value_to_wei: function(value, unit) {
            var number = _value_to_bignum(value);
            var value_of_unit = _get_value_of_unit(unit);
        
            return number.times(value_of_unit);
        },

        wei_to_number: function(wei, unit, decimals) {
            var value_of_unit = _get_value_of_unit(unit);

            if (decimals && decimals < 18) {
                wei = wei.times(_get_value_of_decimals(decimals));
            }

            return wei.div(value_of_unit).toNumber();
        },

        value_to_bignum: function(value) {
            return _value_to_bignum(value);
        },

        value_to_hex: function(value) {
            return "0x" + _value_to_bignum(value).toString(16);
        },

        fold_decimals: function(wei, decimals) {
            if (decimals < 18) {
                return wei.idiv(_get_value_of_decimals(decimals));
            }

            return wei;
        },

        unfold_decimals: function(wei, decimals) {
            if (decimals < 18) {
                return wei.times(_get_value_of_decimals(decimals));
            }

            return wei;
        },
                
        encode_checksum_address: function(address) {
            return address;
        },

        verify_checksum_address: function(address) {
            return true;
        },

        get_native_address: function() {
            return _ETH_ADDRESS;
        },

        is_native_address: function(address) {
            return address === _ETH_ADDRESS;
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
