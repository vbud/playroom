import React from 'react';
import lzString from 'lz-string';

import { useParams } from 'src/utils/params';
import { Components } from 'src/utils/componentsToHints';
import { Canvas } from './Canvas/Canvas';

export interface PreviewProps {
  components: Components;
}
export default function Preview({ components }: PreviewProps) {
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
}
