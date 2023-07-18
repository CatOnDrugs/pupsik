let ComplexUnit = function(types) {
    if( types instanceof Map ) {
        this.type = types;
        for(let i=0; i<types.length; i++) {
            this.checkSpecificTpyes( types[i][0], types[i][1] );
        }
        return this;
    } else if( types.type instanceof Map ) {
        this.type = types.type;
        this.specificTypes = types.specificTypes;
        return this;
    }

    this.type = new Map();


    for(let i=0; i<types.length; i++) {
        this.addType( types[i][0], types[i][1] );
    }
    return this;
}
ComplexUnit.prototype = ComplexUnit;

ComplexUnit.checkSpecificTpyes = function( type, power ) {
    if( type.isSpecific === true ) {
        if( this.specificTypes === undefined ) {
            this.specificTypes = []
        }
        this.specificTypes.push( type );
    };
}

ComplexUnit.addType = function( types, power ) {
    let type;

    if( Array.isArray( types ) ) {
        if( power===undefined ) {
            type = types.filter((el)=>el)[0];
            power = 1;
        } else {
            type = types[ power ];
            if( type ) {
                power = 1;
            }
        }

        if(type === undefined) {
            type = types[1];
        }
        if(type === undefined) {
            type = types.filter((el)=>el)[0];
        }
    } else {
        if( power===undefined ) {
            power = 1;
        } else {
            type = types;
        }
        types = types.family.bySymbols[types.symbol];
    }
    
    for(const [ftype, value] of this.type) {
        if( ftype.family==type.family ) {
            if( ftype.symbol===type.symbol ) {
                this.type.delete( ftype );
                const newPower = (type.defaultPower * power) + (ftype.defaultPower * value);
                if( newPower === 0 ) { return; }
                this.addType( types, newPower);
                return;
            } else if( ftype.noPrefixUnit.symbol==type.noPrefixUnit.symbol ) {
                const fprefix = ftype.prefix===undefined ? 0 : ftype.prefix.prefix;
                const sprefix = type.prefix===undefined ? 0 : type.prefix.prefix;
                this.value *= 10**(fprefix * value * ftype.defaultPower - sprefix * power * type.defaultPower);
                // this.value *= 10**(sprefix * power * type.defaultPower - fprefix * value * ftype.defaultPower );
                this.type.delete( ftype );
                const newPower = (type.defaultPower * power) + (ftype.defaultPower * value);
                if( newPower === 0 ) { return; }
                this.addType( types, newPower);
                return;
            }
            return;
        }
    }

    const curentPower = this.type.get( type );
    if( curentPower ) {
        power = power + curentPower;
    }
    this.checkSpecificTpyes( type, power );
    this.type.set( type, power );
}

ComplexUnit.reverseType = function() {
    let type = new Map();
    for(const [ftype, fpower] of this.type) {
        type.set(ftype, -1 * fpower);
    };
    return type;
};

ComplexUnit.getVector = function( res = new Map() ) {
    const type = this.type ?? this;
    for(const [ftype, fpower] of type) {
        if( ftype.isCombineType ) {
            res = ComplexUnit.getVector.call( ftype.combine.type, res );
            continue;
        }

        const family = ftype.family.name;
        if( !res.has( family ) ) {
            res.set( family, fpower*ftype.defaultPower );
        } else {
            res.set( family, res.get( family ) + fpower*ftype.defaultPower );
        }
    }

    for(const [ftype, fpower] of res) {
        if( fpower === 0 ) { res.delete( ftype ) }
    }

    return res;
}

ComplexUnit.typeConversion = function( type ) {

    fvector = ComplexUnit.getVector.call( this );
    svector = ComplexUnit.getVector.call( type );

    let fkeys=[]; for(el of fvector.keys()) { fkeys.push(el) }
    let skeys=[]; for(el of fvector.keys()) { skeys.push(el) }
    if( fkeys.length != skeys.length ) { 
        throw new Error( `Cannot convert ${this.toString()} to ${type.toString()} \nDifferent length of vector: ${fkeys.length} and ${skeys.length}` );
    }

    for(let ftype of fkeys) {
        let fpower = fvector.get( ftype );
        let spower = svector.get( ftype );
        
        if( spower != fpower ) {
            throw new Error( `Cannot convert ${this.toString()} to ${type.toString()} \nUnit: ${ftype.symbol}${fpower} cannot convert` );
        }
    }

    let newType  = new Map( this.type );
    type = type.type ?? type;

    startPoint: for(const [ftype, fpower] of this.type) {
        let stype, spower;
        for([stype, spower] of type) {
            if( ftype.family != stype.family ) { continue; }
            // const isFirst = ftype.conversionLvl < stype.conversionLvl ? false : true;
            const isFirst = false;
            newType.delete( ftype ); 
            newType.set(isFirst ? ftype : stype, spower);

            continue startPoint;
        }
    }
    return new ComplexUnit( newType );
};

