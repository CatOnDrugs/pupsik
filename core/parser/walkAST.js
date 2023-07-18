
function walkAST( node, type ) {
    if (node) {
        try {
            if( Array.isArray(node) ) {
                return type.ArrayParam( node );
            }
            return type[node.type]( node );
        } catch ( error ) {
            console.log('HERE');
            console.log( `ERROR: unexpect type "${node.type}". walkAST` );
            console.log(node);
            console.log(error);
        }
    }
};

let UpdateCode = {
    code: '',
    debug: function( node ) {
        if( this.isDebug ) {
            console.log(`!It is standart update behaviour of ` + node.type);
       }
    },

    replaceCode: function( node, str ) {
        let offset = str.length - ( node.end - node.start );
        this.code = this.code.slice(0, node.start).concat(str, this.code.slice(node.end));
        offset = this.updateLocation( node, offset );
        // console.log( "Code\n" + this.code + "---\n" );
        return offset;
    },
    
    updateLength: function( node, length ) {
        node.end += length;
        return length;
    },

    updateOffset: function( node, offset) {
        node.offset = (node.offset ?? 0) + offset;
        node.start += offset;
        node.end += offset;
        return offset;
    },

    updateLocation: function( node, length, offset=0) {
        offset = this.updateOffset( node, offset );
        if( length > 0 ) { length = this.updateLength( node, length ) }
        return offset + length;
    },

    updateNodeLocation: function( node, params ) {
        // let preNode = { ...node };
        params = params.filter( param => node[param]!=null );

        let foo = 0;
        let sum = 0;
        for(let param of params) {
            let elem = node[param];
            this.updateOffset( elem, node.offset + sum );
            foo = walkAST(elem, this);
            sum += foo;
        }
        this.updateLength( node, sum );
        return sum;
    },
};

