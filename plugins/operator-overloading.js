const template = require('@babel/template').default;

const OperatorOverloadDirectiveName = 'operator-overloading';

const methodMap = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div'
};

function createBinaryTemplate(op, type) {
  return template(`() => {
    '${OperatorOverloadDirectiveName} disabled'
    return LHS.${methodMap[op]}(RHS)
  }`);
}

function assignLeftNode(node) {
  return node?.type === 'BinaryExpression'
    ? template(`LHS.${methodMap[node.operator]}(RHS)`)({
        LHS: assignLeftNode(node.left),
        RHS: node.right
      }).expression
    : node;
}

function hasDirective(directives, name, values) {
  for (const directive of directives) {
    if (directive.value.value.startsWith(name)) {
      const setting = directive.value.value.substring(name.length).trim().toLowerCase();
      return values[setting];
    }
  }
  return undefined;
}

function hasOverloadingDirective(directives) {
  return hasDirective(directives, OperatorOverloadDirectiveName, { enabled: true, disabled: false });
}

module.exports = function ({ types: t }) {
  return {
    pre(state) {
      const expressionStatement = template(`() => {
        '${OperatorOverloadDirectiveName} disabled'
        String.prototype.add = function(other) {
          return this + other
        }            
        String.prototype.sub = function(other) {
          return this - other
        }            
        String.prototype.mul = function(other) {
          return this * other
        }            
        String.prototype.div = function(other) {
          return this / other
        }
        Number.prototype.add = function(other) {
          return this + other
        }            
        Number.prototype.sub = function(other) {
          return this - other
        }            
        Number.prototype.mul = function(other) {
          return this * other
        }            
        Number.prototype.div = function(other) {
          return this / other
        }
      }`)();

      state.ast.program.body.unshift(t.callExpression(expressionStatement.expression, []));
    },
    visitor: {
      Program: {
        enter(path, state) {
          if (state.dynamicData === undefined) {
            state.dynamicData = {};
          }

          if (!state.dynamicData.hasOwnProperty(OperatorOverloadDirectiveName)) {
            state.dynamicData[OperatorOverloadDirectiveName] = {
              directives: []
            };
          }

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(true);
              break;
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(false);
              break;
            default:
              // Default to false.
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(state.opts.enabled ?? false);
              break;
          }
        },
        exit(path, state) {
          if (hasOverloadingDirective(path.node.directives) !== false) {
            state.dynamicData[OperatorOverloadDirectiveName].directives.shift();
          }
        }
      },

      BlockStatement: {
        enter(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(true);
              break;
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(false);
              break;
          }
        },
        exit(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.shift();
              break;
          }
        }
      },

      BinaryExpression(path, state) {
        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return;
        }

        if (!methodMap[path.node.operator]) {
          return;
        }

        const expressionStatement = createBinaryTemplate(
          path.node.operator,
          path.node.type
        )({
          LHS: assignLeftNode(path.node.left),
          RHS: path.node.right
        });

        path.replaceWith(t.callExpression(expressionStatement.expression, []));
      }
    }
  };
};
