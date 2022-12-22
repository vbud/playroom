import React from 'react';
import evalCode from 'src/utils/evalCode';

import CatchErrors from './CatchErrors';

interface Props {
  code: string | undefined;
  scope: Record<string, any>;
}

function Eval({ code, scope }: Props) {
  return evalCode(code, {
    ...scope,
    React,
  });
}

export default function RenderCode({ code, scope }: Props) {
  return (
    <CatchErrors code={code}>
      <Eval code={code} scope={scope} />
    </CatchErrors>
  );
}
