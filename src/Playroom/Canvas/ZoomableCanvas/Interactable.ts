import { NoPanArea } from './NoPanArea';
import { walkElementHierarchyUp } from './utils';

export type InteractableComponent = NoPanArea;

export const InteractableIdAttributeName = 'canvas-interactable-id';

/**
 * Helper function that returns the nearest ancestor element to the passed
 * element that is an interactable, or the element itself if it is interactable.
 */
export function getInteractableIdMostApplicableToElement(
  element: HTMLElement
): string | undefined {
  for (const e of walkElementHierarchyUp(element)) {
    const a = e.getAttribute(InteractableIdAttributeName);
    if (a) {
      return a;
    }
  }
  return undefined;
}
