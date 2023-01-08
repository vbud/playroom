export function isMetaOrCtrlExclusivelyPressed(
  e: KeyboardEvent | MouseEvent | WheelEvent
) {
  return (
    ((e.metaKey && !e.ctrlKey) || (e.ctrlKey && !e.metaKey)) &&
    !e.shiftKey &&
    !e.altKey
  );
}
