const Unit = require('../core/Unit.js');

let Time = function ( ) { };
let NewUnit = Time;

NewUnit.prototype = Unit;
Unit.call( NewUnit );

NewUnit.push({
    name: 'second',
    symbol: 's',
    defaultPower: 1,
    power: 1,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,
});

NewUnit.push({
    name: 'min',
    symbol: 'min',
    defaultPower: 1,
    power: 1,
    conversionLvl: 900,
    toMain: 60,
    fromMain: 1/60,
});

NewUnit.push({
    name: 'hour',
    symbol: 'h',
    defaultPower: 1,
    power: 1,
    conversionLvl: 800,
    toMain: 3600,
    fromMain: 1/3600,
});

NewUnit.push({
    name: 'day',
    symbol: 'd',
    defaultPower: 1,
    power: 1,
    conversionLvl: 700,
    toMain: 60*60*24,
    fromMain: 1/(60*60*24),
});

NewUnit.push({
    name: 'week',
    symbol: 'w',
    defaultPower: 1,
    power: 1,
    conversionLvl: 600,
    toMain: 60*60*24*7,
    fromMain: 1/(60*60*24*7),
});

NewUnit.push({
    name: 'month',
    symbol: 'm',
    defaultPower: 1,
    power: 1,
    conversionLvl: 400,
    toMain: 60*60*24*30,
    fromMain: 1/(60*60*24*30),
});

NewUnit.push({
    name: 'year',
    symbol: 'y',
    defaultPower: 1,
    power: 1,
    conversionLvl: 500,
    toMain: 60*60*24*365,
    fromMain: 1/(60*60*24*365),
});

NewUnit.push({
    name: 'century',
    symbol: 'c',
    defaultPower: 1,
    power: 1,
    conversionLvl: 300,
    toMain: 60*60*24*365*100,
    fromMain: 1/(60*60*24*365*100),
});

NewUnit.push({
    name: 'millennium',
    symbol: 'ky',
    defaultPower: 1,
    power: 1,
    conversionLvl: 200,
    toMain: 60*60*24*365*1000,
    fromMain: 1/(60*60*24*365*1000),
});

NewUnit.update();

module.exports = Time;
