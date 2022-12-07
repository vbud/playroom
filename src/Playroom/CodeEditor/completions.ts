import { CompletionContext } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';
import { Hints } from 'src/utils/componentsToHints';

const validForIdentifier = /^\w*$/;
const validForAttributeStringValue = /^(\w|")*$/;

export function getCompletions(hints: Hints) {
  return [
    function jsx(context: CompletionContext) {
      const nodeCurrent = syntaxTree(context.state).resolveInner(context.pos);
      const nodeBefore = syntaxTree(context.state).resolveInner(
        context.pos,
        -1
      );
      // Keeping these around, they are helpful for debugging completions.
      // console.log(context.state.doc.lineAt(context.pos).text);
      // console.log('node', node.name, node);
      // console.log('nodeBefore', nodeBefore.name, nodeBefore);

      const componentNames = Object.keys(hints).map((name) => ({
        label: name,
      }));

      if (nodeBefore.name === 'JSXStartTag') {
        return {
          from: context.pos,
          options: componentNames,
          validFor: validForIdentifier,
        };
      } else if (
        nodeBefore.name === 'JSXIdentifier' &&
        nodeBefore.prevSibling?.name === 'JSXStartTag'
      ) {
        return {
          from: nodeBefore.from,
          options: componentNames,
          validFor: validForIdentifier,
        };
      }

      const getComponentName = (elementNode: SyntaxNode) => {
        const nameNode = elementNode.getChild('JSXIdentifier');
        return nameNode
          ? context.state.sliceDoc(nameNode.from, nameNode.to)
          : null;
      };
      const getPropNames = (elementNode: SyntaxNode) => {
        const existingProps: string[] = [];
        elementNode.getChildren('JSXAttribute').forEach((node) => {
          if (node.firstChild) {
            existingProps.push(
              context.state.sliceDoc(node.firstChild.from, node.firstChild.to)
            );
          }
        });

        const componentName = getComponentName(elementNode);

        if (!componentName) return [];

        return Object.keys(hints[componentName])
          .filter((propName) => !existingProps.includes(propName))
          .map((propName) => ({
            label: propName,
          }));
      };
      const getPropValues = (attributeNode: SyntaxNode) => {
        if (!attributeNode.parent || !attributeNode.firstChild) return [];

        const componentName = getComponentName(attributeNode.parent);

        if (!componentName) return [];

        const propName = context.state.sliceDoc(
          attributeNode.firstChild.from,
          attributeNode.firstChild.to
        );
        return (hints[componentName][propName] ?? []).map((value: string) => ({
          label: value,
        }));
      };

      if (
        (nodeCurrent.name === 'JSXSelfClosingTag' &&
          nodeBefore.name === 'JSXSelfClosingTag') ||
        (nodeCurrent.name === 'JSXOpenTag' && nodeBefore.name === 'JSXOpenTag')
      ) {
        return {
          from: context.pos,
          options: getPropNames(nodeCurrent),
          validFor: validForIdentifier,
        };
      } else if (
        nodeBefore.name === 'JSXIdentifier' &&
        nodeBefore.parent?.name === 'JSXAttribute'
      ) {
        return {
          from: nodeBefore.from,
          options: nodeBefore.parent?.parent
            ? getPropNames(nodeBefore.parent.parent)
            : [],
          validFor: validForIdentifier,
        };
      } else if (
        nodeBefore.name === 'Equals' &&
        nodeBefore.parent?.name === 'JSXAttribute'
      ) {
        return {
          from: context.pos,
          options: getPropValues(nodeBefore.parent),
          validFor: validForAttributeStringValue,
        };
      } else if (nodeCurrent.name === 'JSXAttributeValue') {
        const valueCode = context.state.sliceDoc(
          nodeCurrent.from,
          nodeCurrent.to
        );
        return {
          from: nodeCurrent.from,
          to:
            valueCode.indexOf('>') > -1
              ? nodeCurrent.from + valueCode.indexOf('>')
              : nodeCurrent.to,
          options: nodeCurrent.parent ? getPropValues(nodeCurrent.parent) : [],
          validFor: validForAttributeStringValue,
        };
      }

      return null;
    },
  ];
}
