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
 * @param {Array<string>} classNames
 * @return {boolean}
 */
function checkBigDecimalReturn(node, declarations, classNames) {
  let leftNode = node.left;
  while (leftNode) {
    switch (leftNode.type) {
      case 'NewExpression':
        if (classNames.includes(leftNode.callee.name)) return true;

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
          if (!state._map.has(OperatorOverloadDirectiveName)) {
            state._map.set(OperatorOverloadDirectiveName, {
              directives: [],
              classNames: state.opts.classNames ?? [],
              declarations: {}
            });
          }

          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              operatorOverloadState.directives.unshift(true);
              break;
            case false:
              operatorOverloadState.directives.unshift(false);
              break;
            default:
              // Default to false.
              operatorOverloadState.directives.unshift(state.opts.enabled ?? false);
              break;
          }
        },
        exit(path, state) {
          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
          if (hasOverloadingDirective(path.node.directives) !== false) {
            operatorOverloadState.directives.shift();
          }
        }
      },

      BlockStatement: {
        /**
         * @param {NodePath} path
         */
        enter(path, state) {
          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              operatorOverloadState.directives.unshift(true);
              break;
            case false:
              operatorOverloadState.directives.unshift(false);
              break;
          }
        },
        /**
         * @param {NodePath} path
         */
        exit(path, state) {
          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              operatorOverloadState.directives.shift();
              break;
          }
        }
      },
      /**
       * @param {NodePath} path
       */
      VariableDeclaration(path, state) {
        const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
        for (const d of path.node.declarations) {
          if (!d.init) continue;
          switch (d.init.type) {
            case 'NewExpression':
              if (operatorOverloadState.classNames.includes(d.init.callee.name)) {
                operatorOverloadState.declarations[d.id.name] = true;
              }
              break;

            case 'BinaryExpression':
              if (checkBigDecimalReturn(d.init, operatorOverloadState.declarations, operatorOverloadState.classNames)) {
                operatorOverloadState.declarations[d.id.name] = true;
              }
              break;
          }
        }
      },

      /**
       * @param {NodePath} path
       */
      BinaryExpression(path, state) {
        const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
        if (!operatorOverloadState.directives[0] || !methodMap[path.node.operator]) {
          return;
        }

        if (checkBigDecimalReturn(path.node, operatorOverloadState.declarations, operatorOverloadState.classNames)) {
          const expressionStatement = createBinaryTemplate(path.node);
          path.replaceWith(t.callExpression(expressionStatement, []));
        }
      }
    }
  };
};
