const ts = require("typescript");

// Replaces 'require' with 'import' in the Lua output,
// because Playdate uses a function called import, but I guess other platforms use require

// This has the side-effect of not being able to support the luaLibImport bundle, which is
// why it's set to inline in the TSConfig

/** @type {import("typescript-to-lua").Plugin} */
const plugin = {
  visitors: {
    [ts.SyntaxKind.CallExpression]: (node, context) => {
      if (ts.isIdentifier(node.expression) && node.expression.escapedText === "require") {
        const normalNode = context.superTransformExpression(node);
        normalNode.expression.text = "import"
        normalNode.expression.originalName = "import"
        return normalNode
        
      } else {
        return  context.superTransformExpression(node);
      }
    },
  },
};

module.exports = plugin
