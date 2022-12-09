import React, { ComponentType, useMemo, useRef } from 'react';

import { compileJsx } from 'src/utils/compileJsx';
// @ts-ignore
import RenderCode from './RenderCode';

import * as styles from './Canvas.css';

export interface CanvasProps {
  code: string;
  components: Record<string, ComponentType>;
}
export const Canvas = ({ code, components }: CanvasProps) => {
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
