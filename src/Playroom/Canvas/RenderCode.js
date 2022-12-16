import React from 'react';
import scopeEval from 'scope-eval';

import CatchErrors from './CatchErrors';

// eslint-disable-next-line import/no-unresolved
import useScope from '__PLAYROOM_ALIAS__USE_SCOPE__';

function ScopeEval({ code, scope }) {
  return scopeEval(code, {
    ...(useScope() ?? {}),
    ...scope,
    React,
  });
}

export default function RenderCode({ code, scope }) {
  return (
    <CatchErrors code={code}>
      <ScopeEval code={code} scope={scope} />
    </CatchErrors>
  );
}
