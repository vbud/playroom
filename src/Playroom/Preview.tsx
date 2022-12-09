import React, { ComponentType } from 'react';
import lzString from 'lz-string';

import { useParams } from 'src/utils/params';
import { Canvas } from './Canvas/Canvas';

export interface PreviewProps {
  components: Record<string, ComponentType>;
}
export default ({ components }: PreviewProps) => {
  const codeFromUrl = useParams((rawParams): string => {
    if (rawParams.code) {
      const decoded = lzString.decompressFromEncodedURIComponent(
        String(rawParams.code)
      );
      return decoded ? JSON.parse(decoded).code : '';
    }

    return '';
  });

  return <Canvas code={codeFromUrl} components={components} />;
};
