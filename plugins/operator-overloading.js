const template = require('@babel/template').default;
const { NodePath } = require('@babel/traverse');
const { Node } = require('@babel/types');

const OperatorOverloadDirectiveName = 'operator-overloading';

const methodMap = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div'
};

/**
 * @param {Node} node
 * @param {{[key: string]: boolean;}} declarations
 * @return {boolean}
 */
function checkBigDecimalReturn(node, declarations) {
  let leftNode = node.left;
  while (leftNode) {
    switch (leftNode.type) {
      case 'NewExpression':
        if (leftNode.callee.name === 'BigDecimal') return true;

      case 'Identifier':
        if (declarations[leftNode.name]) return true;
    }

    leftNode = leftNode.left;
  }
  return false;
}

/**
 * @param {Node} node
 * @return {Node}
 */
function createBinaryTemplate(node) {
  return template(`() => {
    '${OperatorOverloadDirectiveName} disabled'
    return LHS.${methodMap[node.operator]}(RHS)
  }`)({
    LHS: assignNode(node.left),
    RHS: assignNode(node.right)
  }).expression;
}

/**
 * @param {Node} node
 * @return {Node}
 */
function assignNode(node) {
  return node.type === 'BinaryExpression'
    ? template(`LHS.${methodMap[node.operator]}(RHS)`)({
        LHS: assignNode(node.left),
        RHS: assignNode(node.right)
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
    // pre(state) {
    //   // polyfill BigDecimal
    //   const expressionStatement = template(`() => {
    //     globalThis.BigDecimal = require('@oraichain/oraidex-common').BigDecimal;
    //   }`)();

    //   state.ast.program.body.unshift(t.callExpression(expressionStatement.expression, []));
    // },
    visitor: {
      Program: {
        /**
         * @param {NodePath} path
         */
        enter(path, state) {
          if (state.dynamicData === undefined) {
            state.dynamicData = {};
          }

          if (!state.dynamicData.hasOwnProperty(OperatorOverloadDirectiveName)) {
            state.dynamicData[OperatorOverloadDirectiveName] = {
              directives: [],
              declarations: {}
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
        /**
         * @param {NodePath} path
         */
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
        /**
         * @param {NodePath} path
         */
        exit(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.shift();
              break;
          }
        }
      },
      /**
       * @param {NodePath} path
       */
      VariableDeclaration(path, state) {
        for (const d of path.node.declarations) {
          if (!d.init) continue;
          switch (d.init.type) {
            case 'NewExpression':
              if (d.init.callee.name === 'BigDecimal') {
                state.dynamicData[OperatorOverloadDirectiveName].declarations[d.id.name] = true;
              }
              break;

            case 'BinaryExpression':
              if (checkBigDecimalReturn(d.init, state.dynamicData[OperatorOverloadDirectiveName].declarations)) {
                state.dynamicData[OperatorOverloadDirectiveName].declarations[d.id.name] = true;
              }
              break;
          }
        }
      },

      /**
       * @param {NodePath} path
       */
      BinaryExpression(path, state) {
        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return;
        }

        if (!methodMap[path.node.operator]) {
          return;
        }

        if (checkBigDecimalReturn(path.node, state.dynamicData[OperatorOverloadDirectiveName].declarations)) {
          const expressionStatement = createBinaryTemplate(path.node);
          expressionStatement.init = { type: 'BigDecimal' };
          path.replaceWith(t.callExpression(expressionStatement, []));
        }
      }
    }
  };
};
