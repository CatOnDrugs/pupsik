const Unit = require('../core/Unit');

let TemperatureCelsius = function ( ) { };
let NewUnit = TemperatureCelsius;

NewUnit.prototype = Unit;
Unit.call( NewUnit );


// Celsius

NewUnit.push({
    name: 'Celsius',
    symbol: 'degC',
    defaultPower: 1,
    power: 1,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isSpecific: true,
});

NewUnit.update();


let TemperatureFaringate = function ( ) { };
NewUnit = TemperatureFaringate;

NewUnit.prototype = Unit;
Unit.call( NewUnit );


// Faringate

NewUnit.push({
    name: 'Faringate',
    symbol: 'degF',
    defaultPower: 1,
    power: 1,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isSpecific: true,
});

NewUnit.update();

let TemperatureDelta = function ( ) { };
NewUnit = TemperatureDelta;

NewUnit.prototype = Unit;
Unit.call( NewUnit );


// Delta

NewUnit.push({
    name: 'Delta Temperature',
    symbol: 'degD',
    defaultPower: 1,
    power: 1,
    conversionLvl: 1000,
    toMain: 1,
    fromMain: 1,

    isSpecific: true,
});

NewUnit.update();
module.exports = {
    TemperatureFaringate: TemperatureFaringate,
    TemperatureCelsius: TemperatureCelsius,
    TemperatureDelta: TemperatureDelta,
};

