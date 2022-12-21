import { ComponentType } from 'react';
import omit from 'lodash/omit';
// @ts-ignore
import parsePropTypes from 'parse-prop-types';

const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

export type Components = Record<string, ComponentType>;
export type Hints = Record<string, Record<string, string[]>>;

export default function componentsToHints(components: Components): Hints {
  const componentNames = Object.keys(components).sort();

  return Object.assign(
    {},
    ...componentNames.map((componentName) => {
      const staticTypesForComponent = staticTypes[componentName];
      if (
        staticTypesForComponent &&
        Object.keys(staticTypesForComponent).length > 0
      ) {
        return {
          [componentName]: {
            attrs: staticTypesForComponent,
          },
        };
      }

      const parsedPropTypes = parsePropTypes(components[componentName]);
      const filteredPropTypes = omit(parsedPropTypes, 'children');
      const propNames = Object.keys(filteredPropTypes);

      return {
        [componentName]: Object.assign(
          {},
          ...propNames.map((propName) => {
            const propType = filteredPropTypes[propName].type;

            return {
              [propName]:
                propType.name === 'oneOf'
                  ? propType.value
                      .filter((x: any) => typeof x === 'string')
                      .map((x: string) => `"${x}"`)
                  : null,
            };
          })
        ),
      };
    })
  );
}
