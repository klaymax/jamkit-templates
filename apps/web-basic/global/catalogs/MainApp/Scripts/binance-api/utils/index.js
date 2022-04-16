include("./bignumber.js");

var module = (function() {
    const _unit_map = {
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

    function _get_value_of_unit(unit) {
        return new BigNumber(_unit_map[unit], 10);
    }

    return {
        value_to_peb: function(value, unit) {
            var number = this.value_to_number(value);
            var value_of_unit = _get_value_of_unit(unit);
        
            return number.times(value_of_unit);
        },
        
        peb_to_number: function(peb, unit) {
            var value_of_unit = _get_value_of_unit(unit);
        
            return peb.div(value_of_unit);
        },
        
        value_to_number: function(value) {
            if (typeof value === 'string' && value.startsWith('0x')) {
                return new BigNumber(value.replace(/^0x/, ''), 16);
            }

            if (value instanceof BigNumber) {
                return new BigNumber(value);
            }

            return new BigNumber(value, 10);
        },
        
        is_same_address: function(address1, address2) {
            return address1.toLowerCase() === address2.toLowerCase();
        }
    }
})();

__MODULE__ = module;
