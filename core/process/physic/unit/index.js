Force = require("./units/Force");
Length = require("./units/Length");
Mass = require("./units/Mass");
Pressure = require("./units/Pressure");
Time = require("./units/Time");
Temperature = require("./units/Temperature");

ComplexUnit = require("./core/ComplexUnit");
UnitValue = require("./core/UnitValue");
Unit = require("./core/Unit");


let physicUnitList = [
    Force, Length, Mass,
    Pressure, Time, 
    Temperature.TemperatureFaringate, Temperature.TemperatureCelsius, Temperature.TemperatureDelta,
];

let encodeSymbol = function( postfix ) {
    let res
    res = Unit.startWith( postfix, physicUnitList );
    if( res[1] === '' ) {
        res = res[0];
    } else {
        // Error
    }
    return res;
};

let encodePostfix = function( postfix ) {
    if( postfix === "" ) { return new ComplexUnit([]); }
    let i=0, posStart=0, isPositive=true, res=[];
    let state = 0;  // 0: Find symbol,
                    // 1: Find num
                    // 2: Find operator
    
    let charType = function( char ) {
        switch (char) {
            case 42: case 47: // *, /
                return 2;
            case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 0, 1, ... 9
                return 1;
            default:
                return 0;
        };
    };

    let pushData = function() {
        if( state === 0 ) {
            res.push( postfix.slice( posStart, i ) );
        } else if( state === 1 ) {
            res.push( 
                (isPositive ? 1 : -1) * Number( postfix.slice( posStart, i ) )
            );
        } else if( state === 2 ) {
            let operator = postfix.slice( posStart, i );
            if( operator === "/" ) { isPositive = false; }
            if( operator === "*" ) { isPositive = true ; }
        }
        posStart = i;
    }

    if( postfix[0] === "/" ) { isPositive=false; posStart = 1; i = 1; }

    for(i; i<postfix.length; i++) {
        let char = postfix.charCodeAt( i ), cType;
        switch (state) {
            case 0:
                cType = charType(char);
                if( cType===1 ) { pushData(); state = 1; break; }
                if( cType===2 ) { pushData(); i++; state = 2; pushData(); state = 0; break; }
                break;
            case 1:
                cType = charType(char);
                if( cType===2 ) { pushData(); i++; state = 2; pushData(); state = 0; break; }
                if( cType===0 ) { pushData(); state = 0; break; }
                break;
        }
    }
    pushData();

    return new ComplexUnit( transformPostfix( res ));
};

let transformPostfix = function( postfix ) {
    let unitStr, unit, power, res=[];
    for(let i=0; i<postfix.length; i+=2) {
        unitStr = postfix[i];
        power = postfix[i+1];
        if( power === undefined || typeof power === "string" ) {
            power = 1;
            i = i - 1;
        }
        unit = encodeSymbol( unitStr );
        if( unit === undefined ) {
            throw new Error( `Postfix for ${unitStr} is not exist. Full postfix: ${postfix}` );
        }
        res.push([unit, power]);
    }
    return res;
};

let encodeNumPostfix = function( num, postfix ) {
    const postfixType = encodePostfix( postfix );
    return new UnitValue( num, postfixType );
};

let encodeVarPostfix = function( variable, postfix ) {
    const postfixType = encodePostfix( postfix );
    if( typeof variable === "number" ) {
        return new UnitValue(variable, postfixType);
    }
    return new UnitValue(variable.value * variable.typeConversionKoef( postfixType ), postfixType);
};

let encodeValuePostfix = function( postfix ) {
    let i=0, char = postfix.charCodeAt( i );
    while(char >= 48 && char <= 57) { // 0, 1, ... 9
        i++;
        char = postfix.charCodeAt( i );
    }
    const value = Number( postfix.slice( 0, i ) );
    const postfixType = encodePostfix( postfix.slice( i ) );
    return new UnitValue( value, postfixType );
};

module.exports = { 
    encodePostfix: encodePostfix,
    encodeValuePostfix: encodeValuePostfix,
    encodeNumPostfix: encodeNumPostfix,
    encodeVarPostfix: encodeVarPostfix,
};

