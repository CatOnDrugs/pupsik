const UnitValue = require('./PhysicUnit/UnitValue.js');
const Length = require('./Length.js');
const Mass = require('./Mass.js');
const Time = require('./Time.js');
const Force = require('./Force.js');
const Pressure = require('./Pressure.js');

let A, B, res;
let boolProc = function( value ) {
    if( value===true ) {
        return '✅';
    }
    if( value===false ) {
        return '❌';
    }
}

A = new UnitValue( 10, [] );
B = new UnitValue( 2, [] );
res = "Проверка значений без единиц измерения";
res = res + ': ' + boolProc(A.toString()==='10' && B.toString()==='2');
res += "\n"; console.log( res );

A = new UnitValue( 20, [[Length.bySymbols.km]] );
B = new UnitValue( 143, [[Length.bySymbols.m]] );
res = "Перевод простых единиц измерения";
res += "\n- km в m" + ': ' + boolProc(A.typeConversion( B ).toString()==='km');
res += "\n- m в km" + ': ' + boolProc(B.typeConversion( A ).toString()==='m');
res += "\n- коэфициент перевода km в m" + ': ' + boolProc(A.typeConversionKoef( B )===1000);
res += "\n- коэфициент перевода m в km" + ': ' + boolProc(B.typeConversionKoef( A )===0.001);
res += "\n"; console.log( res );

A = new UnitValue( 143, [[Length.bySymbols.m, 2]] );
B = new UnitValue( 143, [[Length.bySymbols.m, 3]] );
res = "Определение единиц измерения в зависимости от типа:";
res += "\n- m2 определить как площадь" + ': ' + boolProc(A.type.keys().next().value.name==='area');
res += "\n- m3 определить как объем" + ': ' + boolProc(B.type.keys().next().value.name==='volume');
res += "\n"; console.log( res );

res = "Проверяем работу комплексных единиц измерения и их трансформацию в строку:\n";
const len = 12;
let arrRes1 = [
    new UnitValue( 14, [
        [Length.bySymbols.m, 2],
        [Mass.bySymbols.g],
    ]),
    new UnitValue( 23, [
        [Length.bySymbols.m],
        [Mass.bySymbols.g, -3],
    ]),
    new UnitValue( 27, [
        [Mass.bySymbols.g, -3],
    ]),
    new UnitValue( 27, [
        [Mass.bySymbols.g, -3],
        [Length.bySymbols.m, -2],
    ]),
];
arrRes1 = arrRes1.map( (el) => el.toString().padEnd( len, ' ' ) );
res += arrRes1.join(' | ') + "\n";

let arrRes2 = ["14m2*g", "23m/g3", "27/g3", "27/g3/m2"];
arrRes2 = arrRes2.map( (el) => el.padEnd( len, ' ' ) );
res += arrRes2.join(' | ') + "\n";
res += '-'.repeat(arrRes1.length * (len + 3)) + "\n";

let arrRes3 = [];
for( let i=0; i<arrRes1.length; i++) {
    arrRes3[i] = boolProc( arrRes1[i]===arrRes2[i] );
}
arrRes3 = arrRes3.map( (el) => el.padEnd( len - 1, ' ' ) );
res += arrRes3.join(' | ') + "\n";
res += "\n"; console.log( res );


A = new UnitValue( 14, [
    [Length.bySymbols.m, 4],
    [Length.bySymbols.m, 2],
    [Length.bySymbols.m, -3],
    [Length.bySymbols.m, 20],
] );
res = "Указание нескольких одинаковых единиц измерения (m4*m2/m3*m20 должно превратиться в m23): ";
res += boolProc( A.toString() === "14m23" );
res += "\n"; console.log( res );



A = new UnitValue( 14, [
    [Length.bySymbols.m, 2],
    [Length.bySymbols.km, 2],
] );

B = new UnitValue( 14, [
    [Length.bySymbols.Gm, 2],
    [Length.bySymbols.km, -3],
    [Length.bySymbols.m, 1],
] );
res = "Указание нескольких одинаковых единиц измерения но с учетом префиксов системы СИ (1m2*km2 должно превратиться в 1000000km4): ";
res += "\n" + "- 14m2*km2 переведятся в 0.000014km4: " + boolProc( A.toString() === "0.000014km4" );
res += "\n" + "- 14Gm2/km3*m переведятся в 1.4e+25:  " + boolProc( B.toString() === "1.4e+25" );
res += "\n"; console.log( res );


