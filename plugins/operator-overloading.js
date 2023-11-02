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
 * @param {{[key: string]: string;}} declarations
 * @param {Array<string>} classNames
 * @return {boolean}
 */
function checkClassNameReturn(node, declarations, classNames) {
  let leftNode = node.left;
  while (leftNode) {
    switch (leftNode.type) {
      case 'NewExpression':
        if (classNames.includes(leftNode.callee.name)) return leftNode.callee.name;

      case 'Identifier':
        const className = declarations[leftNode.name];
        if (className) return className;
    }

    leftNode = leftNode.left;
  }
  return false;
}

/**
 * @param {BabelTypes.Node} node
 * @param {string} className
 * @return {BabelTypes.Node}
 */
function createBinaryTemplate(node, className) {
  const LHS = node.left.type === 'BinaryExpression' ? createBinaryTemplate(node.left, className) : node.left;
  const RHS = node.right.type === 'BinaryExpression' ? createBinaryTemplate(node.right, className) : node.right;
  const lhsAssign = node.left.type.endsWith('Literal') ? `new ${className}(LHS)` : 'LHS';
  return template(`${lhsAssign}.${methodMap[node.operator]}(RHS)`)({
    LHS,
    RHS
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
                declarations[d.id.name] = d.init.callee.name;
              }
              break;

            case 'BinaryExpression':
              const className = checkClassNameReturn(d.init, declarations, classNames);
              if (className) {
                declarations[d.id.name] = className;
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
        const className = checkClassNameReturn(path.node, declarations, classNames);
        if (className) {
          const expressionStatement = createBinaryTemplate(path.node, className);
          path.replaceWith(t.expressionStatement(expressionStatement, []));
        }
      }
    }
  };
};
