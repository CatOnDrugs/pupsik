const Prefix = require('./Prefix.js');

let Unit = function () {
    this.units = [];
    this.byNames = { };
    this.bySymbols = { };
    this.__listNames = [];

    this.push = function ( obj, symbols=[], names=[] ) {
        Object.defineProperty( obj, 'family', {
            value: this,
            writable: false,
            configurable: false,
            enumerable: false,
        })
        this.units.push( obj );

        if( obj.symbol ) { symbols.push( obj.symbol ); }
        if( !obj.power ) { obj.power = 1; }
        for(let i=0; i<symbols.length; i++) {
            this.byNames[names[i]] = obj;
        }

        if( obj.name )   { names.push( obj.name ); }
        for(let i=0; i<names.length; i++) {
            const power = obj.defaultPower ?? 1;
            this.bySymbols[symbols[i]] = this.bySymbols[symbols[i]] ?? [];
            this.bySymbols[symbols[i]][power] = obj;
        }

        if( obj.isPrefixSupport ) {
            let newObj;
            obj.noPrefixUnit = obj;
            for( pref of Prefix ) {
                newObj = {
                    ...obj,
                    isPrefixSupport: false,
                    name: pref.name + obj.name,
                    symbol: pref.symbol + obj.symbol,
                    prefix: pref,
                };
                this.push( newObj );
            }
        };
    }

    this.update = function() {
        this.__listNames = Object.keys(this.bySymbols);
        this.__listNames.sort( (a,b) => b.length - a.length );
    }

    this.startWith = function( prefix ) {
        return Unit.startWith( prefix, this );
    }
};


Unit.startWith = function( prefix, unitObj ) {
    if( Array.isArray( unitObj )) {
        let res = [undefined, prefix], foo_res;
        for(let i=0; i<unitObj.length; i++) {
            foo_res = this.startWith( prefix, unitObj[i] );
            if( foo_res[0] === undefined ) { continue; }
            if( foo_res[1].length < res[1].length ) { res = foo_res; }
        }
        return res;
    }
    let listNames = unitObj.__listNames;
    for(let i=0; i<listNames.length; i++) {
        if( prefix.startsWith( listNames[i] )) {
            const name = listNames[i];
            const l = name.length;
            return [ unitObj.bySymbols[name], prefix.slice(l) ];
        }
    }
    return [ undefined, prefix ];
};

module.exports = Unit;
