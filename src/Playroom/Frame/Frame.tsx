import React, { useMemo, useRef } from 'react';

import { FrameConfig } from 'src/StoreContext/StoreContext';
import { compileJsx } from 'src/utils/compileJsx';
import { Components } from 'src/utils/componentsToHints';
import RenderCode from '../RenderCode/RenderCode';

import * as styles from './Frame.css';

export interface FrameProps {
  frameConfig: FrameConfig;
  components: Components;
}
export const Frame = ({ frameConfig, components }: FrameProps) => {
  const lastValidCompiledRef = useRef<string | undefined>();
  const compiledCode = useMemo(() => {
    try {
      const compiled = compileJsx(frameConfig.code) ?? undefined;
      lastValidCompiledRef.current = compiled;
      return compiled;
    } catch {
      return lastValidCompiledRef.current;
    }
  }, [frameConfig.code]);

  return (
    <div className={styles.root}>
      <RenderCode code={compiledCode} scope={components} />
    </div>
  );
};
