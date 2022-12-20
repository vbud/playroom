import React from 'react';
// @ts-ignore
import scopeEval from 'scope-eval';

import CatchErrors from './CatchErrors';

interface Props {
  code: string | undefined;
  scope: Record<string, any>;
}

function ScopeEval({ code, scope }: Props) {
  return scopeEval(code, {
    ...scope,
    React,
  });
}

export default function RenderCode({ code, scope }: Props) {
  return (
    <CatchErrors code={code}>
      <ScopeEval code={code} scope={scope} />
    </CatchErrors>
  );
}
