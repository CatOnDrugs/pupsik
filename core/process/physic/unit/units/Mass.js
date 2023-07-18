const Unit = require('../core/Unit');

let Mass = function ( ) { };
let NewUnit = Mass;

NewUnit.prototype = Unit;
Unit.call( NewUnit );


NewUnit.push({
    name: 'electron-volt',
    symbol: 'eV',
});

NewUnit.push({
    name: 'gram',
    symbol: 'g',
    defaultPower: 1,
    power: 1,
    fromMain: 1,
    toMain: 1,
    isPrefixSupport: true,
});

NewUnit.push({
    name: 'pound',
    symbol: 'lb',
});

NewUnit.push({
    name: 'tonne',
    symbol: 't',
    isDefinition: false,
});

NewUnit.update();

module.exports = Mass;