A = new UnitValue( 20, [[Length.bySymbols.km], [Mass.bySymbols.g, 2]] );
B = new UnitValue( 143, [[Mass.bySymbols.kg, 2], [Length.bySymbols.m]] );
res = "Перевод простых единиц измерения";
res += "\n- коэфициент перевода kg2*m в km*g2" + ': ' + boolProc( A.typeConversionKoef( B ) === 0.001 );
res += "\n- коэфициент перевода km*g2 в kg2*m" + ': ' + boolProc( B.typeConversionKoef( A ) === 1000 );
res += "\n"; console.log( res );
res = "Проверка работы оператора сложения/вычитания: ";


A = new UnitValue( 5, [[Length.bySymbols.nail]] );
B = new UnitValue( 7, [[Length.bySymbols.cm]] );
res += "\n" + "- 5nail + 7cm = 35.59430401464029cm: " + boolProc( A.__add__( B ).toString()==="35.59430401464029cm" );

A = new UnitValue( 5, [[Length.bySymbols.km]] );
B = new UnitValue( -1000, [[Length.bySymbols.m]] );
res += "\n" + "- 5km + (-1000m) = 4km: " + boolProc( A.__add__( B ).toString()==="4km" );

A = new UnitValue( -5, [[Length.bySymbols.nm]] );
B = new UnitValue( 0.005, [[Length.bySymbols.μm]] );
res += "\n" + "- (-5nm) + 0.005μm: " + boolProc( A.__add__( B ).toString()==="0nm" );

A = new UnitValue( 57, [[Mass.bySymbols.kg], [Mass.bySymbols.kg]] );
B = new UnitValue( 0.005, [[Length.bySymbols.nm], [Mass.bySymbols.Pg]] );
try {
    res += "\n" + "- проверка на суммирование разных типов(Должен выдать ошибку на 57kg2 + 0.005nm*Pg): ";
    A.__add__( B ).toString();
    res += boolProc( false );
} catch ( err ) {
    res += boolProc( true );
}

A = new UnitValue( 57, [[Length.bySymbols.nm], [Mass.bySymbols.Pg], [Time.bySymbols.h]] );
B = new UnitValue( 0.005, [[Length.bySymbols.nm], [Mass.bySymbols.Pg]] );
try {
    res += "\n" + "- проверка на суммирование разных типов(Должен выдать ошибку на 57nm*Pg*h + 0.005nm*Pg): ";
    A.__add__( B ).toString();
    res += boolProc( false );
} catch ( err ) {
    res += boolProc( true );
}
res += "\n"; console.log( res );




A = new UnitValue( 21, [[Length.bySymbols.m]] );
B = new UnitValue( 4, [[Mass.bySymbols.kg]] );
res = "Проверка умножения: ";
res += "\n" + "- 21m * 4kg = 84m*kg: " + boolProc( A.__mul__(B).toString() === "84m*kg" );

A = new UnitValue( 21, [[Length.bySymbols.m, 3]] );
B = new UnitValue( 4, [[Length.bySymbols.m, -3]] );
res += "\n" + "- 21m3 * 4/m3 = 84: " + boolProc( A.__mul__(B).toString() === "84" );
res += "\n"; console.log( res );



// A = new UnitValue( 21, [[Force.bySymbols.N]] );
// B = new UnitValue( 4, [[Length.bySymbols.m], [Mass.bySymbols.kg], [Time.bySymbols.s, -2]] );
// console.log( A.toString() );
// console.log( B.toString() );
// console.log( A.typeConversion(B).toString() );
// console.log( B.typeConversion(A).toString() );

// res = "Проверка умножения: ";
// res += "\n" + "- 21m*4kg=84m*kg: " + boolProc( A.__mul__(B).toString() === "84m*kg" );
// res += "\n"; console.log( res );



res = "Проверка пеоевода комбинированных единиц измерения, таких как N: ";

A = new UnitValue( 57, [[Force.bySymbols.N]] );
B = new UnitValue( 1, [[Force.bySymbols.kN]] );
res += "\n" + "- kN в N: " + boolProc( A.typeConversionKoef( B ) === 0.001 );

A = new UnitValue( 57, [[Force.bySymbols.N]] );
B = new UnitValue( 0.005, [[Length.bySymbols.nm], [Mass.bySymbols.Pg], [Time.bySymbols.min, -2]] );
res += "\n" + "- N в nm*Pg/min2: " + boolProc( A.typeConversionKoef( B ) === 3.6 );

A = new UnitValue( 57, [[Force.bySymbols.N]] );
B = new UnitValue( 0.005, [[Pressure.bySymbols.Pa], [Time.bySymbols.s, -2], [Length.bySymbols.km, -1]] );
res += "\n" + "- 57N в kN: " + A.typeConversionKoef( B );
res += "\n"; console.log( res );



