
const repl = require('repl');
const vm = require('vm');

const ObjectOp = require('./process/math/objectOp/index');
const Postfix = require('./process/index');
const UnitValue = require('./process/physic/unit/core/UnitValue');

const createCompile = require('./parser/transform');
const compile = createCompile({
    // all: false,
});


/**
 *
 * @param {string} js Текст js кода
 * @param {object} context Объект контекста в котром запускается код/команда
 * @param {strign} filename Строка вида REPL${num}, где num номер отправленного через REPL кода 
 * @return {string} Возвращает результат работы команды
 */
function runInContext(js, context, filename) {
    // if(context === global) {
    //     return vm.runInThisContext( js, filename );
    // }
    return vm.runInThisContext( js, context, filename );
}

/**
 * Callback используемый для передачи возврата значения в консоль
 *
 * @callback requestCallback
 * @param {error|null} error Объект ошибки, если вдруг поймали. Если не поймали то null
 * @param {string} result Строка которая вернется консоли в каечестве результата работы
 */


/*
 * @param {string} input Строка введенная пользователем в REPL
 * @param {object} context Объект контекста REPL
 * @param {string} filename Строка вида REPL${num}, где num номер отправленного через REPL кода 
 * @param {requestCallback} callback Функция через которую возвращаем результат работы
 * */
function evalInput( input, context, filename, callback ) {
    // console.log( input );
    try {
        let newCode;
        try {
            // newCode = compile( input, {ecmaVersion: "latest", sourceType: "module" } );
            newCode = compile( input );
            console.log( newCode );
        } catch( e ) {
            if( e.name === 'SyntaxError' ) {
                if( input.charCodeAt(e.pos-1)===10 ) {
                    callback( new repl.Recoverable(e));
                    return;
                }
                callback( e );
                return;
            }
        }
        let res = runInContext(newCode, context, filename);
        callback( null, res);
    } catch (e) {
        if( e.name === 'SyntaxError' ) {
            callback( new repl.Recoverable(e));
            return;
        }
        callback( e );
    }
}

function modifyOutput( output ) {
    if( output instanceof UnitValue ) {
        return output.toString();
    }
    return output;
};

// const r = repl.start();
const r = repl.start({useGlobal: true, eval: evalInput, writer: modifyOutput});

const pupsik = {
    // Supprot Base Operator
    sbo: ObjectOp.SupportBaseOp,
    // Postfix init
    pfi: Postfix.initObjPostfix,
    // Postfix update
    pfu: Postfix.updateObjPostfix,
}

Object.defineProperty(r.context, 'pupsik', {
    value: pupsik,
    enumerable: false,
    configurable: false,
    writable: false
});
