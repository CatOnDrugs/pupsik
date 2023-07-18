
const CONST_STRING = {
    SUPPORT_OBJ_OPERATOR: "pupsik.sbo",
};

function updateAcorn( acorn ) {
    return acorn;
}

function updateWalkAST( walkAST ) {
    let UpdateNodes = { __proto__: walkAST.UpdateNodes };

    walkAST.ReplaceOperatorFunction = {

        BinaryOperators: {
            "<":   "lt",
            ">":   "gt",
            "+":   "add",
            "-":   "sub",
            "*":   "mul",
            "/":   "div",
            "%":   "mod",
            "**":  "pow",
            "&":   "and",
            "|":   "or",
            "^":   "xor",
            "<<":  "lshift",
            ">>":  "rshift",
            ">>>": "fill_rshift",
            "|":   "or",
        },

        RBinaryOperators: {
            "+":   "radd",
            "-":   "rsub",
            "*":   "rmul",
            "/":   "rdiv",
            "%":   "rmod",
            "**":  "rpow",
        },

        UnaryOperators: {
            "~": "not",
        }, 

    }

    let ops = walkAST.ReplaceOperatorFunction;
    let BinaryExpression = walkAST.UpdateNodes.BinaryExpression;
    walkAST.UpdateNodes.BinaryExpression = function (node) {
        let length = BinaryExpression.call(this, node);
        
        let binaryOperator = ops.BinaryOperators[node.operator];
        let rbinaryOperator = ops.RBinaryOperators[node.operator];
        let left = this.code.slice(node.left.start, node.left.end); 
        let right = this.code.slice(node.right.start, node.right.end); 
        if( binaryOperator === undefined ) { return length; }

        let res, offset;
        const isNum = function( node ) {
            if( node.value ) {
                if( node.value.type === "NumericPostfix" ) {
                    return false;
                }
            }
            if( node.type === "Literal" ) {
                return true;
            }
            if( node.type === "BinaryExpression" ) {
                if( isNum( node.left ) && isNum( node.right ) ) {
                    return true;
                }
            }
            return false;
        }
        // console.log( node );
        const isNumLeft = isNum(node.left); isNumRight = isNum(node.right);
        if( isNumLeft && isNumRight ) {
            res = left + ' ' + node.operator + ' ' + right;
        } else if( isNumLeft ) {
            res = `${CONST_STRING.SUPPORT_OBJ_OPERATOR}.${rbinaryOperator}(${right},${left})`;
        } else {
            res = `${CONST_STRING.SUPPORT_OBJ_OPERATOR}.${binaryOperator}(${left},${right})`;
        }

        offset = this.replaceCode( node, res );
        return length + offset;
    }

    let UnaryExpression = walkAST.UpdateNodes.UnaryExpression;
    walkAST.UpdateNodes.UnaryExpression = function (node) {
        let length = UnaryExpression.call(this, node);
        
        let unaryOperator = ops.UnaryOperators[node.operator];
        let argument = this.code.slice(node.argument.start, node.argument.end); 
        if( unaryOperator === undefined ) { return length; }

        let res, offset;
        if( node.argument.type === "Literal") {
            res = '(' + argument + ').' + unaryOperator + '()';
        } else {
            res = 'SupportBasOp.' + unaryOperator + '(' + argument + ')'
        }

        offset = this.replaceCode( node, res );
        return length + offset;
    },

    walkAST.UpdateNodes = UpdateNodes;
}


module.exports = {
    updateAcorn,
    updateWalkAST,
    CONST_STRING,
};

