
let fp = require('../fileprocess/fileprocess');

let createCompile = function( options={} ) {
    if( options.all === false ) {
        options = options;
    } else {
        options = {...createCompile.defaultOptions, ...options};
    }
    let acorn = require('./acorn');
    let acornWalkAST = require('./walkAST');
    const dictModuless = {
        'pipeline-op': './transformers/transform-pipeline-operator',
        'phys-postfix': './transformers/transform-numeric-postfix',
        'math-to-obj': './transformers/transform-math-operators',
    }

    let plugin;
    for( const [key, value] of Object.entries( dictModuless )) {
        if( options[key] ) {
            plugin = require( dictModuless[key] );
            plugin.updateAcorn( acorn );
            plugin.updateWalkAST( acornWalkAST );
        }
    }

    return function( code, acornOptions={ecmaVersion: "latest"} ) {
        function compile( code, acornOptions ) {
            let AST = acorn.parse( code, acornOptions );
            return acornWalkAST.compile( code, AST, acornWalkAST.UpdateNodes );
        }


        if( Array.isArray( code ) && code[1]!=undefined) {
            let readCode = fp.readFileSync( code[0] );
            let compileCode = compile( readCode, acornOptions );
            fp.writeFile( code[1], compileCode );
            return compileCode;
        }
        if( Array.isArray( code ) && code[1]===undefined) {
            let readCode = fp.readFileSync( code[0] );
            return compile( readCode, acornOptions );
        }
        return compile( code, acornOptions );
    };
};

createCompile.defaultOptions = {
    'pipeline-op': true,
    'phys-postfix': true,
    'math-to-obj': true,
};


module.exports = createCompile;
