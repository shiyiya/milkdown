export default"# Parser\n\nParser is used to transform from markdown string to UI elements.\n\n## Transform Steps\n\nThe transformation will have following steps:\n\n1. The markdown string will be given to [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse) to compile into AST.\n2. The remark AST will be traversed by milkdown parser. The milkdown parser is generated by the parser property of nodes and marks and generate a prosemirror node tree as the result.\n3. The prosemirror node will rendered by prosemirror and generate the UI elements.\n\n## Example\n\nFor every node, there will be a parser specification which has the following structure:\n\n```typescript\nimport { nodeFactory } from '@milkdown/core';\n\nconst myNode = nodeFactory({\n    // other props...\n    parser: {\n        match: (node) => node.type === 'my-node',\n        runner: (state, node, type) => {\n            state.openNode(type).next(node.children).closeNode();\n        },\n    },\n});\n```\n\n## Parser Specification\n\nThe parser specification has 2 props:\n\n-   _match_: match the target remark node that need to be handled by this runner.\n\n-   _runner_: the function that transform the remark into prosemirror node, it has 3 parameters:\n\n    -   _state_: tools used to generate the prosemirror node.\n    -   _node_: the remark node that need to be handled.\n    -   _type_: the prosemirror _[nodeType](https://prosemirror.net/docs/ref/#model.NodeType)_ of current node,\n        defined by `schema` property of current node.\n\n## Parser State\n\nThe parser state is used to generate the prosemirror node,\nit provides several useful methods to make the transformation pretty simple.\n\nFirst of all, we should keep in mind that the tree we need to handle has following structure:\n\n```typescript\ninterface NodeTree {\n    type: string;\n    children: NodeTree[];\n    [x: string]: unknown;\n}\n```\n\nThen, it's easy to understand our state API.\n\n### openNode & closeNode\n\n`openNode` method will open a node, and all nodes created after this method will be set as the children of the node until a `closeNode` been called.\n\nYou can imagine `openNode` as the left half of parenthesis and `closeNode` as the right half. For nodes have children, your runner should just take care of the node itself and let other runners to handle the children.\n\nYou can pass the node's attributes as the second parameter for `openNode`.\n\n### addNode\n\n`addNode` means just add a node without open or close it. It's useful for nodes which don't have children.\n\nYou can pass the node's attributes as the second parameter.\n\n### next\n\n`next` give the node or node list back to the state and the state will find a proper runner (by `match` method) to handle it.\n\n### openMark & closeMark\n\nThese two APIs are pretty like `openNode` and `closeNode`, but just for marks.\n\nYou can pass the marks's attributes as the second parameter for `openMark`.\n";
