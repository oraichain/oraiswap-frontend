const template = require('@babel/template').default;
const { NodePath, PluginPass } = require('@babel/core');
const BabelTypes = require('@babel/types');

const OperatorOverloadDirectiveName = 'operator-overloading';

const methodMap = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div'
};

/**
 * @param {BabelTypes.Node} node
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
 * @param {BabelTypes.Node} node
 * @return {BabelTypes.Node}
 */
function createBinaryTemplate(node) {
  return template(`LHS.${methodMap[node.operator]}(RHS)`)({
    LHS: node.left.type === 'BinaryExpression' ? createBinaryTemplate(node.left) : node.left,
    RHS: node.right.type === 'BinaryExpression' ? createBinaryTemplate(node.right) : node.right
  }).expression;
}

/**
 * @param {{ types: BabelTypes }} t
 * @return {BabelTypes.Node}
 */
module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program: {
        /**
         * @param {NodePath} path
         * @param {PluginPass} state
         */
        enter(path, state) {
          if (!state.get(OperatorOverloadDirectiveName)) {
            state.set(OperatorOverloadDirectiveName, {
              classNames: state.opts.classNames ?? [],
              declarations: {}
            });
          }
        }
      },

      /**
       * @param {NodePath} path
       * @param {PluginPass} state
       */
      VariableDeclaration(path, state) {
        const { declarations, classNames } = state.get(OperatorOverloadDirectiveName);

        for (const d of path.node.declarations) {
          if (!d.init) continue;
          switch (d.init.type) {
            case 'NewExpression':
              if (classNames.includes(d.init.callee.name)) {
                declarations[d.id.name] = true;
              }
              break;

            case 'BinaryExpression':
              if (checkBigDecimalReturn(d.init, declarations, classNames)) {
                declarations[d.id.name] = true;
              }
              break;
          }
        }
      },

      /**
       * @param {NodePath} path
       * @param {PluginPass} state
       */
      BinaryExpression(path, state) {
        if (!methodMap[path.node.operator]) {
          return;
        }

        const { declarations, classNames } = state.get(OperatorOverloadDirectiveName);

        if (checkBigDecimalReturn(path.node, declarations, classNames)) {
          const expressionStatement = createBinaryTemplate(path.node);
          path.replaceWith(t.expressionStatement(expressionStatement, []));
        }
      }
    }
  };
};
