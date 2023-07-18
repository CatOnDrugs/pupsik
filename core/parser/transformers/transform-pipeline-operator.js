
function updateAcorn( acorn ) {
    let proto = acorn.Parser.prototype;
    let tokTypes = acorn.tokTypes;
    let TokenType = acorn.TokenType;

    tokTypes.pipe = new TokenType("|>", { beforeExpr: true, binop: 10 });
    tokTypes.pipeResult = new TokenType("%%");

    getTokenFromCode = proto.getTokenFromCode; 
    proto.getTokenFromCode = function( code ) {
        switch (code) {
            case 124: // '|'
                if( this.input.charCodeAt(this.pos + 1) === 62 ) {
                    debugger;
                    return this.readToken_pipe( );
                }
            case 37: // '%%'
                if( this.input.charCodeAt(this.pos + 1) === 37 ) {
                    return this.readToken_pipe_result( );
                }
        }
        return getTokenFromCode.call( this, code );
    };

    proto.readToken_pipe = function( ) {
        return this.finishOp(tokTypes.pipe, 2)
    };

    proto.readToken_pipe_result = function( ) {
        return this.finishOp(tokTypes.pipeResult, 2)
    };

    parseExprAtom = proto.parseExprAtom; 
    proto.parseExprAtom = function (refDestructuringErrors, forInit) {
        var node, canBeArrow = this.potentialArrowAt === this.start;
        if( this.type === tokTypes.pipeResult ) {
            var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
            var node = this.startNode();
            node.name = '%%';
            this.next(false);
            this.finishNode(node, "Identifier");

            var id = node;
            if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(tokTypes._function)) {
                this.overrideContext(types.f_expr);
                return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit)
            }
            if (canBeArrow && !this.canInsertSemicolon()) {
                if (this.eat(tokTypes.arrow))
                { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit) }
                if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === tokTypes.name && !containsEsc &&
                    (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
                    id = this.parseIdent(false);
                    if (this.canInsertSemicolon() || !this.eat(tokTypes.arrow))
                    { this.unexpected(); }
                    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit)
                }
            }
            return id
        }

        return parseExprAtom.call(this, refDestructuringErrors, forInit);
    }
};

function updateWalkAST( walkAST ) {
    pipeVariableName = 'arguments[0]';

    let UpdateNodes = { __proto__: walkAST.UpdateNodes };

    let BinaryExpression = walkAST.UpdateNodes.BinaryExpression;
    UpdateNodes.BinaryExpression = function (node) {
        let length;
        length = BinaryExpression.call(this, node);
        if( node.operator === '|>' ) {
            let newCode, offset;
            newCode = '(function() {return ' + this.code.slice( node.right.start, node.right.end ) + '})(' + this.code.slice( node.left.start, node.left.end ) + ')';
            offset = this.replaceCode( node, newCode );
            return length + offset;
        }
        return length;
    }

    let Identifier = walkAST.UpdateNodes.Identifier;
    UpdateNodes.Identifier = function( node ) {
        if( node.name === "%%" ) {
            let offset = this.replaceCode( node, pipeVariableName );
            return offset;
        }
        return Identifier.call( this, node );
    };

    walkAST.UpdateNodes = UpdateNodes;
};


module.exports = {
    updateAcorn,
    updateWalkAST,
};

