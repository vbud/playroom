export default function evalCode(
  code: string | undefined,
  scope: Record<string, any>
) {
  // eslint-disable-next-line no-new-func
  return Function(...Object.keys(scope), `return ${code}`).apply(
    null,
    Object.values(scope)
  );
}
