import React, { useMemo, useRef } from 'react';

import { compileJsx } from 'src/utils/compileJsx';
import { Components } from 'src/utils/componentsToHints';
import RenderCode from '../../RenderCode/RenderCode';

import * as styles from './Frame.css';

export interface FrameProps {
  code: string;
  components: Components;
}
export const Frame = ({ code, components }: FrameProps) => {
  const lastValidCompiledRef = useRef<string | undefined>();
  const compiledCode = useMemo(() => {
    try {
      const compiled = compileJsx(code) ?? undefined;
      lastValidCompiledRef.current = compiled;
      return compiled;
    } catch {
      return lastValidCompiledRef.current;
    }
  }, [code]);

  return (
    <div className={styles.root}>
      <RenderCode code={compiledCode} scope={components} />
    </div>
  );
};