ComplexUnit.getVectorKoefs = function( type, isTo=true, res = 1, prefixDegree=0 ) {
    type = type.type ?? type;
    for(const [ftype, fpower] of type) {
        let combineRes = [ 1, 0 ];
        if( ftype.isCombineType ) {
            combineRes = ComplexUnit.getVectorKoefs( ftype.combine.type, isTo, res, prefixDegree );
        }

        const Prefix = ( ftype.prefix ? ftype.prefix.prefix : 0 ) * ftype.defaultPower * fpower;
        if( isTo ) {
            prefixDegree += combineRes[1];
            prefixDegree += Prefix;
            res *= combineRes[0] * (ftype.toMain ** (ftype.defaultPower*fpower));
        } else {
            prefixDegree += combineRes[1];
            prefixDegree -= Prefix;
            res *= combineRes[0] * (ftype.fromMain ** (ftype.defaultPower*fpower));
        }
    }
    return [res, prefixDegree];
}

ComplexUnit.typeConversionKoef = function( type ) {
    this.typeConversion( type );
    const res1 = ComplexUnit.getVectorKoefs( this, true );
    const res2 = ComplexUnit.getVectorKoefs( type, false );
    return (res1[0] * res2[0]) * (10**(res1[1] + res2[1]));
};

// ComplexUnit.typeConversionKoef = function( type ) {
//     const oldType = type;
//     type = type.type ?? type;
//     let res = 1, prefixDegree=0;

//     startPoint: for(const [ftype, fpower] of this.type) {
//         let stype, spower;
//         for([stype, spower] of type) {
//             if( ftype.family != stype.family ) { continue; }
//             if( ftype.defaultPower*fpower!=stype.defaultPower*spower ) { continue; }
//             if( ftype == stype && ftype.defaultPower*fpower===stype.defaultPower*spower ) { continue startPoint; }

//             const lPrefix = ( ftype.prefix ? ftype.prefix.prefix : 0 ) * ftype.defaultPower * fpower;
//             const rPrefix = ( stype.prefix ? stype.prefix.prefix : 0 ) * stype.defaultPower * spower;
//             prefixDegree += lPrefix-rPrefix;
//             res *= (ftype.toMain ** (ftype.defaultPower*fpower));
//             res *= (stype.fromMain ** (stype.defaultPower*spower));
//             continue startPoint;
//         }
//         let fstr, sstr;
//         const prepareOutput = function(power, dpower, symbol) {
//             let str;
//             if(power!=1 && dpower!=1) {
//                 str = '(' + symbol + dpower + ')' + power;
//             } else if (power!=1) {
//                 str = symbol + power;
//             } else if (dpower!=1) {
//                 str = symbol + dpower;
//             } else {
//                 str = symbol;
//             }
//             return str;
//         }
//         fstr = prepareOutput(fpower, ftype.defaultPower, ftype.symbol);
//         sstr = prepareOutput(spower, stype.defaultPower, stype.symbol);
//         throw new Error( `Cannot convert ${this.toString()} to ${oldType.toString()} \nUnit: ${fstr} cannot convert to: ${sstr}` );
//     }
//     res *= 10 ** prefixDegree;
//     return res;
// };

ComplexUnit.toString = function() {
    let arrL = [], arrR = [];
    for([ftype, fpower] of this.type) {
        const power = fpower * ftype.power;
        if( power === 1 ) {
            arrL.push( ftype.symbol );
        }
        if( power > 0 && power!=1 ) {
            arrL.push( ftype.symbol + power );
        }
        if( power === -1 ){
            arrR.push( ftype.symbol );
        }
        if( power < 0 && power!=-1 ) {
            arrR.push( ftype.symbol + (-1 * power) );
        }
    }
    
    let res;
    if( arrR.length === 1 ) {
        res = arrL.join( "*" ) + "/" + arrR[0];
    }
    if( arrR.length > 1 ) {
        res = arrL.join( "*" ) + "/" + arrR.join( "/" );
    }
    if( arrR.length === 0 ) {
        res = arrL.join( "*" );
    }
    return res;

};

module.exports = ComplexUnit;
