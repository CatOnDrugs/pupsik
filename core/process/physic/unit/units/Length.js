const Unit = require('../core/Unit');

let Length = function ( ) { };
let NewUnit = Length;

NewUnit.prototype = Unit;
Unit.call( NewUnit );


// Metric

NewUnit.push({
    name: 'meter',
    symbol: 'm',
    defaultPower: 1,
    power: 1,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isPrefixSupport: true,
});

NewUnit.push({
    name: 'area',
    symbol: 'm',
    defaultPower: 2,
    power: 2,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isPrefixSupport: true,
});

NewUnit.push({
    name: 'volume',
    symbol: 'm',
    defaultPower: 3,
    power: 3,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isPrefixSupport: true,
});

// Imperial/US 

NewUnit.push({
    name: 'inch',
    symbol: 'inch',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 25.4/1000,
    fromMain: 1/25.4*1000,
    conversionLvl: 0,
});

NewUnit.push({
    name: 'foot',
    symbol: 'foot',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 0.3048,
    fromMain: 1/0.3048,
    conversionLvl: 0,
});

NewUnit.push({
    name: 'thou',
    symbol: 'thou',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 25.4/1000/1000,
    fromMain: 1/25.4*1000*1000,
    conversionLvl: 0,
});

NewUnit.push({
    name: 'yard',
    symbol: 'yard',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 0.9144,
    fromMain: 1/0.9144,
    conversionLvl: 0,
});

NewUnit.push({
    name: 'mile',
    symbol: 'mile',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 1609.344,
    fromMain: 1/1609.344,
    conversionLvl: 0,
});

NewUnit.push({
    name: 'league',
    symbol: 'league',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 4800,
    fromMain: 1/4800,
    conversionLvl: 0,
});

// Science

NewUnit.push({
    name: 'lunar distance',
    symbol: 'LD',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 384402*1000,
    fromMain: 1/(384402*1000),
    conversionLvl: 0,
});

// 

NewUnit.push({
    name: 'nail',
    symbol: 'nail',
    defaultPower: 1,
    power: 1,
    conversionLvl: 0,
    toMain: 1/17.486,
    fromMain: 17.486,
    conversionLvl: 0,
});

NewUnit.push({
    name: 'hectare',
    symbol: 'ha',
    defaultPower: 2,
    power: 1,
    conversionLvl: 0,
    toMain: 100,
    fromMain: 1/100,
});

NewUnit.update();

module.exports = Length;
