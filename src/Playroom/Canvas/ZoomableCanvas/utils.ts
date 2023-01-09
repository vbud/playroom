export function clamp(
  value: number,
  bounds?: readonly [number | undefined, number | undefined]
): number {
  if (bounds) {
    const [min, max] = bounds;
    if (min !== undefined && value < min) {
      return min;
    }
    if (max !== undefined && value > max) {
      return max;
    }
  }
  return value;
}

export function clampCenterOfLength(
  centerValue: number,
  length: number,
  bounds?: readonly [number | undefined, number | undefined]
): number {
  if (bounds) {
    const [min, max] = bounds;
    if (
      min !== undefined &&
      max !== undefined &&
      centerValue - length / 2 < min &&
      centerValue + length / 2 > max
    ) {
      // Return center of space
      return min + (max - min) / 2;
    }
    if (min !== undefined && centerValue - length / 2 < min) {
      return min + length / 2;
    }
    if (max !== undefined && centerValue + length / 2 > max) {
      return max - length / 2;
    }
  }
  return centerValue;
}

export function rectContainsPoint(
  clientRect: ClientRect,
  x: number,
  y: number
) {
  return (
    clientRect.left < x &&
    clientRect.right > x &&
    clientRect.top < y &&
    clientRect.bottom > y
  );
}

export function transitionNumber(
  start: number,
  end: number,
  percent: number
): number {
  return start + (end - start) * percent;
}

export function* walkElementHierarchyUp(
  leafElement: HTMLElement
): Iterable<HTMLElement> {
  let e: HTMLElement | null = leafElement;
  while (e) {
    yield e;
    e = e.parentElement;
  }
}

export const browserIsAndroid = navigator.userAgent.match(/Android/);
export const browserIsSafari = navigator.vendor.match(/Apple/);
export const browserIsSafariDesktop =
  browserIsSafari && typeof Touch === 'undefined';

export function isMouseEvent(e: MouseEvent | TouchEvent): e is MouseEvent {
  return (e as any).touches === undefined;
}
