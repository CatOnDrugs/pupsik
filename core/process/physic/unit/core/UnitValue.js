const ComplexUnit = require('./ComplexUnit.js');

let UnitValue = function( value, types ) {
    this.value = value;
    ComplexUnit.call( this, types );
    return this;
};
UnitValue.prototype = UnitValue;
UnitValue.__proto__ = ComplexUnit;

UnitValue.addType = function( type, power ) { return ComplexUnit.addType.call(this, type, power ) };
UnitValue.typeConversion = function( type ) { return ComplexUnit.typeConversion.call(this, type ) };
UnitValue.typeConversionKoef = function( type ) { return ComplexUnit.typeConversionKoef.call(this, type ) };
UnitValue.typeConversionTo = function( type ) { return new UnitValue( this.value * ComplexUnit.typeConversionKoef.call(this, type ), type) };
UnitValue.toString = function() { return this.value + ComplexUnit.toString.call(this) };


const DefaultBoolOp = function( op, a, b ) {
    if( typeof b === "number" || b == undefined ) {
        return op(a.value, b);
    }
    if( a.constructor == b.constructor ) {
        const convertType = a.typeConversion( b );
        const koef1 = a.typeConversionKoef( convertType );
        const koef2 = b.typeConversionKoef( convertType );
        return op(a.value*koef1, b.value*koef2);
    }
    return op(a.value, b.value);
};

const DefaultOp = function( op, a, b ) {
    if( typeof b === "number" || b == undefined ) {
        return op(a.value, b);
    }
    if( a.constructor == b.constructor ) {
        const convertType = a.typeConversion( b );
        const koef1 = a.typeConversionKoef( convertType );
        const koef2 = b.typeConversionKoef( convertType );
        return new UnitValue( op(a.value*koef1, b.value*koef2), convertType );
    }
    return op(a.value, b.value);
};

UnitValue.bool = function() {
    if( this.value > 10 ) { return this; }
    else { return false; }
};

UnitValue.lt = function(b) {
    return DefaultBoolOp( (a,b) => a<b, this, b );
};
UnitValue.gt = function(b) {
    return DefaultBoolOp( (a,b) => a>b, this, b );
};

const isSpecific = function(a, b) {
    if( a.specificTypes || b.specificTypes ) {
        return true;
    }
    return false;
};

const { TemperatureDelta } = require('../units/Temperature');
const typeTemperatureDelta = [[TemperatureDelta.bySymbols.degD, 1]];
const SpecificAdd = function( a, b ) {
    if( a.type.size === 1 && b.type.size === 1 ) {
        const aType = a.type.keys().next().value;
        const bType = b.type.keys().next().value;
        if( aType.name === 'Faringate' && bType.name === 'Celsius' ) { return new UnitValue( a.value + b.value + 273, a ) }
        if( aType.name === 'Celsius'   && bType.name === 'Faringate' ) { return new UnitValue( a.value + 273 + b.value, a ) }
        if( aType.name === 'Celsius' && bType.name === 'Delta Temperature' ) { return new UnitValue( a.value + 273 + b.value, typeTemperatureDelta ) }
        if( aType.name === 'Delta Temperature' && bType.name === 'Celsius' ) { return new UnitValue( a.value + b.value + 273, typeTemperatureDelta ) }
        if( aType.name === 'Faringate' && bType.name === 'Delta Temperature' ) { return new UnitValue( a.value + b.value, typeTemperatureDelta ) }
        if( aType.name === 'Delta Temperature' && bType.name === 'Faringate' ) { return new UnitValue( a.value + b.value, typeTemperatureDelta ) }
    }
    return undefined;
}

const SpecificSub = function( a, b ) {
    if( a.type.size === 1 && b.type.size === 1 ) {
        const aType = a.type.keys().next().value;
        const bType = b.type.keys().next().value;
        if( aType.name === 'Celsius'   && bType.name === 'Celsius' ) { return new UnitValue( a.value - b.value, typeTemperatureDelta ) }
        if( aType.name === 'Faringate' && bType.name === 'Celsius' ) { return new UnitValue( a.value - b.value + 273, typeTemperatureDelta ) }
        if( aType.name === 'Celsius'   && bType.name === 'Faringate' ) { return new UnitValue( a.value + 273 - b.value, typeTemperatureDelta ) }
        if( aType.name === 'Faringate' && bType.name === 'Faringate' ) { return new UnitValue( a.value - b.value, typeTemperatureDelta ) }
    }
    return undefined;
}

const DefaultAdd = function( op, a, b ) {
    const typeB = typeof b;
    if( typeof b === "number" || b == undefined ) {
        throw new TypeError(`Cannot add/sub ${a.toString()} and ${b}`);
    }
    if( typeB === "string" ) {
        return op(a.toString(), b);
    }
    if( a.constructor == b.constructor ) {
        const convertType = a.typeConversion( b );
        const koef1 = a.typeConversionKoef( convertType );
        const koef2 = b.typeConversionKoef( convertType );
        return new UnitValue( op(a.value*koef1, b.value*koef2), convertType );
    }
    return op(a.value, b.value);
};

UnitValue.add = function(b) {
    if( isSpecific(this, b) ) { const res = SpecificAdd( this, b); if( res != undefined ) { return res; } }
    return DefaultAdd( (a,b) => a+b, this, b );
};

UnitValue.radd = function(b) {
    if( isSpecific(this, b) ) { const res = SpecificAdd( this, b); if( res != undefined ) { return res; } }
    return DefaultAdd( (a,b) => a+b, this, b );
};

