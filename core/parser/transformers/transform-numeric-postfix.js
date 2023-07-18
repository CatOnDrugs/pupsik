const CONST_STRING = {
    SUPPORT_OBJ_POSTFIX: "pupsik.pfi",
    TRANSFORM: "pupsik.pfu",
};

function updateAcorn( acorn ) {
    let proto = acorn.Parser.prototype;
    const postfixIgnoreSymbols = [ '/', '*' ];

    function stringToBigInt(str) {
        if (typeof BigInt !== "function") {
            return null
        }

        // `BigInt(value)` throws syntax error if the string contains numeric separators.
        return BigInt(str.replace(/_/g, ""))
    }

    function stringToNumber(str, isLegacyOctalNumericLiteral) {
        if (isLegacyOctalNumericLiteral) {
            return parseInt(str, 8)
        }

        // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
        return parseFloat(str.replace(/_/g, ""))
    }
    
    const parseExprAtom = proto.parseExprAtom; 
    proto.parseExprAtom = function (refDestructuringErrors, forInit) {
        let pos = this.start, symCode;
        const sym = this.input[pos];
        switch (sym) {
            case "*":
                node = this.startNode();
                // this.next();
                pos++;
                symCode = this.input.charCodeAt( pos );
                while( symCode === 42 || symCode === 47 || acorn.isIdentifierChar( symCode )) {
                    pos++;
                    symCode = this.input.charCodeAt( pos );
                }
                this.start += 1;
                node.value = this.input.slice( this.start, pos );
                this.end = pos;
                this.pos = pos;
                this.next(false);
                this.finishNode(node, "Postfix");
                return node;
        }
        return parseExprAtom.call(this, refDestructuringErrors, forInit);
    }

    proto.readNumber = function( node, startsWithDot=false ) {
        var start = this.pos;
        var end = this.pos;
        switch (this.fullCharCodeAtPos()) {
            case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 0-9
                if (!startsWithDot && this.readInt(10, undefined, true) === null) {this.raise(start, "Invalid number");}
                var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
                if (octal && this.strict) {this.raise(start, "Invalid number");}
                var next = this.input.charCodeAt(this.pos);
                if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
                    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
                    ++this.pos;
                    if (acorn.isIdentifierStart(this.fullCharCodeAtPos())) {this.raise(this.pos, "Identifier directly after number");}
                    return this.finishToken(types$1.num, val$1)
                }
                if (octal && /[89]/.test(this.input.slice(start, this.pos))) {octal = false;}
                if (next === 46 && !octal) { // '.'
                    ++this.pos;
                    this.readInt(10);
                    next = this.input.charCodeAt(this.pos);
                }
                if ((next === 69 || next === 101) && !octal) { // 'eE'
                    next = this.input.charCodeAt(++this.pos);
                    if (next === 43 || next === 45) {++this.pos;} // '+-'
                    if (this.readInt(10) === null) {this.raise(start, "Invalid number");}
                }

                end = this.pos;
                var val = stringToNumber(this.input.slice(start, end), octal);
                if (acorn.isIdentifierStart(this.fullCharCodeAtPos())) {
                    let postfix = this.readWord1();
                    while( postfixIgnoreSymbols.indexOf( this.input[ this.pos ] ) != -1 ) {
                        postfix += this.input[ this.pos ];
                        this.pos++;
                        postfix += this.readWord1();
                    };
                    this.finishToken(acorn.tokTypes.num, val);
                    this.value = { type: "NumericPostfix", value: val, postfix: postfix };
                    return;
                }

                let res = this.finishToken(acorn.tokTypes.num, val);
                return;
        }

    }
}

function updateWalkAST( walkAST ) {
    let UpdateNodes = { __proto__: walkAST.UpdateNodes };

    let Literal = walkAST.UpdateNodes.Literal;
    UpdateNodes.Literal = function( node ) {
        if( typeof node.value === "object" ) {
            if( node.value.type === "NumericPostfix" ) {
                let newCode = CONST_STRING.SUPPORT_OBJ_POSTFIX + "(" + node.value.value + ", \"" + node.value.postfix + "\")";
                let offset = this.replaceCode( node, newCode );
                return offset;
            }
        }
        return Literal( node );
    };

    let MemberExpression = walkAST.UpdateNodes.MemberExpression;
    UpdateNodes.MemberExpression = function( node ) {
        let offset = MemberExpression.call( this, node );
        if( node.property.type === "Postfix" ) {
            let newCode;
            if( node.object.type === "Literal" ) {
                if(typeof node.object.value === "number") {
                    newCode = CONST_STRING.SUPPORT_OBJ_POSTFIX + "(" + node.object.value + ", \"" + node.property.value + "\")";
                } else if(typeof node.object.value === "object") {
                    newCode = CONST_STRING.TRANSFORM + "(" + this.code.slice( node.object.start, node.object.end ) + ", \"" + node.property.value + "\")";
                }
            } else if( node.object.type === "Identifier" ) {
                newCode = CONST_STRING.TRANSFORM + "(" + node.object.name + ", \"" + node.property.value + "\")";
            } else if( node.type === "MemberExpression" ) {
                newCode = CONST_STRING.TRANSFORM + "((" + this.code.slice( node.object.start, node.object.end ) + "), \"" + node.property.value + "\")";
            } else  {
                newCode = CONST_STRING.TRANSFORM + "(" + this.code.slice( node.object.start, node.object.end ) + ", \"" + node.property.value + "\")";
            }
            return offset + this.replaceCode( node, newCode );
        }
        return offset;
    }

    UpdateNodes.Postfix = function( node ) {
        let newCode = CONST_STRING.SUPPORT_OBJ_POSTFIX + "(\"" + node.value.slice(1) + "\")";
        let offset = this.replaceCode( node, newCode );
        return offset;
    }
    
    walkAST.UpdateNodes = UpdateNodes;
}


module.exports = {
    updateAcorn,
    updateWalkAST,
    CONST_STRING,
};