let UpdateNodes  = {
    __proto__: UpdateCode,

    ArrayParam: function( node ) {
        //      param0  param1  param2
        //        v        v      v
        // let    a,       b,     c = 10;
        //
        //            param0  param1  
        //              v        v   
        // function (   a,       b  ) { ... }
        // 
        // node.params
        let params = [];
        for(let param=0; param<node.length; param++) {
            params.push( param );
        }
        return this.updateNodeLocation( node, params );
    },

    BlockStatement: function( node ) {
        //               body
        //                v
        // function () { ... }
        // while()     { ... }
        // for()       { ... }
        //             { ... }
        //
        // node.body[]
        return this.updateNodeLocation( node, ["body"] );
    },
    
    Program: function( node ) {
        // node.body[]
        node.offset = 0;
        node.body.map( (newNode) => { 
            this.updateOffset( newNode, node.offset );
            node.offset += walkAST(newNode, this) 
        } );
    },

    VariableDeclaration: function( node ) {
        // kind  declarations[0]
        //  v          v
        // let         a;
        //
        // node.declarations[]
        return this.updateNodeLocation( node, ["declarations"] );
    },

    VariableDeclarator: function( node ) {
        //    id  init
        //     v    v
        // let a = 100;
        //
        // node.id, node.init
        return this.updateNodeLocation( node, ["id", "init"] );
    },

    BreakStatement: function( node ) {
        //                          label
        //                            v
        // loop: for() { ...; break loop; }
        //
        // node.label
        return this.updateNodeLocation( node, ["label"] );
    },

    ContinueStatement: function( node ) {
        //                             label
        //                               v
        // loop: for() { ...; continue loop; }
        //
        // node.label
        return this.updateNodeLocation( node, ["label"] );
    },

    DebuggerStatement: function( node ) {
        //         
        //         
        // debugger;
        //
        //
        return 0;
    },

    DoWhileStatement: function( node ) {
        //     body           test
        //       v             v
        // do { i++; } while( i<5 );
        //
        // node.body, node.test
        return this.updateNodeLocation( node, ["body", "test"] );
    },

    IfStatement: function( node ) {
        //     test    consequent         alterante
        //      v          v                  v
        // if( ... ) {    ...    } else {    ...   }
        //
        // node.test, node.consequent, node.alternate
        return this.updateNodeLocation( node, ["test", "consequent", "alternate"] );
    },

    ReturnStatement: function( node ) {
        //                          argument
        //                             v
        // function ...(...) { return res; }
        //
        // node.argument
        return this.updateNodeLocation( node, ["argument"] );
    },

    SwitchCase: function( node ) {
        //                  test    consequent
        //                   v    vvvvvvvvvvvvvvv
        // switch(a) {
        //              case 2:   b = 100; break;
        //              default:  b = 1000;
        //  }
        //
        // node.consequent[], node.test
        return this.updateNodeLocation( node, ["consequent", "test"] );
    },

    SwitchStatement: function( node ) {
        //   discriminant 
        //        v       
        // switch(a) {
        //              case 2:   b = 100; break;   < cases[0]
        //              default:  b = 1000;         < cases[1]
        //  }
        //
        // node.discriminant, node.cases[]
        return this.updateNodeLocation( node, ["discriminant", "cases"] );
    },

    ThrowStatement: function( node ) {
        //        argument 
        //       vvvvvvvvvvv
        // throw new Error();
        //
        // node.argument
        return this.updateNodeLocation( node, ["argument"] );
    },

    CatchClause: function( node ) {
        //                  param   body
        //                    v      v
        // try { ... } catch{err} { ... }
        //
        // node.param, node.body
        return this.updateNodeLocation( node, ["param", "body"] );
    },

    TryStatement: function( node ) {
        //      block        handler          finallizer
        //        v    vvvvvvvvvvvvvvvvvv   vvvvvvvvvvvvvvv
        // try { ... } catch{err} { ... }   finally { ... }
        //
        // node.block, node.handler, node.finalizer
        return this.updateNodeLocation( node, ["block", "handler", "finalizer"] );
    },

    WhileStatement: function( node ) {
        //        test    body
        //         v       v
        // while(false) { ... }
        //
        // node.test, node.body
        return this.updateNodeLocation( node, ["test", "body"] );
    },

    WithStatement: function( node ) {
        //       object            body
        //         v     vvvvvvvvvvvvvvvvvvvvvvvvvvv
        // with([1,2,3]) { console.log(toString()) }
        //
        // node.object, node.body
        return this.updateNodeLocation( node, ["object", "body"] );
    },

    EmptyStatement: function( node ) {
        // 
        // ;;
        //
        return 0;
    },

    LabeledStatement: function( node ) {
        // label    body
        //   v        v
        // loop: for( ... ) {
        //      ...
        // }
        // 
        // node.body, node.label
        return this.updateNodeLocation( node, ["label", "body"] );
    },

    ForStatement: function( node ) {
        //      init     test  update   body
        //        v       v      v       v
        // for(let i=0; i<10;   i++)  { ... }
        // 
        // node.init, node.test, node.update, node.body
        return this.updateNodeLocation( node, ["init", "test", "update", "body"] );
    },

    ForInStatement: function( node ) {
        //     left     right    body
        //       v        v       v
        // for( el   in  arr)  { ... }
        // 
        // node.left, node.right, node.body
        return this.updateNodeLocation( node, ["left", "right", "body"] );
    },

    FunctionDeclaration: function( node ) {
        //           id   params[0]  params[1]    body
        //            v      v          v           v
        // function test(    a,         b     )  { ... }
        // 
        // node.id, node.params[], node.body
        return this.updateNodeLocation( node, ["id", "params", "body"] );
    },

    ClassBody: function( node ) {
        //          body
        //            v
        // class A { ... }
        // 
        // node.body
        return this.updateNodeLocation( node, ["body"] );
    },

    ClassDeclaration: function( node ) {
        //      id     superClass   body
        //       v         v          v
        // class A extends B       { ... }
        // 
        // node.id, node.superClass, node.body
        return this.updateNodeLocation( node, ["id", "superClass", "body"] );
    },

    ClassExpression: function( node ) {
        //      left          right
        //        v             v
        // const foo = class { ... }
        //
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    MethodDefinition: function( node ) {
        //                static(true/false)   kind(method/set/get/construtor)        key            value
        //                         v                         v                         v               v
        // const foo = class A { static                  __________                funcName() {       ...      } }
        //                                                  set                    funcName() {       ...      } 
        //                                                  get                    funcName() {       ...      } 
        //                                               construtor                ________() {       ...      } 
        //
        // node.static, node.computed, node.key, node.kind, node.value
        return this.updateNodeLocation( node, ["key", "value"] );
    },

    PropertyDefinition: function( node ) {
        //                static(true/false)  key    value
        //                         v           v       v
        // const foo = class A { static      node = "value"; }
        //
        // node.static, node.computed, node.key, node.value
        return this.updateNodeLocation( node, ["value", "key"] );
    },

    StaticBlock: function( node ) {
        //                          body
        //                  vvvvvvvvvvvvvvvvvvvvvv 
        // class A { static { console.log("ok"); } }
        //
        // node.body
        return this.updateNodeLocation( node, ["body"] );
    },

    ExportAllDeclaration: function( node ) {
        //              exported       source
        //                 v              v
        // export *  as   oke    from "module";
        // 
        // node.exported, node.source
        return this.updateNodeLocation( node, ["exported", "source"] );
    },

    ExportDefaultDeclaration: function( node ) {
        //            declaration
        //                 v
        // export default var2;
        //
        // node.declaration
        return this.updateNodeLocation( node, ["declaration"] );
    },

    ExportNamedDeclaration: function( node ) {
        //          declaration     |             specifiers[0]  specifiers[1]
        //        vvvvvvvvvvvvvv    |                   v              v
        // export const var2 = 1;   |    export {      var1,          var2     };
        //
        // node.declaration, node.specifiers, node.source
        return this.updateNodeLocation( node, ["declaration", "specifiers", "source"] );
    },

    ExportSpecifier: function( node ) {
        //         local  exported
        //           v        v
        // export { var1 as name1 };
        //
        // node.local, node.exported
        return this.updateNodeLocation( node, ["local", "exported"] );
    },

    ImportDeclaration: function( node ) {
        //    specifiers[0]     source
        //         v              v
        // import vars from './export.mjs';
        //
        // node.specifiers, node.source
        return this.updateNodeLocation( node, ["specifiers", "source"] );
    },

    ImportDefaultSpecifier: function( node ) {
        //       local     
        //         v       
        // import vars from './export.mjs';
        //
        // node.local
        return this.updateNodeLocation( node, ["local"] );
    },

    ImportNamespaceSpecifier: function( node ) {
        //               local
        //                 v
        // import * as name_vars from './export.mjs';
        //
        // node.local
        return this.updateNodeLocation( node, ["local"] );
    },

    ImportSpecifier: function( node ) {
        //        imported     local
        //            v          v
        // import { vars   as   vr1 } from './export.mjs';
        //
        // node.imported, node.local
        return this.updateNodeLocation( node, ["imported", "local"] );
    },

    RestElement: function( node ) {
        //                            argument
        //                                v
        // function name(a, b, c,   ...theArgs   ) { ... }
        // [a , b,                  ...theArgs   ] = [10, 20, 30, 40, 50];
        //
        // node.argument
        return this.updateNodeLocation( node, ["argument"] );
    },

    ArrayPattern: function( node ) {
        //   elements[0]   elements[1]   elements[2]
        //       v             v             v
        // [     a      ,      b      ,   ...rest    ] = [10, 20, 30, 40, 50];
        // 
        // node.elments
        return this.updateNodeLocation( node, ["elements"] );
    },

    AssignmentPattern: function( node ) {
        //             left  right
        //               v     v
        // function a(b, c  =  0) { ... }
        // 
        // node.left, node.right
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    SequenceExpression: function( node ) {
        //       expressions[0]  expressions[1]
        //             v              v
        // x = (      x++,            x         );
        //
        // node.expressions
        return this.updateNodeLocation( node, ["expressions"] );
    },

    AssignmentExpression: function( node ) {
        //  left  operator  right     left  operator  right
        //    v      v        v         v      v        v
        //    x      =        y;        x     <<=       y;   
        //    x     +=        y;        x     >>=       y;   
        //    x     -=        y;        x     >>>=      y;   
        //    x     *=        y;        x     &=        y;
        //    x     /=        y;        x     ^=        y;
        //    x     %=        y;        x     |=        y;
        //    x     **=       y;        x     &&=       y;
        //    x     ||=       y;        x     ??=       y;
        //            
        //
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    ConditionalExpression: function( node ) {
        //    test       consequent   alternate 
        //      v            v            v   
        // isCondition ?    res1    :    res2;    
        //            
        // node.test, node.consequent, node.alternate
        return this.updateNodeLocation( node, ["test", "consequent", "alternate"] );
    },

    LogicalExpression: function( node ) {
        //  left  operator  right 
        //    v      v        v   
        //    x     ||        y;    
        //            
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    UnaryExpression: function( node ) {
        //  operator  argument 
        //     v         v           
        //     ~         2    ;    
        //     !       false  ;    
        //            
        // node.operator, node.prefix, node.argument
        return this.updateNodeLocation( node, ["argument"] );
    },

    UpdateExpression: function( node ) {
        //  operator  argument 
        //     v         v           
        //    ++         i    ;    
        //    --         i    ;    
        //            
        // node.operator, node.argument, node.prefix
        return this.updateNodeLocation( node, ["argument"] );
    },

    ChainExpression: function( node ) {
        //
        //
        // a.b?.c
        //
        // node.expression
        console.log( node );
        process.exit();
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    MemberExpression: function( node ) {
        //  object  property
        //    v        v         
        //  Math.     PI  
        //
        // node.object, node.property, node.computed, node.optional
        return this.updateNodeLocation( node, ["object", "property"] );
    },

    CallExpression: function( node ) {
        //  callee    optional(true/false)   arguments[0]
        //  vvvvvvv            v                  v
        //  String            ___          (      20      );
        //  Math.PI            ?.          (     100      );
        //
        // node.callee, node.arguments, node.optional
        return this.updateNodeLocation( node, ["callee", "arguments"] );
    },

    TaggedTemplateExpression: function( node ) {
        console.log( 'WalkAST, TaggedTemplateExpression. Фига, нашелся )' );
        console.log( node );
        process.exit();
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    Super: function( node ) {
        //                                     type
        //                                       v
        // class A extends B { constructor() { super() }}`;
        //
        console.log( node );
        process.exit();
        return 0;
    },

    ThisExpression: function( node ) {
        // 
        //  
        //  this
        //
        return 0;
    },

    ArrayExpression: function( node ) {
        //              elements[0]  elements[1]  elements[2]
        //                   v           v            v
        // let array = [     1     ,     2      ,     3      ];
        //
        // node.element
        return this.updateNodeLocation( node, ["elements"] );
    },

    ImportExpression: function( node ) {
        console.log( 'WalkAST, ImportExpression. Фига, нашелся )' );
        console.log( node );
        process.exit();
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    Literal: function( node ) {
        // let a =         10 ;   raw = '10', value = 10
        // let a = 'adgvx cvx';   raw = 'adgvx cvx', value = "adgvx cvx"
        // 
        // node.value, node.raw
        return 0;
    },

    ParenthesizedExpression: function( node ) {
        console.log( node );
        process.exit();
    },

    MetaProperty: function( node ) {
        console.log( node );
        process.exit();
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    NewExpression: function( node ) {
        //     callee  arguments[0]
        //        v          v
        // new String(     'ok'     );
        //
        // node.callee, node.arguments[]
        return this.updateNodeLocation( node, ["callee", "arguments"] );
    },

    TemplateElement: function( node ) {
        //          value                        value
        //  vvvvvvvvvvvvvvvvvvvvv        vvvvvvvvvvvvvvvvvvvvv
        // `This text of template ${a+b} this tail of template`
        //
        //        tail=false                   tail=true
        //  vvvvvvvvvvvvvvvvvvvvv        vvvvvvvvvvvvvvvvvvvvv
        // `This text of template ${a+b} this tail of template`
        //
        // node.value, node.tail
        return 0;
    },

    TemplateLiteral: function( node ) {
        //  quasis[0]  expressions    quasis[1]
        //      v          v              v
        // `test is here ${a} more text for god of text`
        // 
        // quasis состоит из TemplateElement
        //
        // node.expressions, node.quasis
        return this.updateNodeLocation( node, ["expressions", "quasis"] );
    },

    ObjectPattern: function( node ) {
        // Правильно эта штука называется деструктуризация объекта
        //        properties[0]    properties[0]
        //              v                v
        // const {     var1,           var2       } = { var1: 10, var2: 20 }
        // const { var1: newName1, var2: newName2 } = { var1: 10, var2: 20 }
        //
        // node.propperties
        return this.updateNodeLocation( node, ["properties"] );
    },

    ObjectExpression: function( node ) {
        //   properties[0]  properties[1]
        //   vvvvvvvvvvvvv  vvvvvvvvvvvvv
        // { prop1: "val1", prop2: "val2" }
        // 
        // node.properties
        return this.updateNodeLocation( node, ["properties"] );
    },

    SpreadElement: function( node ) {
        //  argument
        //      v
        // ...numbers;
        //
        // argument
        return 0;
    },

    Property: function( node ) {
        //     key      value
        //      v         v
        // { property: "value" }
        //
        // node.key, node.value
        return this.updateNodeLocation( node, ["key", "value"] );
    },

    FunctionExpression: function( node ) {
        //         async(true/false)          generator(true/false)  params[0]    body
        //                v                           v                  v          v
        //       (      _____         function       ___            (    a    )  { ... } )
        //       (      async         function       ___            (    a    )  { ... } )
        // let a =      _____         function        *             (    a    )  { ... } ;
        //
        // node.expression, node.genertor, node.async, node.params[], node.body
        return this.updateNodeLocation( node, ["params", "body"] );
    },

    ArrowFunctionExpression: function( node ) {
        //  params[0]  params[1]      body
        //     v          v             v
        // (   a,         b     ) => { ... }
        //     a                  => { ... }
        //     a                  =>   ...;
        //
        // node.expression, node.generator, node.async, node.params[], node.body
        return this.updateNodeLocation( node, ["params", "body"] );
    },

    PrivateIdentifier: function( node ) {
        //               name
        //                 v
        // class A { #privateField; }
        //
        // node.name
        return 0;
    },

    YieldExpression: function( node ) {
        //                                argument     
        //                                   vvv              
        // function* funcName() { ...; yield a+b; ... }      
        //
        // function* generator1() { yield 1; yield 2; }               
        // function* generator2() { yield* generator1(); }
        //                               ^
        //                      delegate(true/false)
        //
        // node.delegate, node.argument
        return this.updateNodeLocation( node, ["argument"] );
    },

    AwaitExpression: function( node ) {
        //                                      argument     
        //                                          v              
        // async function funcName() { ...; await promise; ... }      
        //
        // node.argument
        return this.updateNodeLocation( node, ["argument"] );
    },

    Identifier: function( node ) {
        //   name
        //     v
        // let a = 10;
        //
        // node.name
        return 0;
    },

    BinaryExpression: function( node ) {
        // left  operator  right
        //   v       v       v
        // var1     ===     var2
        // var1      >      var2 
        //          ...     
        //
        // node.left, node.right, node.operator
        return this.updateNodeLocation( node, ["left", "right"] );
    },

    ExpressionStatement: function( node ) {
        //
        // Вообще любое выражение
        //
        // node.expression
        return this.updateNodeLocation( node, ["expression"] );
    },
};

function compile( code, AST, updater=UpdateNodes ) {
    updater.code = code;
    walkAST( AST, updater );
    return updater.code;
};


module.exports = {
    compile,
    UpdateNodes,
    walkAST,
};