UnitValue.sub = function(b) {
    if( isSpecific(this, b) ) { const res = SpecificSub( this, b); if( res != undefined ) { return res; } }
    return DefaultAdd( (a,b) => a-b, this, b );
};
UnitValue.rsub = function(b) {
    if( isSpecific(this, b) ) { const res = SpecificSub( this, b); if( res != undefined ) { return res; } }
    return DefaultAdd( (a,b) => a-b, this, b );
};

        // if( isSpecific(a, b) ) { 
        //     const res = SpecificAdd( op, a, b);
        //     if( res != undefined ) { return res; }
        // }
// const SpecificAdd = function( op, a, b ) {
    // if( a.type.size === 1 && b.type.size === 1 ) {
        // const aType = a.type.keys().next().value;
        // const bType = b.type.keys().next().value;
        // if( aType.name === 'Celsius'   && bType.name === 'Celsius' ) { return new UnitValue( op(a.value, b.value), a ) }
        // if( aType.name === 'Faringate' && bType.name === 'Celsius' ) { return new UnitValue( op(a.value, b.value + 273), a ) }
        // if( aType.name === 'Celsius'   && bType.name === 'Faringate' ) { return new UnitValue( op(a.value - 273, b.value), a ) }
        // if( aType.name === 'Faringate' && bType.name === 'Faringate' ) { return new UnitValue( op(a.value, b.value), a ) }
    // }
    // return undefined;
// }
const DefaultMul = function( op, a, b ) {
    const typeB = typeof b;
    if( typeof b === "number" || b == undefined ) {
        return new UnitValue( op(a.value, b), a.type );
    }
    if( typeB === "string" ) {
        throw new TypeError(`Cannot mul ${a.toString()} and ${b}`);
    }
    if( a.constructor == b.constructor ) {
        const convertType = [...a.type.entries(), ...b.type.entries()];
        return new UnitValue( op(a.value, b.value), convertType );
    }
    return op(a.value, b.value);
};
UnitValue.mul = function(b) {
    return DefaultMul( (a,b) => a*b, this, b );
};
UnitValue.rmul = function(b) {
    return DefaultMul( (a,b) => a*b, this, b );
};

const DefaultDiv = function( op, a, b ) {
    const typeB = typeof b;
    if( typeof b === "number" || b == undefined ) {
        return new UnitValue( op(a.value, b), a.type );
    }
    if( typeB === "string" ) {
        throw new TypeError(`Cannot div ${a.toString()} and ${b}`);
    }
    if( a.constructor == b.constructor ) {
        const convertType = [...a.type.entries(), ...b.reverseType().entries()];
        return new UnitValue( op(a.value, b.value), convertType );
    }
    return op(a.value, b.value);
};
UnitValue.div = function(b) {
    return DefaultDiv( (a,b) => a/b, this, b );
};
UnitValue.rdiv = function(b) {
    return DefaultDiv( (a,b) => b/a, this, b );
};

const DefaultMod = function( op, a, b ) {
    const typeB = typeof b;
    if( typeof b === "number" || b == undefined ) {
        return new UnitValue( op(a.value, b), a.type );
    }
    if( typeB === "string" ) {
        throw new TypeError(`Cannot mod ${a.toString()} and ${b}`);
    }
    if( a.constructor == b.constructor ) {
        const convertType = [...a.type.entries(), ...b.reverseType().entries()];
        return new UnitValue( op(a.value, b.value), convertType );
    }
    return op(a.value, b.value);
};

UnitValue.mod = function(b) {
    return DefaultMod( (a,b) => a%b, this, b );
};
UnitValue.rmod = function(b) {
    return DefaultMod( (a,b) => b%a, this, b );
};

const DefaultPow = function( op, a, b ) {
    const typeB = typeof b;
    if( typeof b === "number" || b == undefined ) {
        const convertType = [...a.type.entries()];
        for(let i=0; i<convertType.length; i++ ) {
            convertType[i][1] = convertType[i][1] * b;
        }
        return new UnitValue( op(a.value, b), convertType );
    }
    if( typeB === "string" ) {
        throw new TypeError(`Cannot pov ${a.toString()} and ${b}`);
    }
    if( a.constructor == b.constructor ) {
        throw new TypeError(`Cannot pov ${a.toString()} and ${b}. Second, must be number`);
    }
    return op(a.value, b.value);
};

UnitValue.pow = function(b) {
    return DefaultPow( (a,b) => a**b, this, b );
};
UnitValue.rpow = function(b) {
    return DefaultPow( (a,b) => b**a, this, b );
};

UnitValue.or = function(b) {
    return DefaultOp( (a,b) => a|b, this, b );
};
UnitValue.ror = function(b) {
    return DefaultOp( (a,b) => b|a, this, b );
};

UnitValue.and = function(b) {
    return DefaultOp( (a,b) => a&b, this, b );
};
UnitValue.rand = function(b) {
    return DefaultOp( (a,b) => b&a, this, b );
};

UnitValue.xor = function(b) {
    return DefaultOp( (a,b) => a^b, this, b );
};
UnitValue.rxor = function(b) {
    return DefaultOp( (a,b) => b^a, this, b );
};

UnitValue.lshift = function(b) {
    return DefaultOp( (a,b) => a<<b, this, b );
};
UnitValue.rshift = function(b) {
    return DefaultOp( (a,b) => b>>a, this, b );
};

UnitValue.fill_shift = function(b) {
    return DefaultOp( (a,b) => a>>>b, this, b );
};

module.exports = UnitValue;

