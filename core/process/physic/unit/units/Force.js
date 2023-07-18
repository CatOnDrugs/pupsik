const Unit = require('../core/Unit');
const ComplexUnit = require('../core/ComplexUnit');

const Mass = require('./Mass');
const Length = require('./Length');
const Time = require('./Time');

let Force = function ( ) { };
let NewUnit = Force;

NewUnit.prototype = Unit;
Unit.call( NewUnit );


NewUnit.push({
    name: 'Nuton',
    symbol: 'N',
    defaultPower: 1,
    power: 1,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isCombineType: true,
    combine: new ComplexUnit([
        [Mass.bySymbols.kg,  1],
        [Length.bySymbols.m, 1],
        [Time.bySymbols.s,  -2],
    ]),

    isPrefixSupport: true,
});

NewUnit.update();

module.exports = Force;
