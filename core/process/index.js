
const PhysicUnit = require("./physic/unit/index");

const initObjPostfix = function( num, postfix ) {
    return PhysicUnit.encodeNumPostfix( num, postfix );
}

const updateObjPostfix = function( variable, postfix ) {
    return PhysicUnit.encodeVarPostfix( variable, postfix );
}

module.exports = { 
    initObjPostfix: initObjPostfix,
    updateObjPostfix: updateObjPostfix,
};
