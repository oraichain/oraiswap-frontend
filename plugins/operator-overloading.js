const babelTemplate = require('@babel/template');
const template = babelTemplate.default;

const OperatorOverloadDirectiveName = 'operator-overloading';

const methodMap = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div'
};

function createBinaryTemplate(op) {
  return template(`() => LHS.${methodMap[op]}(RHS)`);
}

function assignLeftNode(node) {
  return node.type === 'BinaryExpression'
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
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(
                state.opts.enabled == undefined ? false : state.opts.enabled
              );
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

        if (
          path.node.operator.endsWith('===') ||
          path.node.operator == '&&' ||
          path.node.operator == '||' ||
          path.node.operator == 'instanceof'
        ) {
          return;
        }

        const expressionStatement = createBinaryTemplate(path.node.operator)({
          LHS: assignLeftNode(path.node.left),
          RHS: path.node.right
        });

        path.replaceWith(t.callExpression(expressionStatement.expression, []));
      }
    }
  };
};
