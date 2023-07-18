let SupportBasOp = {};

SupportBasOp.toSupportBasOp = function ( value ) {
    if(typeof value === "number") {
        return new WrapperNumber( value );
    }
    return value;
};

SupportBasOp.__lt__ = function ( value ) { // <
    value = this.toSupportBasOp( value );
    return this.value < value.value;
};

SupportBasOp.__gt__ = function ( value ) { // >
    value = this.toSupportBasOp( value );
    return this.value > value.value;
},

SupportBasOp.__add__ = function ( value ) { // +
    value = this.toSupportBasOp( value );
    return this.value + value.value;
};

SupportBasOp.__radd__ = function ( value ) { // +
    value = this.toSupportBasOp( value );
    return value.value + this.value;
};

SupportBasOp.__sub__ = function ( value ) { // -
    value = this.toSupportBasOp( value );
    return this.value - value.value;
};

SupportBasOp.__rsub__ = function ( value ) { // -
    value = this.toSupportBasOp( value );
    return value.value - this.value;
};

SupportBasOp.__mul__ = function ( value ) { // *
    value = this.toSupportBasOp( value );
    return this.value * value.value;
};

SupportBasOp.__fmul__ = function ( value ) { // *
    value = this.toSupportBasOp( value );
    return value.value * this.value;
};

SupportBasOp.__div__ = function ( value ) { // /
    value = this.toSupportBasOp( value );
    return this.value / value.value;
};

SupportBasOp.__rdiv__ = function ( value ) { // /
    value = this.toSupportBasOp( value );
    return value.value / this.value;
};

SupportBasOp.__mod__ = function ( value ) { // %
    value = this.toSupportBasOp( value );
    return this.value % value.value;
};

SupportBasOp.__rmod__ = function ( value ) { // %
    value = this.toSupportBasOp( value );
    return value.value % this.value;
};

SupportBasOp.__pow__ = function ( value ) { // **
    value = this.toSupportBasOp( value );
    return this.value ** value.value;
};

SupportBasOp.__rpow__ = function ( value ) { // **
    value = this.toSupportBasOp( value );
    return value.value ** this.value;
};

SupportBasOp.__and__ = function ( value ) { // &
    value = this.toSupportBasOp( value );
    return this.value & value.value;
};

SupportBasOp.__or__ = function ( value ) { // |
    value = this.toSupportBasOp( value );
    return this.value | value.value;
};

SupportBasOp.__xor__ = function ( value ) { // ^
    value = this.toSupportBasOp( value );
    return this.value ^ value.value;
};

SupportBasOp.__not = function ( value ) { // ~
    value = this.toSupportBasOp( value );
    return ~value.value;
};

SupportBasOp.__lshift__ = function ( value ) { // << 
    value = this.toSupportBasOp( value );
    return this.value << value.value;
};

SupportBasOp.__rshift__ = function ( value ) { // >>
    value = this.toSupportBasOp( value );
    return this.value < value.value;
};

SupportBasOp.__fill_rshift__ = function ( value ) { // >>>
    value = this.toSupportBasOp( value );
    return this.value < value.value;
};

let WrapperNumber = function( number ) { 
    this.value = number;
}

WrapperNumber.prototype = SupportBasOp;



