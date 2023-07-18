
const DefaultOp = function( op, a, b ) {
    if( typeB === "number" || b == undefined ) {
        return op(a.value, b);
    }
    if( this.constructor == b.constructor ) {
        return op(a.value, b.value) * (-1);
    }
    return op(a.value, b.value);
};

const OBaseOp = {};

OBaseOp.bool = function() {
    if( this.value > 10 ) { return this; }
    else { return false; }
};

OBaseOp.lt = function(b) {
    return DefaultOp( (a,b) => a<b, this, b );
};
OBaseOp.gt = function(b) {
    return DefaultOp( (a,b) => a>b, this, b );
};

OBaseOp.add = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a+b, this, b ));
};
OBaseOp.radd = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b+a, this, b ));
};

OBaseOp.sub = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a-b, this, b ));
};
OBaseOp.rsub = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b-a, this, b ));
};

OBaseOp.mul = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a*b, this, b ));
};
OBaseOp.rmul = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b*a, this, b ));
};

OBaseOp.div = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a/b, this, b ));
};
OBaseOp.rdiv = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b/a, this, b ));
};

OBaseOp.mod = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a%b, this, b ));
};
OBaseOp.rmod = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b%a, this, b ));
};

OBaseOp.pow = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a**b, this, b ));
};
OBaseOp.rpow = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b**a, this, b ));
};

OBaseOp.or = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a|b, this, b ));
};
OBaseOp.ror = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b|a, this, b ));
};

OBaseOp.and = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a&b, this, b ));
};
OBaseOp.rand = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b&a, this, b ));
};

OBaseOp.xor = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a^b, this, b ));
};
OBaseOp.rxor = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b^a, this, b ));
};

OBaseOp.lshift = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a<<b, this, b ));
};
OBaseOp.rshift = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => b>>a, this, b ));
};

OBaseOp.fill_shift = function(b) {
    return new ObjBaseOp(DefaultOp( (a,b) => a>>>b, this, b ));
};


const ObjBaseOp = function( value ) {
    this.value = value;
};
ObjBaseOp.prototype = OBaseOp;





const numTest = function( a, b ) {
    const typeA = typeof a, typeB = typeof b;
    const isNumA = (typeA === 'number' || typeA === 'string'),
          isNumB = (typeB === 'number' || typeB === 'string');
    if( a == undefined && isNumB ) { return 1 }
    if( a == undefined ) { return 3 }

    if( isNumA && b == undefined ) { return 1 }
    if( b == undefined ) { return 2 }

    if( isNumA && isNumB ) { return 1; }
    if( isNumB || !isNumA ) { return 2; }
    if( isNumA ) { return 3; }
};

const boolTest = function( a, b ) {
    if( a === undefined ) { return 3 }
    if( b === undefined ) { return 2 }
    const isBoolA = typeof a.bool === 'function', isBoolB = typeof b.bool === 'function';
    if( !isBoolA && !isBoolB ) { return 1; }
    if( !isBoolB || isBoolA ) { return 2; }
    if( isBoolB || !isBoolA ) { return 3; }
    return 4;
};

// lt,gt,add,radd,sub,rsub,mul,rmul,div,rdiv,mod,rmod,pow,rpow,and,or,xor,not,lshift,rshift,fill_rshift
const SupportBaseOp = {
    lt: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a < b;
            case 2: return a.lt(b);
            case 3: return b.gt(a);
        }
    },

    gt: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a > b;
            case 2: return a.gt(b);
            case 3: return b.lt(a);
        }
    },

    add: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a + b;
            case 2: return a.add(b);
            case 3: return b.radd(a);
        }
    },

    radd: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a + b;
            case 2: return a.radd(b);
            case 3: return b.add(a);
        }
    },

    sub: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a - b;
            case 2: return a.sub(b);
            case 3: return b.rsub(a);
        }
    },

    rsub: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b - a;
            case 2: return a.rsub(b);
            case 3: return b.sub(a);
        }
    },

    mul: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a * b;
            case 2: return a.mul(b);
            case 3: return b.rmul(a);
        }
    },

    rmul: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a * b;
            case 2: return a.rmul(b);
            case 3: return b.mul(a);
        }
    },

    div: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a / b;
            case 2: return a.div(b);
            case 3: return b.rdiv(a);
        }
    },

    rdiv: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b / a;
            case 2: return a.rdiv(b);
            case 3: return b.div(a);
        }
    },

    mod: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a % b;
            case 2: return a.mod(b);
            case 3: return b.rmod(a);
        }
    },

    rmod: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b % a;
            case 2: return b.mod(a);
            case 3: return a.rmod(b);
        }
    },

    pow: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a ** b;
            case 2: return a.pow(b);
            case 3: return b.rpow(a);
        }
    },

    rpow: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b ** a;
            case 2: return b.pow(a);
            case 3: return a.rpow(b);
        }
    },
   
    land: function(a, b) {
        switch (boolTest(a,b)) {
            case 1: return a && b;
            case 2: return a.bool() && b;
            case 3: return a && b.bool();
            case 4: return a.bool() && b.bool();
        }
    },

    lor: function(a, b) {
        switch (boolTest(a,b)) {
            case 1: return a || b;
            case 2: return a.bool() || b;
            case 3: return a || b.bool();
            case 4: return a.bool() || b.bool();
        }
    },

    or: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a | b;
            case 2: return a.or(b);
            case 3: return b.ror(a);
        }
    },

    ror: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b | a;
            case 2: return b.ror(a);
            case 3: return a.or(b);
        }
    },

    and: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a & b;
            case 2: return a.and(b);
            case 3: return b.rand(a);
        }
    },

    rand: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b & a;
            case 2: return b.and(a);
            case 3: return a.rand(b);
        }
    },

    xor: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a ^ b;
            case 2: return a.xor(b);
            case 3: return b.rxor(a);
        }
    },

    rxor: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return b ^ a;
            case 2: return b.xor(a);
            case 3: return a.rxor(b);
        }
    },

    not: function(a) {
        if( a === undefined || typeof a.bool != 'function' ) { return !a }
        return !a.bool();
    },

    lshift: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a << b;
            case 2: return a.lshift(b);
            case 3: return b.rshift(a);
        }
    },

    rshift: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a >> b;
            case 2: return a.rshift(b);
            case 3: return b.lshift(a);
        }
    },
    
    fill_shift: function(a, b) {
        switch (numTest(a,b)) {
            case 1: return a >>> b;
            case 2: return a.fill_shift(b);
            case 3: return b.lshift(a);
        }
    },
};

module.exports = {
    SupportBaseOp: SupportBaseOp,
    ObjBaseOp: ObjBaseOp,
};

